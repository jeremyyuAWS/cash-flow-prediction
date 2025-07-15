import React from 'react';
import { Check, Clock, AlertTriangle } from 'lucide-react';

export type WorkflowStep = {
  id: string;
  label: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  icon: React.ReactNode;
};

interface WorkflowHeaderProps {
  steps: WorkflowStep[];
  currentStepId: string;
}

const WorkflowHeader: React.FC<WorkflowHeaderProps> = ({ steps, currentStepId }) => {
  const currentStepIndex = steps.findIndex(step => step.id === currentStepId);
  
  const getStepIcon = (step: WorkflowStep) => {
    switch (step.status) {
      case 'completed':
        return <Check size={18} className="text-white" />;
      case 'active':
        return step.icon;
      case 'error':
        return <AlertTriangle size={18} className="text-white" />;
      case 'pending':
      default:
        return <Clock size={18} className="text-white opacity-60" />;
    }
  };
  
  return (
    <div className="bg-white border-b border-gray-200 shadow-sm py-4 px-6 mb-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-800">Financial Intelligence Workflow</h2>
          <div className="text-sm text-gray-500">
            Step {currentStepIndex + 1} of {steps.length}
          </div>
        </div>
        
        <div className="relative pt-8 pb-4">
          {/* Progress line - positioned at the top, above the icons */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 z-0"></div>
          <div 
            className="absolute top-0 left-0 h-1 bg-indigo-600 z-0"
            style={{ 
              width: `${((currentStepIndex + (steps[currentStepIndex]?.status === 'active' ? 0.5 : 1)) / (steps.length - 1)) * 100}%` 
            }}
          ></div>
          
          {/* Steps - moved down below the line */}
          <div className="flex justify-between relative z-10 mt-4">
            {steps.map((step, index) => {
              const isActive = step.id === currentStepId;
              const isCompleted = step.status === 'completed';
              const isError = step.status === 'error';
              
              return (
                <div key={step.id} className="flex flex-col items-center">
                  {/* Position the icon at the top, aligned with the progress line */}
                  <div className="absolute -top-8 transform translate-x-0">
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center
                        ${isActive ? 'bg-indigo-600 ring-4 ring-indigo-100' : 
                          isCompleted ? 'bg-green-600' : 
                          isError ? 'bg-red-600' :
                          'bg-gray-300'}`}
                    >
                      {getStepIcon(step)}
                    </div>
                  </div>
                  
                  {/* Text content moved below */}
                  <div className="text-center mt-4">
                    <p className={`text-sm font-medium ${isActive ? 'text-indigo-600' : isCompleted ? 'text-green-600' : isError ? 'text-red-600' : 'text-gray-500'}`}>
                      {step.label}
                    </p>
                    <p className="text-xs text-gray-500 max-w-[120px] text-center">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowHeader;