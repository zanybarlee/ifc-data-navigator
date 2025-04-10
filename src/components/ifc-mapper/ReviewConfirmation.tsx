
import { Button } from '@/components/ui/button';
import { Check, AlertTriangle, Download, RefreshCw } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import IFCViewer from './IFCViewer';

interface ReviewConfirmationProps {
  processedData: any[];
  missingData: Record<string, string[]>;
  onReset: () => void;
}

const ReviewConfirmation: React.FC<ReviewConfirmationProps> = ({
  processedData,
  missingData,
  onReset
}) => {
  const completedItemsCount = processedData.filter(
    item => !missingData[item.id] || missingData[item.id].length === 0
  ).length;
  
  const incompleteItemsCount = processedData.length - completedItemsCount;
  
  const completionPercentage = (completedItemsCount / processedData.length) * 100;

  // Mock export function
  const handleExport = () => {
    alert('Export functionality would be implemented in the final version. This would generate IFC-SG compatible data.');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Review & Confirmation</h2>
        <p className="text-gray-600">
          Review your processed data before exporting to IFC-SG format
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 border rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total Items</h3>
          <p className="text-2xl font-bold">{processedData.length}</p>
        </div>
        
        <div className="bg-white p-4 border rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Completed Items</h3>
          <p className="text-2xl font-bold text-green-600">{completedItemsCount}</p>
        </div>
        
        <div className="bg-white p-4 border rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Incomplete Items</h3>
          <p className="text-2xl font-bold text-yellow-600">{incompleteItemsCount}</p>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <h3 className="text-sm font-medium">Data Completion</h3>
          <span className="text-sm">{completionPercentage.toFixed(0)}%</span>
        </div>
        <Progress value={completionPercentage} className="h-2" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="space-y-6">
          {incompleteItemsCount > 0 && (
            <div className="bg-yellow-50 rounded-lg p-4 flex items-start">
              <AlertTriangle size={20} className="text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-yellow-800">Incomplete Data</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Some items have missing information. You can still export, but the resulting 
                  IFC-SG data may be incomplete.
                </p>
              </div>
            </div>
          )}
          
          {incompleteItemsCount === 0 && (
            <div className="bg-green-50 rounded-lg p-4 flex items-start">
              <Check size={20} className="text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-green-800">Complete Data</h3>
                <p className="text-sm text-green-700 mt-1">
                  All items have complete information and are ready for export to IFC-SG format.
                </p>
              </div>
            </div>
          )}
          
          <div className="border rounded-lg overflow-hidden">
            <div className="max-h-[350px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>IFC Entity</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processedData.map((item) => {
                    const isMissing = missingData[item.id] && missingData[item.id].length > 0;
                    
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.type}</TableCell>
                        <TableCell>{item.ifcType}</TableCell>
                        <TableCell>
                          {isMissing ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <AlertTriangle size={12} className="mr-1" />
                              Incomplete
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <Check size={12} className="mr-1" />
                              Ready
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
        
        <div>
          <IFCViewer data={processedData} />
        </div>
      </div>

      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={onReset}
          className="flex items-center"
        >
          <RefreshCw size={16} className="mr-2" /> Start New Mapping
        </Button>
        <Button 
          onClick={handleExport}
          className="flex items-center bg-green-600 hover:bg-green-700"
        >
          <Download size={16} className="mr-2" /> Export to IFC-SG
        </Button>
      </div>
    </div>
  );
};

export default ReviewConfirmation;
