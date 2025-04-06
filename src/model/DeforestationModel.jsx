// models/DeforestationModel.jsx
import * as tf from '@tensorflow/tfjs';

export class DeforestationModel {
  constructor() {
    this.model = null;
    this.IMAGE_WIDTH = 224;
    this.IMAGE_HEIGHT = 224;
    this.NUM_CLASSES = 2; // Deforested vs. Forest
  }

  /**
   * Initialize the model
   */
  async initialize() {
    // Create a sequential model
    this.model = tf.sequential();

    // Add layers to the model
    // First convolutional layer
    this.model.add(tf.layers.conv2d({
      inputShape: [this.IMAGE_HEIGHT, this.IMAGE_WIDTH, 3],
      filters: 16,
      kernelSize: 3,
      activation: 'relu',
      padding: 'same'
    }));
    this.model.add(tf.layers.maxPooling2d({ poolSize: 2 }));

    // Second convolutional layer
    this.model.add(tf.layers.conv2d({
      filters: 32,
      kernelSize: 3,
      activation: 'relu',
      padding: 'same'
    }));
    this.model.add(tf.layers.maxPooling2d({ poolSize: 2 }));

    // Third convolutional layer
    this.model.add(tf.layers.conv2d({
      filters: 64,
      kernelSize: 3,
      activation: 'relu',
      padding: 'same'
    }));
    this.model.add(tf.layers.maxPooling2d({ poolSize: 2 }));

    // Flattening the output
    this.model.add(tf.layers.flatten());

    // Dense layers
    this.model.add(tf.layers.dense({ units: 128, activation: 'relu' }));
    this.model.add(tf.layers.dropout({ rate: 0.5 }));
    this.model.add(tf.layers.dense({ units: this.NUM_CLASSES, activation: 'softmax' }));

    // Compile the model
    this.model.compile({
      optimizer: 'adam',
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });

    console.log('Deforestation model initialized');
  }

  /**
   * Train the model with satellite imagery data
   */
  async train(images, labels, epochs = 10) {
    if (!this.model) {
      throw new Error('Model not initialized');
    }

    const history = await this.model.fit(images, labels, {
      epochs,
      validationSplit: 0.2,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(`Epoch ${epoch + 1} of ${epochs} completed`);
          if (logs) {
            console.log(`Loss: ${logs.loss.toFixed(4)}, Accuracy: ${logs.acc.toFixed(4)}`);
          }
        }
      }
    });

    return history;
  }

  /**
   * Preprocess an image before prediction
   */
  preprocess(imageData) {
    return tf.tidy(() => {
      let tensor;
      
      // Convert image to tensor
      if (imageData instanceof ImageData) {
        tensor = tf.browser.fromPixels(imageData);
      } else {
        tensor = tf.browser.fromPixels(imageData);
      }
      
      // Resize image
      const resized = tf.image.resizeBilinear(tensor, [this.IMAGE_HEIGHT, this.IMAGE_WIDTH]);
      
      // Normalize pixel values to [0, 1]
      const normalized = resized.div(tf.scalar(255));
      
      // Add batch dimension
      return normalized.expandDims(0);
    });
  }

  /**
   * Predict if an area is deforested from satellite imagery
   */
  async predict(image) {
    if (!this.model) {
      throw new Error('Model not initialized');
    }

    const preprocessedImage = this.preprocess(image);
    const prediction = await this.model.predict(preprocessedImage);
    const predictionData = await prediction.data();
    
    // Clean up tensors
    preprocessedImage.dispose();
    prediction.dispose();

    const deforestationScore = predictionData[1]; // Index 1 corresponds to "deforested" class
    const isDeforested = deforestationScore > 0.5;
    const confidence = Math.max(deforestationScore, 1 - deforestationScore);

    return {
      isDeforested,
      confidence,
      deforestationScore
    };
  }

  /**
   * Save the model to Firebase storage
   */
  async saveModel(path) {
    if (!this.model) {
      throw new Error('Model not initialized');
    }
    return await this.model.save(`indexeddb://${path}`);
  }

  /**
   * Load a pre-trained model
   */
  async loadModel(path) {
    try {
      this.model = await tf.loadLayersModel(`indexeddb://${path}`);
      console.log('Model loaded successfully');
    } catch (error) {
      console.error('Failed to load model:', error);
      throw error;
    }
  }

  /**
   * Analyze a sequence of satellite images to detect deforestation over time
   */
  async analyzeTimeSequence(images) {
    if (!this.model) {
      throw new Error('Model not initialized');
    }

    const results = await Promise.all(
      images.map(image => this.predict(image))
    );

    const deforestationTrend = results.map(result => result.deforestationScore);
    
    // Calculate deforestation rate (change per image in sequence)
    let deforestationRate = 0;
    if (deforestationTrend.length > 1) {
      const firstScore = deforestationTrend[0];
      const lastScore = deforestationTrend[deforestationTrend.length - 1];
      deforestationRate = (lastScore - firstScore) / (deforestationTrend.length - 1);
    }

    // Generate summary
    let summary = '';
    if (deforestationRate > 0.05) {
      summary = 'Severe deforestation detected with high confidence';
    } else if (deforestationRate > 0.02) {
      summary = 'Moderate deforestation detected';
    } else if (deforestationRate > 0) {
      summary = 'Slight deforestation detected';
    } else {
      summary = 'No deforestation detected or possible reforestation';
    }

    return {
      deforestationTrend,
      deforestationRate,
      summary
    };
  }
}

export default DeforestationModel;