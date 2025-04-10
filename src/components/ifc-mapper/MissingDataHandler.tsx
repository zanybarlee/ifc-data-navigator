
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';

interface MissingDataHandlerProps {
  data: any[];
  missingData: Record<string, string[]>;
  onComplete: (updatedData: any[], remainingMissing: Record<string, string[]>) => void;
}

const MissingDataHandler: React.FC<MissingDataHandlerProps> = ({
  data,
  missingData,
  onComplete
}) => {
  const [workingData, setWorkingData] = useState([...data]);
  const [workingMissingData, setWorkingMissingData] = useState({...missingData});
  
  // Items that have missing data
  const itemsWithMissingData = data.filter(item => missingData[item.id] && missingData[item.id].length > 0);
  
  // Count of total missing fields
  const totalMissingFieldsCount = Object.values(missingData).reduce(
    (acc, fields) => acc + fields.length, 0
  );

  // Materials options
  const materialOptions = [
    'Concrete',
    'Wood',
    'Glass',
    'Steel',
    'Aluminum',
    'Brick',
    'Stone',
    'Plastic',
    'Ceramic',
    'Composite'
  ];

  // Update a specific field for an item
  const updateItemField = (itemId: string, field: string, value: any) => {
    // Update the working data
    setWorkingData(prevData => 
      prevData.map(item => {
        if (item.id !== itemId) return item;
        
        // For dimensions, we need to handle the nested structure
        if (field === 'width' || field === 'height' || field === 'depth') {
          const dimensions = item.dimensions || {};
          return {
            ...item,
            dimensions: {
              ...dimensions,
              [field]: parseFloat(value) || 0
            }
          };
        }
        
        // For other fields, directly update
        return {
          ...item,
          [field]: value
        };
      })
    );
    
    // Update missing data record
    setWorkingMissingData(prevMissing => {
      const updatedFields = prevMissing[itemId] ? 
        prevMissing[itemId].filter(f => f !== field) : 
        [];
      
      const updatedMissing = {
        ...prevMissing,
        [itemId]: updatedFields
      };
      
      // If no more missing fields for this item, remove the entry
      if (updatedFields.length === 0) {
        delete updatedMissing[itemId];
      }
      
      return updatedMissing;
    });
  };

  // Initialize dimensions object if missing
  const initDimensionsIfNeeded = (itemId: string) => {
    setWorkingData(prevData => 
      prevData.map(item => {
        if (item.id === itemId && !item.dimensions) {
          return {
            ...item,
            dimensions: { width: 0, height: 0, depth: 0 }
          };
        }
        return item;
      })
    );
  };

  const handleContinue = () => {
    onComplete(workingData, workingMissingData);
  };

  // Calculate completion percentage
  const completedItemsCount = Object.keys(missingData).length - Object.keys(workingMissingData).length;
  const completionPercentage = Object.keys(missingData).length > 0 
    ? (completedItemsCount / Object.keys(missingData).length) * 100
    : 100;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Missing Data</h2>
        <p className="text-gray-600">
          {totalMissingFieldsCount > 0 ? (
            `${totalMissingFieldsCount} fields require input across ${itemsWithMissingData.length} items`
          ) : (
            "All data fields are complete"
          )}
        </p>
      </div>

      {itemsWithMissingData.length > 0 ? (
        <div className="bg-yellow-50 rounded-lg p-4 mb-6 flex items-start">
          <AlertCircle size={20} className="text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-yellow-800">Missing Information Detected</h3>
            <p className="text-sm text-yellow-700 mt-1">
              Please complete the missing information below. You can also skip items
              and complete them later.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-green-50 rounded-lg p-4 mb-6 flex items-start">
          <AlertCircle size={20} className="text-green-500 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-green-800">All information is complete</h3>
            <p className="text-sm text-green-700 mt-1">
              All required data fields have been filled. You can proceed to the next step.
            </p>
          </div>
        </div>
      )}

      <div className="mb-6">
        <div className="h-2 bg-gray-200 rounded-full">
          <div 
            className="h-2 bg-blue-600 rounded-full" 
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-600">
          <span>{completedItemsCount} of {Object.keys(missingData).length} items completed</span>
          <span>{completionPercentage.toFixed(0)}% complete</span>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <Accordion type="single" collapsible className="w-full">
          {itemsWithMissingData.map((item) => {
            const missingFields = workingMissingData[item.id] || [];
            const hasMissingFields = missingFields.length > 0;
            
            return (
              <AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger className={`px-4 py-3 rounded-lg ${
                  hasMissingFields ? 'bg-red-50 text-red-900' : 'bg-green-50 text-green-900'
                }`}>
                  <div className="flex justify-between w-full items-center pr-4">
                    <span>{item.name} ({item.type})</span>
                    <span className="text-sm">
                      {hasMissingFields 
                        ? `${missingFields.length} fields missing` 
                        : 'Complete'}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 py-3 border border-gray-200 rounded-b-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Material Field */}
                    {(missingFields.includes('material') && (
                      <div className="space-y-2">
                        <Label htmlFor={`${item.id}-material`}>Material</Label>
                        <Select 
                          onValueChange={(value) => updateItemField(item.id, 'material', value)}
                          value={item.material || ''}
                        >
                          <SelectTrigger id={`${item.id}-material`}>
                            <SelectValue placeholder="Select material" />
                          </SelectTrigger>
                          <SelectContent>
                            {materialOptions.map(material => (
                              <SelectItem key={material} value={material}>{material}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ))}

                    {/* Dimensions Fields */}
                    {(missingFields.includes('dimensions') || 
                      missingFields.includes('width') || 
                      missingFields.includes('height') || 
                      missingFields.includes('depth')) && (
                      <div className="space-y-3 col-span-1 md:col-span-2">
                        <Label>Dimensions (meters)</Label>
                        <div className="grid grid-cols-3 gap-3">
                          {/* Width */}
                          {(missingFields.includes('dimensions') || missingFields.includes('width')) && (
                            <div className="space-y-1">
                              <Label htmlFor={`${item.id}-width`} className="text-xs">Width</Label>
                              <Input
                                id={`${item.id}-width`}
                                type="number"
                                step="0.01"
                                placeholder="Width"
                                value={item.dimensions?.width || ''}
                                onChange={(e) => {
                                  if (!item.dimensions) initDimensionsIfNeeded(item.id);
                                  updateItemField(item.id, 'width', e.target.value);
                                }}
                              />
                            </div>
                          )}

                          {/* Height */}
                          {(missingFields.includes('dimensions') || missingFields.includes('height')) && (
                            <div className="space-y-1">
                              <Label htmlFor={`${item.id}-height`} className="text-xs">Height</Label>
                              <Input
                                id={`${item.id}-height`}
                                type="number"
                                step="0.01"
                                placeholder="Height"
                                value={item.dimensions?.height || ''}
                                onChange={(e) => {
                                  if (!item.dimensions) initDimensionsIfNeeded(item.id);
                                  updateItemField(item.id, 'height', e.target.value);
                                }}
                              />
                            </div>
                          )}

                          {/* Depth */}
                          {(missingFields.includes('dimensions') || missingFields.includes('depth')) && (
                            <div className="space-y-1">
                              <Label htmlFor={`${item.id}-depth`} className="text-xs">Depth</Label>
                              <Input
                                id={`${item.id}-depth`}
                                type="number"
                                step="0.01"
                                placeholder="Depth"
                                value={item.dimensions?.depth || ''}
                                onChange={(e) => {
                                  if (!item.dimensions) initDimensionsIfNeeded(item.id);
                                  updateItemField(item.id, 'depth', e.target.value);
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleContinue} className="flex items-center">
          Continue to Review <ArrowRight size={16} className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default MissingDataHandler;
