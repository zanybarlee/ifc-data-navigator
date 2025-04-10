
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Info, ArrowRight } from 'lucide-react';

interface DataPreviewProps {
  data: any[];
  onContinue: () => void;
}

const DataPreview: React.FC<DataPreviewProps> = ({ data, onContinue }) => {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortColumn) return 0;
    
    const valueA = a[sortColumn];
    const valueB = b[sortColumn];
    
    if (valueA === undefined) return sortDirection === 'asc' ? 1 : -1;
    if (valueB === undefined) return sortDirection === 'asc' ? -1 : 1;
    
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return sortDirection === 'asc' 
        ? valueA.localeCompare(valueB) 
        : valueB.localeCompare(valueA);
    }
    
    return sortDirection === 'asc' 
      ? (valueA > valueB ? 1 : -1)
      : (valueA > valueB ? -1 : 1);
  });

  const renderSortIndicator = (column: string) => {
    if (sortColumn !== column) return null;
    return sortDirection === 'asc' ? '▲' : '▼';
  };
  
  // Helper to determine if a value has missing data
  const isMissingData = (value: any) => {
    return value === undefined || value === null;
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Data Preview</h2>
        <p className="mt-1 text-gray-600">
          Extracted {data.length} objects from the uploaded file(s)
        </p>
      </div>

      <div className="bg-blue-50 rounded-lg p-4 mb-6 flex items-start">
        <Info size={20} className="text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="font-medium text-blue-800">Data Extraction Complete</h3>
          <p className="text-sm text-blue-700 mt-1">
            Review the extracted data below. Items with missing information will be highlighted.
            Click column headers to sort the data.
          </p>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('id')}
                >
                  ID {renderSortIndicator('id')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('name')}
                >
                  Name {renderSortIndicator('name')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('type')}
                >
                  Type {renderSortIndicator('type')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('level')}
                >
                  Level {renderSortIndicator('level')}
                </TableHead>
                <TableHead>Dimensions</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('material')}
                >
                  Material {renderSortIndicator('material')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.level}</TableCell>
                  <TableCell className={isMissingData(item.dimensions) ? 'bg-red-50 text-red-600' : ''}>
                    {item.dimensions ? (
                      <span>W: {item.dimensions.width}m, H: {item.dimensions.height}m, D: {item.dimensions.depth}m</span>
                    ) : (
                      <span className="text-red-600">Missing</span>
                    )}
                  </TableCell>
                  <TableCell className={isMissingData(item.material) ? 'bg-red-50 text-red-600' : ''}>
                    {item.material || <span className="text-red-600">Missing</span>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">
            <span className="inline-block w-3 h-3 bg-red-50 border border-red-200 mr-1"></span>
            Highlighted cells indicate missing data that will need to be filled in later
          </p>
        </div>
        <Button onClick={onContinue} className="flex items-center">
          Continue to Mapping <ArrowRight size={16} className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default DataPreview;
