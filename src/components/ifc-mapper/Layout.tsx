
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface LayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
}

const Layout: React.FC<LayoutProps> = ({ children, currentStep, totalSteps }) => {
  const steps = [
    'File Upload',
    'Data Preview',
    'Mapping Suggestions',
    'Missing Data',
    'Review & Confirm'
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-800">IFC-SG Automated Mapping</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((step, index) => (
              <div 
                key={step}
                className={`text-sm font-medium ${
                  index + 1 === currentStep
                    ? 'text-blue-700'
                    : index + 1 < currentStep
                    ? 'text-gray-700'
                    : 'text-gray-400'
                }`}
              >
                {index + 1}. {step}
              </div>
            ))}
          </div>
          <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
        </div>
        
        <main className="bg-white shadow overflow-hidden sm:rounded-lg">
          {children}
        </main>
      </div>
      
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 text-center text-sm text-gray-500">
            IFC-SG Automated Mapping Tool - MVP Version
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
