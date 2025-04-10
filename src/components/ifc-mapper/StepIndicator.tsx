
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep, className = "" }) => {
  return (
    <div className={`flex flex-col space-y-4 ${className}`}>
      <div className="hidden sm:flex justify-between">
        {steps.map((step, index) => (
          <div key={step} className="flex flex-col items-center relative">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                index + 1 === currentStep
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : index + 1 < currentStep
                  ? 'border-green-500 bg-green-500 text-white'
                  : 'border-gray-300 bg-white text-gray-500'
              }`}
            >
              {index + 1 < currentStep ? <Check className="w-5 h-5" /> : index + 1}
            </div>
            <span className={`text-xs font-medium mt-2 ${
              index + 1 === currentStep
                ? 'text-blue-700'
                : index + 1 < currentStep
                ? 'text-gray-700'
                : 'text-gray-400'
            }`}>
              {step}
            </span>
            {index < steps.length - 1 && (
              <div className={`absolute top-5 left-10 w-[calc(100%-1.25rem)] h-0.5 ${
                index + 1 < currentStep ? 'bg-green-500' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>
      
      <div className="sm:hidden">
        <Badge variant="outline" className="w-full flex justify-between items-center">
          <span>Step {currentStep} of {steps.length}</span>
          <span className="font-medium">{steps[currentStep - 1]}</span>
        </Badge>
      </div>
    </div>
  );
};

export default StepIndicator;
