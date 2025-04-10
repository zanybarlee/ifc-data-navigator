
import { useState } from 'react';
import { 
  Layout, 
  FileUpload, 
  DataPreview, 
  MappingSuggestions, 
  MissingDataHandler, 
  ReviewConfirmation,
  StepIndicator
} from '@/components/ifc-mapper';

const Index = () => {
  // Current step in the workflow
  const [currentStep, setCurrentStep] = useState(1);
  // Uploaded files
  const [files, setFiles] = useState<File[]>([]);
  // Extracted data from files
  const [extractedData, setExtractedData] = useState<any[]>([]);
  // Mapping suggestions for each item
  const [mappings, setMappings] = useState<Record<string, string>>({});
  // Missing data fields that need user input
  const [missingData, setMissingData] = useState<Record<string, string[]>>({});
  // Final processed data
  const [processedData, setProcessedData] = useState<any[]>([]);
  
  // Define the steps for our workflow
  const steps = [
    'File Upload',
    'Data Preview',
    'Mapping Suggestions',
    'Missing Data',
    'Review & Confirm'
  ];
  
  // Handle file upload
  const handleFileUpload = (uploadedFiles: File[]) => {
    setFiles(uploadedFiles);
    
    // Mock data extraction from files
    const mockExtractedData = mockDataExtraction(uploadedFiles);
    setExtractedData(mockExtractedData);
    
    // Generate initial mapping suggestions
    const initialMappings = generateMappingSuggestions(mockExtractedData);
    setMappings(initialMappings);
    
    // Identify missing data
    const missingFields = identifyMissingData(mockExtractedData);
    setMissingData(missingFields);
    
    setCurrentStep(2);
  };
  
  // Progress to mapping suggestions step
  const handleDataPreviewComplete = () => {
    setCurrentStep(3);
  };
  
  // Progress to missing data step
  const handleMappingComplete = (updatedMappings: Record<string, string>) => {
    setMappings(updatedMappings);
    setCurrentStep(4);
  };
  
  // Progress to review step
  const handleMissingDataComplete = (updatedData: any[], remainingMissing: Record<string, string[]>) => {
    setExtractedData(updatedData);
    setMissingData(remainingMissing);
    
    // Create the processed data set
    const processed = updatedData.map(item => ({
      ...item,
      ifcType: mappings[item.id] || 'IFCUndefined',
      status: remainingMissing[item.id] && remainingMissing[item.id].length > 0 ? 'incomplete' : 'ready'
    }));
    setProcessedData(processed);
    
    setCurrentStep(5);
  };
  
  // Reset workflow to start
  const handleReset = () => {
    setFiles([]);
    setExtractedData([]);
    setMappings({});
    setMissingData({});
    setProcessedData([]);
    setCurrentStep(1);
  };
  
  // Mock function to extract data from uploaded files
  const mockDataExtraction = (files: File[]) => {
    // This would actually parse the files in a real implementation
    const mockData = [];
    
    // Generate between 5-15 mock items
    const itemCount = Math.floor(Math.random() * 10) + 5;
    
    for (let i = 0; i < itemCount; i++) {
      const itemType = ['Door', 'Window', 'Wall', 'Stair', 'Column', 'Beam', 'Slab', 'Roof'][Math.floor(Math.random() * 8)];
      
      mockData.push({
        id: `item-${i+1}`,
        name: `${itemType} ${i+1}`,
        type: itemType,
        level: Math.floor(Math.random() * 5) + 1,
        dimensions: Math.random() > 0.7 ? undefined : {
          width: parseFloat((Math.random() * 2 + 0.5).toFixed(2)),
          height: parseFloat((Math.random() * 3 + 1).toFixed(2)),
          depth: parseFloat((Math.random() * 0.5 + 0.1).toFixed(2))
        },
        material: Math.random() > 0.5 ? ['Concrete', 'Wood', 'Glass', 'Steel', 'Aluminum'][Math.floor(Math.random() * 5)] : undefined
      });
    }
    
    return mockData;
  };
  
  // Generate mapping suggestions based on item properties
  const generateMappingSuggestions = (data: any[]) => {
    const suggestions: Record<string, string> = {};
    
    data.forEach(item => {
      // Simple type-based mapping logic
      switch (item.type.toLowerCase()) {
        case 'door':
          suggestions[item.id] = 'IFCDoor';
          break;
        case 'window':
          suggestions[item.id] = 'IFCWindow';
          break;
        case 'wall':
          suggestions[item.id] = 'IFCWall';
          break;
        case 'stair':
          suggestions[item.id] = 'IFCStair';
          break;
        case 'column':
          suggestions[item.id] = 'IFCColumn';
          break;
        case 'beam':
          suggestions[item.id] = 'IFCBeam';
          break;
        case 'slab':
          suggestions[item.id] = 'IFCSlab';
          break;
        case 'roof':
          suggestions[item.id] = 'IFCRoof';
          break;
        default:
          suggestions[item.id] = 'IFCBuildingElement';
      }
    });
    
    return suggestions;
  };
  
  // Identify missing data fields that need to be filled
  const identifyMissingData = (data: any[]) => {
    const missingFields: Record<string, string[]> = {};
    
    data.forEach(item => {
      const missing: string[] = [];
      
      if (!item.dimensions) {
        missing.push('dimensions');
      } else {
        if (!item.dimensions.width) missing.push('width');
        if (!item.dimensions.height) missing.push('height');
        if (!item.dimensions.depth) missing.push('depth');
      }
      
      if (!item.material) {
        missing.push('material');
      }
      
      if (missing.length > 0) {
        missingFields[item.id] = missing;
      }
    });
    
    return missingFields;
  };
  
  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <FileUpload onFileUpload={handleFileUpload} />;
      case 2:
        return <DataPreview data={extractedData} onContinue={handleDataPreviewComplete} />;
      case 3:
        return <MappingSuggestions data={extractedData} mappings={mappings} onComplete={handleMappingComplete} />;
      case 4:
        return <MissingDataHandler data={extractedData} missingData={missingData} onComplete={handleMissingDataComplete} />;
      case 5:
        return <ReviewConfirmation processedData={processedData} missingData={missingData} onReset={handleReset} />;
      default:
        return <FileUpload onFileUpload={handleFileUpload} />;
    }
  };
  
  return (
    <Layout currentStep={currentStep} totalSteps={5}>
      {renderStep()}
    </Layout>
  );
};

export default Index;
