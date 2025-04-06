// utils/satelliteUtils.jsx
import * as tf from '@tensorflow/tfjs';

/**
 * Helper functions for working with satellite imagery for deforestation detection
 */
export const SatelliteUtils = {
  /**
   * Load an image from a URL and convert it to an ImageData object
   */
  async loadImageFromUrl(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
      img.src = url;
    });
  },

  /**
   * Split a large satellite image into smaller tiles for analysis
   */
  splitImageIntoTiles(image, tileWidth = 224, tileHeight = 224) {
    const tiles = [];
    const numTilesX = Math.floor(image.width / tileWidth);
    const numTilesY = Math.floor(image.height / tileHeight);

    for (let y = 0; y < numTilesY; y++) {
      for (let x = 0; x < numTilesX; x++) {
        const canvas = document.createElement('canvas');
        canvas.width = tileWidth;
        canvas.height = tileHeight;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          ctx.drawImage(
            image, 
            x * tileWidth, y * tileHeight, tileWidth, tileHeight,
            0, 0, tileWidth, tileHeight
          );
          tiles.push(canvas);
        }
      }
    }

    return tiles;
  },

  /**
   * Create a binary mask highlighting deforested areas
   */
  createDeforestationMask(originalImage, predictions, threshold = 0.5) {
    const canvas = document.createElement('canvas');
    canvas.width = originalImage.width;
    canvas.height = originalImage.height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Failed to create canvas context');
    }
    
    // Draw original image
    ctx.drawImage(originalImage, 0, 0);
    
    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Apply overlay for deforested areas
    for (let y = 0; y < predictions.length; y++) {
      for (let x = 0; x < predictions[y].length; x++) {
        if (predictions[y][x]) {
          // Calculate position in the original image
          const startX = x * 224;
          const startY = y * 224;
          const endX = Math.min(startX + 224, canvas.width);
          const endY = Math.min(startY + 224, canvas.height);
          
          // Apply red overlay with transparency
          for (let py = startY; py < endY; py++) {
            for (let px = startX; px < endX; px++) {
              const i = (py * canvas.width + px) * 4;
              data[i] = 255; // Red channel
              data[i + 3] = 128; // Alpha channel (semi-transparent)
            }
          }
        }
      }
    }
    
    // Put modified image data back on canvas
    ctx.putImageData(imageData, 0, 0);
    
    return canvas;
  },

  /**
   * Calculate vegetation index (NDVI) from RGB satellite image
   * This is a simplified approximation as true NDVI requires infrared bands
   */
  calculateApproximateNDVI(imageData) {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;
    const ndvi = Array(height).fill(0).map(() => Array(width).fill(0));
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Simplified NDVI approximation using RGB
        // True NDVI uses Near-Infrared and Red bands
        const approximateNDVI = (g - r) / (g + r + 0.01);
        ndvi[y][x] = approximateNDVI;
      }
    }
    
    return ndvi;
  }
};

export default SatelliteUtils;