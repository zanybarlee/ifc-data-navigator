
import React from 'react';
import { Cube } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface IFCViewerProps {
  data: any[];
}

const IFCViewer: React.FC<IFCViewerProps> = ({ data }) => {
  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center">
          <Cube className="mr-2 h-5 w-5 text-blue-500" /> 
          IFC Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-100 rounded-md p-4 h-[350px] flex flex-col items-center justify-center border border-dashed border-gray-300">
          <div className="p-6 bg-white rounded-lg shadow-sm mb-4 flex items-center justify-center">
            <Cube size={64} className="text-blue-500" />
          </div>
          <p className="text-sm text-gray-600 text-center mb-1">
            IFC Viewer Preview
          </p>
          <p className="text-xs text-gray-500 text-center">
            {data.length} objects detected
          </p>
          <div className="mt-4 text-xs text-gray-400 text-center">
            <p>A full 3D viewer would be implemented in the production version.</p>
            <p>This would allow interactive exploration of IFC elements.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IFCViewer;
