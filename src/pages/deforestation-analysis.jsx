// pages/deforestation-analysis.jsx
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Info } from 'lucide-react';
import DeforestationDashboard from '@/components/DeforestationDashboard';
import DeforestationModel from '@/models/DeforestationModel';

// Example regions with sample data
const regions = [
  {
    id: 'amazon',
    name: 'Amazon Rainforest',
    satelliteImageUrls: [
      '/api/placeholder/800/600', // These would be replaced with actual satellite images
      '/api/placeholder/800/600',
      '/api/placeholder/800/600',
      '/api/placeholder/800/600'
    ],
    dateLabels: ['Jan 2024', 'Apr 2024', 'Jul 2024', 'Oct 2024']
  },
  {
    id: 'borneo',
    name: 'Borneo',
    satelliteImageUrls: [
      '/api/placeholder/800/600',
      '/api/placeholder/800/600',
      '/api/placeholder/800/600'
    ],
    dateLabels: ['Feb 2024', 'Jun 2024', 'Oct 2024']
  },
  {
    id: 'congo',
    name: 'Congo Basin',
    satelliteImageUrls: [
      '/api/placeholder/800/600',
      '/api/placeholder/800/600',
      '/api/placeholder/800/600',
      '/api/placeholder/800/600',
      '/api/placeholder/800/600'
    ],
    dateLabels: ['Dec 2023', 'Mar 2024', 'May 2024', 'Aug 2024', 'Oct 2024']
  }
];

function DeforestationAnalysisPage() {
  const [selectedRegion, setSelectedRegion] = useState(regions[0]);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [modelStatus, setModelStatus] = useState('initializing');

  useEffect(() => {
    // Initialize the model
    const initModel = async () => {
      try {
        setModelStatus('loading');
        const model = new DeforestationModel();
        await model.initialize();
        
        try {
          await model.loadModel('greentrack-deforestation-model');
          setModelStatus('loaded');
        } catch (err) {
          console.log('Using new model instance');
          setModelStatus('initialized');
        }
        
        setModelLoaded(true);
      } catch (error) {
        console.error('Failed to initialize model:', error);
        setModelStatus('error');
      }
    };

    initModel();
  }, []);

  const handleRegionChange = (regionId) => {
    const region = regions.find(r => r.id === regionId);
    if (region) {
      setSelectedRegion(region);
    }
  };

  return (
    
    <div className="container mx-auto py-8">
        
      <div className="flex justify-between items-center mb-6">
        <div>
        <Link href="/deforestation-analysis">Deforestation Analysis</Link>
          <h1 className="text-3xl font-bold">Deforestation Analysis</h1>
          <p className="text-muted-foreground">
            Monitor forest cover changes using AI and satellite imagery
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Select
            value={selectedRegion.id}
            onValueChange={handleRegionChange}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Region" />
            </SelectTrigger>
            <SelectContent>
              {regions.map(region => (
                <SelectItem key={region.id} value={region.id}>
                  {region.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button>
            Add Custom Region
          </Button>
        </div>
      </div>
      
      {modelStatus === 'error' && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to initialize the deforestation model. Please refresh the page and try again.
          </AlertDescription>
        </Alert>
      )}
      
      {modelStatus === 'loading' && (
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertTitle>Loading Model</AlertTitle>
          <AlertDescription>
            The deforestation detection model is being initialized. This may take a moment...
          </AlertDescription>
        </Alert>
      )}
      
      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="settings">Model Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-4">
          {modelLoaded && (
            <DeforestationDashboard
              regionName={selectedRegion.name}
              satelliteImageUrls={selectedRegion.satelliteImageUrls}
              dateLabels={selectedRegion.dateLabels}
            />
          )}
        </TabsContent>
        
        <TabsContent value="comparison">
          <div className="flex items-center justify-center h-64 border rounded-lg">
            <p className="text-muted-foreground">Region comparison view coming soon</p>
          </div>
        </TabsContent>
        
        <TabsContent value="reports">
          <div className="flex items-center justify-center h-64 border rounded-lg">
            <p className="text-muted-foreground">Reports generator coming soon</p>
          </div>
        </TabsContent>
        
        <TabsContent value="settings">
          <div className="flex items-center justify-center h-64 border rounded-lg">
            <p className="text-muted-foreground">Model settings and training options coming soon</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default DeforestationAnalysisPage;