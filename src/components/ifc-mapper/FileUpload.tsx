
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud, File, X, AlertCircle, FileText, FileSpreadsheet, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileUpload: (files: File[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);
    
    if (e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files);
      if (files.some(file => !isValidFileType(file))) {
        setError("One or more files are not supported. Please upload Excel, CSV, Word or text files only.");
      } else {
        setSelectedFiles(prevFiles => [...prevFiles, ...files]);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (files.some(file => !isValidFileType(file))) {
        setError("One or more files are not supported. Please upload Excel, CSV, Word or text files only.");
      } else {
        setSelectedFiles(prevFiles => [...prevFiles, ...files]);
      }
    }
  };

  const removeFile = (fileToRemove: File) => {
    setSelectedFiles(selectedFiles.filter(file => file !== fileToRemove));
  };

  const handleSubmit = () => {
    if (selectedFiles.length > 0) {
      onFileUpload(selectedFiles);
    } else {
      setError("Please select at least one file to upload");
    }
  };

  const isValidFileType = (file: File) => {
    const validTypes = [
      'application/vnd.ms-excel', 
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
      'text/csv', 
      'text/plain', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    return validTypes.includes(file.type);
  };

  const getFileIcon = (file: File) => {
    if (file.type.includes('spreadsheet') || file.type.includes('excel') || file.type.includes('csv')) {
      return <FileSpreadsheet className="w-5 h-5 text-green-600" />;
    } else if (file.type.includes('word') || file.type.includes('document')) {
      return <FileText className="w-5 h-5 text-blue-600" />;
    } else {
      return <File className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl text-center">Upload Non-BIM Data Files</CardTitle>
        <CardDescription className="text-center">
          Upload Excel, CSV, Word or text files to extract building object data
        </CardDescription>
      </CardHeader>
      <CardContent className="px-8 py-4">
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 sm:p-12 text-center cursor-pointer transition-all",
            isDragging 
              ? "border-blue-500 bg-blue-50" 
              : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('fileInput')?.click()}
        >
          <input
            id="fileInput"
            type="file"
            multiple
            className="hidden"
            onChange={handleFileChange}
            accept=".xlsx,.xls,.csv,.txt,.doc,.docx"
          />
          <div className="flex flex-col items-center">
            <div className={cn(
              "w-16 h-16 mb-4 rounded-full flex items-center justify-center transition-all",
              isDragging ? "bg-blue-100" : "bg-gray-100"
            )}>
              <UploadCloud size={32} className={cn(
                "transition-all", 
                isDragging ? "text-blue-500" : "text-gray-400"
              )} />
            </div>
            <p className="text-lg font-medium text-gray-700">
              Drag and drop files here
            </p>
            <p className="text-sm text-gray-500 mt-1">
              or click to browse
            </p>
            <div className="flex items-center justify-center space-x-2 mt-4">
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Excel</span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">CSV</span>
              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Word</span>
              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">Text</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2 shrink-0" />
            <span className="text-sm text-red-600">{error}</span>
          </div>
        )}

        {selectedFiles.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} selected
            </h3>
            <ul className="space-y-2 max-h-60 overflow-y-auto">
              {selectedFiles.map((file, index) => (
                <li key={`${file.name}-${index}`} className="flex items-center justify-between bg-white px-4 py-2 rounded border hover:bg-gray-50">
                  <div className="flex items-center overflow-hidden">
                    {getFileIcon(file)}
                    <div className="ml-2 overflow-hidden">
                      <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(file);
                    }}
                    className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-gray-100"
                    aria-label="Remove file"
                  >
                    <X size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter className="px-8 pb-6 flex flex-col sm:flex-row gap-3 justify-end">
        <Button
          variant="outline"
          onClick={() => setSelectedFiles([])}
          disabled={selectedFiles.length === 0}
        >
          Clear All
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={selectedFiles.length === 0}
          className="px-6"
        >
          Process {selectedFiles.length > 0 ? `${selectedFiles.length} File${selectedFiles.length > 1 ? 's' : ''}` : 'Files'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FileUpload;
