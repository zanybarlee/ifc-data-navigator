
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

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
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">IFC-SG Automated Mapping</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((step, index) => (
              <div key={step} className="flex flex-col items-center space-y-2 relative">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    index + 1 === currentStep
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                      : index + 1 < currentStep
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {index + 1 < currentStep ? '✓' : index + 1}
                </div>
                <span className={`text-sm font-medium ${
                  index + 1 === currentStep
                    ? 'text-blue-700'
                    : index + 1 < currentStep
                    ? 'text-gray-700'
                    : 'text-gray-400'
                }`}>
                  {step}
                </span>
                {index < steps.length - 1 && (
                  <div className={`hidden sm:block absolute top-5 left-12 w-[calc(100%-3rem)] h-0.5 ${
                    index + 1 < currentStep ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="mt-8">
            <div className="flex justify-between mb-2">
              <Badge variant={currentStep >= 1 ? "default" : "secondary"} className="px-3 py-1">
                Step {currentStep} of {totalSteps}
              </Badge>
              <span className="text-sm text-gray-500">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
            </div>
            <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
          </div>
        </div>
        
        <main className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-100">
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
