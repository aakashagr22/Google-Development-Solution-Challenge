// components/DeforestationDashboard.jsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from 'recharts';
import { AlertCircle, Eye, BarChart, Calendar, Map } from 'lucide-react';
import DeforestationModel from '@/models/DeforestationModel';
import SatelliteUtils from '@/utils/satelliteUtils';

const DeforestationDashboard = ({
  regionName,
  satelliteImageUrls,
  dateLabels
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [model, setModel] = useState(null);
  const [deforestationTrend, setDeforestationTrend] = useState([]);
  const [deforestationRate, setDeforestationRate] = useState(0);
  const [summary, setSummary] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [chartData, setChartData] = useState([]);
  const canvasRef = useRef(null);

  useEffect(() => {
    const initializeModel = async () => {
      try {
        const deforestationModel = new DeforestationModel();
        await deforestationModel.initialize();
        setModel(deforestationModel);
        
        // Try to load a saved model first
        try {
          await deforestationModel.loadModel('greentrack-deforestation-model');
          console.log('Loaded existing model');
        } catch (err) {
          console.log('No saved model found, using the initialized model');
        }
        
        if (satelliteImageUrls.length > 0) {
          await analyzeImages(deforestationModel);
        }
      } catch (error) {
        console.error('Failed to initialize model:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeModel();
  }, []);

  useEffect(() => {
    if (model && satelliteImageUrls.length > 0) {
      analyzeImages(model);
    }
  }, [satelliteImageUrls]);

  useEffect(() => {
    if (deforestationTrend.length > 0 && dateLabels.length > 0) {
      const data = deforestationTrend.map((score, index) => ({
        date: dateLabels[index] || `Time ${index + 1}`,
        deforestationScore: score,
        forestCover: 1 - score
      }));
      setChartData(data);
    }
  }, [deforestationTrend, dateLabels]);

  useEffect(() => {
    displaySelectedImage();
  }, [selectedImageIndex]);

  const analyzeImages = async (deforestationModel) => {
    setIsLoading(true);
    try {
      const images = await Promise.all(
        satelliteImageUrls.map(url => SatelliteUtils.loadImageFromUrl(url))
      );
      
      const analysis = await deforestationModel.analyzeTimeSequence(images);
      
      setDeforestationTrend(analysis.deforestationTrend);
      setDeforestationRate(analysis.deforestationRate);
      setSummary(analysis.summary);
      
      displaySelectedImage();
    } catch (error) {
      console.error('Failed to analyze images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const displaySelectedImage = async () => {
    if (!canvasRef.current || satelliteImageUrls.length === 0) return;
    
    try {
      const image = await SatelliteUtils.loadImageFromUrl(
        satelliteImageUrls[selectedImageIndex]
      );
      
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;
      
      // Set canvas dimensions to match image
      canvasRef.current.width = image.width;
      canvasRef.current.height = image.height;
      
      // Draw the image
      ctx.drawImage(image, 0, 0);
    } catch (error) {
      console.error('Failed to display image:', error);
    }
  };

  const getRiskLevelColor = () => {
    if (deforestationRate > 0.05) return 'text-red-500';
    if (deforestationRate > 0.02) return 'text-amber-500';
    return 'text-green-500';
  };

  const getRiskLevel = () => {
    if (deforestationRate > 0.05) return 'High';
    if (deforestationRate > 0.02) return 'Medium';
    return 'Low';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Deforestation Analysis: {regionName}</CardTitle>
              <CardDescription>
                Satellite imagery analysis using TensorFlow.js
              </CardDescription>
            </div>
            {isLoading && <Progress value={30} className="w-24" />}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-2">
              <div className="border rounded-lg overflow-hidden bg-black">
                <canvas 
                  ref={canvasRef} 
                  className="w-full h-64 md:h-96 object-contain"
                />
              </div>
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {dateLabels[selectedImageIndex] || 'No date available'}
                </div>
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  Image {selectedImageIndex + 1} of {satelliteImageUrls.length}
                </div>
              </div>
              <div className="flex space-x-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedImageIndex(Math.max(0, selectedImageIndex - 1))}
                  disabled={selectedImageIndex === 0}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedImageIndex(Math.min(satelliteImageUrls.length - 1, selectedImageIndex + 1))}
                  disabled={selectedImageIndex === satelliteImageUrls.length - 1}
                >
                  Next
                </Button>
              </div>
            </div>
            
            <div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Risk Assessment</h3>
                  <div className="flex items-center mt-2">
                    <AlertCircle className={`w-5 h-5 mr-2 ${getRiskLevelColor()}`} />
                    <span className={`font-bold ${getRiskLevelColor()}`}>
                      {getRiskLevel()} Risk
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{summary}</p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium">Deforestation Rate</h3>
                  <div className="mt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Change Rate</span>
                      <span>{(deforestationRate * 100).toFixed(2)}%</span>
                    </div>
                    <Progress 
                      value={Math.min(100, deforestationRate * 300)} 
                      className={deforestationRate > 0.02 ? 'bg-amber-100' : 'bg-green-100'}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium flex items-center">
                    <Map className="w-4 h-4 mr-2" />
                    Region Data
                  </h3>
                  <dl className="mt-2 space-y-1 text-sm">
                    <div className="flex justify-between">
                      <dt>Region:</dt>
                      <dd>{regionName}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt>Time Period:</dt>
                      <dd>
                        {dateLabels.length > 0 ? 
                          `${dateLabels[0]} - ${dateLabels[dateLabels.length - 1]}` : 
                          'N/A'}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt>Current Forest Cover:</dt>
                      <dd>
                        {deforestationTrend.length > 0 ? 
                          `${((1 - deforestationTrend[deforestationTrend.length - 1]) * 100).toFixed(1)}%` : 
                          'N/A'}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium flex items-center mb-4">
              <BarChart className="w-4 h-4 mr-2" />
              Deforestation Trend Analysis
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="deforestationScore" 
                    name="Deforestation" 
                    stroke="#ef4444" 
                    activeDot={{ r: 8 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="forestCover" 
                    name="Forest Cover" 
                    stroke="#22c55e" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            Powered by TensorFlow.js • Last updated: {new Date().toLocaleDateString()}
          </p>
          <Button size="sm" variant="outline">
            Download Report
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DeforestationDashboard;