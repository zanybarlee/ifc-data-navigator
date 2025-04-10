
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UploadCloud, File, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileUpload: (files: File[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

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
    
    if (e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files);
      setSelectedFiles(prevFiles => [...prevFiles, ...files]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(prevFiles => [...prevFiles, ...files]);
    }
  };

  const removeFile = (fileToRemove: File) => {
    setSelectedFiles(selectedFiles.filter(file => file !== fileToRemove));
  };

  const handleSubmit = () => {
    if (selectedFiles.length > 0) {
      onFileUpload(selectedFiles);
    }
  };

  const isValidFileType = (file: File) => {
    const validTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    return validTypes.includes(file.type);
  };

  return (
    <div className="p-8">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Upload Non-BIM Data Files</h2>
        <p className="mt-1 text-gray-600">
          Upload Excel, CSV, Word or text files to extract building object data
        </p>
      </div>

      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors",
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
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
          <UploadCloud size={48} className={cn("mb-4", isDragging ? "text-blue-500" : "text-gray-400")} />
          <p className="text-lg font-medium text-gray-700">
            Drag and drop files here
          </p>
          <p className="text-sm text-gray-500 mt-1">
            or click to browse
          </p>
          <p className="text-xs text-gray-400 mt-4">
            Supports Excel, CSV, Word and text files
          </p>
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Selected Files:</h3>
          <ul className="space-y-2">
            {selectedFiles.map((file, index) => (
              <li key={`${file.name}-${index}`} className="flex items-center justify-between bg-white px-4 py-2 rounded border">
                <div className="flex items-center">
                  <File size={18} className="text-gray-500 mr-2" />
                  <span className="text-sm">{file.name}</span>
                  {!isValidFileType(file) && (
                    <span className="ml-2 text-xs text-red-500">Unsupported file format</span>
                  )}
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(file);
                  }}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X size={18} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={selectedFiles.length === 0}
          className="px-6"
        >
          Process Files
        </Button>
      </div>
    </div>
  );
};

export default FileUpload;
