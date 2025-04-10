
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';

interface MappingSuggestionsProps {
  data: any[];
  mappings: Record<string, string>;
  onComplete: (updatedMappings: Record<string, string>) => void;
}

const MappingSuggestions: React.FC<MappingSuggestionsProps> = ({ 
  data, 
  mappings, 
  onComplete 
}) => {
  const [currentMappings, setCurrentMappings] = useState<Record<string, string>>(mappings);

  const ifcEntityOptions = [
    'IFCDoor',
    'IFCWindow',
    'IFCWall',
    'IFCSlab',
    'IFCBeam',
    'IFCColumn',
    'IFCStair',
    'IFCRoof',
    'IFCRailing',
    'IFCCovering',
    'IFCFurnishingElement',
    'IFCBuildingElement'
  ];

  // Calculate confidence level for mapping suggestion based on name/type match
  const getConfidenceLevel = (item: any, mappedType: string) => {
    const itemNameLower = item.name.toLowerCase();
    const itemTypeLower = item.type.toLowerCase();
    const mappedTypeLower = mappedType.toLowerCase().replace('ifc', '');

    // Direct type match (high confidence)
    if (itemTypeLower === mappedTypeLower) {
      return 'high';
    }
    
    // Name contains the type (medium confidence)
    if (itemNameLower.includes(mappedTypeLower) || mappedTypeLower.includes(itemTypeLower)) {
      return 'medium';
    }
    
    // Related terms (medium-low confidence)
    const relatedTerms: Record<string, string[]> = {
      'door': ['entrance', 'exit', 'doorway'],
      'window': ['glazing', 'opening'],
      'wall': ['partition', 'divider'],
      'slab': ['floor', 'ceiling'],
      'beam': ['girder', 'joist'],
      'column': ['pillar', 'post'],
      'stair': ['steps', 'stairway', 'staircase'],
      'roof': ['roofing', 'cover', 'ceiling']
    };

    if (relatedTerms[mappedTypeLower]?.some(term => 
      itemNameLower.includes(term) || itemTypeLower.includes(term)
    )) {
      return 'medium';
    }
    
    // Low confidence (fallback)
    return 'low';
  };

  // Handle mapping change
  const handleMappingChange = (itemId: string, value: string) => {
    setCurrentMappings(prev => ({
      ...prev,
      [itemId]: value
    }));
  };

  const handleContinue = () => {
    onComplete(currentMappings);
  };

  // Render confidence badge
  const renderConfidenceBadge = (level: string) => {
    switch (level) {
      case 'high':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">High confidence</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Medium confidence</Badge>;
      case 'low':
      default:
        return <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">Low confidence</Badge>;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">IFC Mapping Suggestions</h2>
        <p className="text-gray-600">
          Review and modify the suggested IFC entity mappings
        </p>
      </div>
      
      <div className="border rounded-lg overflow-hidden mb-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Suggested IFC Entity</TableHead>
              <TableHead>Confidence</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map(item => {
              const mappedEntity = currentMappings[item.id] || 'IFCBuildingElement';
              const confidenceLevel = getConfidenceLevel(item, mappedEntity);
              
              return (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>
                    <Select 
                      value={mappedEntity}
                      onValueChange={(value) => handleMappingChange(item.id, value)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Select entity" />
                      </SelectTrigger>
                      <SelectContent>
                        {ifcEntityOptions.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {renderConfidenceBadge(confidenceLevel)}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="mt-8 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          <p>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 mr-2">High confidence</Badge>
            Strong match between item attributes and IFC entity
          </p>
          <p className="mt-1">
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 mr-2">Medium confidence</Badge>
            Possible match based on partial attribute correlation
          </p>
          <p className="mt-1">
            <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200 mr-2">Low confidence</Badge>
            Weak match, please verify manually
          </p>
        </div>
        <Button onClick={handleContinue} className="flex items-center">
          Continue to Missing Data <ArrowRight size={16} className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default MappingSuggestions;
