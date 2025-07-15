import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Bot, Layers, Brain, MessageSquare, CheckCircle } from 'lucide-react';

interface OnboardingProps {
  isOpen: boolean;
  onClose: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(0);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Trigger animation after component mounts
      setTimeout(() => setAnimate(true), 100);
    } else {
      setAnimate(false);
    }
  }, [isOpen]);

  const steps = [
    {
      title: "Welcome to Financial AI Hub",
      description: "Your all-in-one platform for AI-powered cash flow prediction and liquidity risk management. Our intelligent agents work together to provide deep financial insights.",
      icon: <Bot size={48} className="text-indigo-600" />,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
    },
    {
      title: "Meet Your AI Agents",
      description: "Our system features specialized agents for each aspect of financial management. Each agent has unique capabilities but collaborates to provide comprehensive insights.",
      icon: <Layers size={48} className="text-indigo-600" />,
      image: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
    },
    {
      title: "Workflow Intelligence",
      description: "Follow our step-by-step workflow for optimal results. Start with data upload, analyze results, explore scenarios, and generate comprehensive reports.",
      icon: <Brain size={48} className="text-indigo-600" />,
      image: "https://images.unsplash.com/photo-1607703703520-bb638e84caf2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
    },
    {
      title: "Chat with Your Agents",
      description: "Each view includes a dedicated AI agent chat interface. Ask questions, request analysis, or get recommendations tailored to your financial data.",
      icon: <MessageSquare size={48} className="text-indigo-600" />,
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    // Save completion state to local storage
    localStorage.setItem('onboardingCompleted', 'true');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center transition-opacity duration-300 ${animate ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`bg-white rounded-xl shadow-2xl w-full max-w-4xl transition-transform duration-500 ${animate ? 'transform-none' : 'translate-y-8'}`}>
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close onboarding"
        >
          <X size={24} />
        </button>
        
        {/* Progress indicator */}
        <div className="px-8 pt-8">
          <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
            <div 
              className="bg-indigo-600 h-full transition-all duration-300 ease-out"
              style={{ width: `${((step + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Start</span>
            <span>Finish</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 p-8">
          {/* Content */}
          <div className="pr-4">
            <div className="mb-6">
              {steps[step].icon}
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{steps[step].title}</h2>
            <p className="text-gray-600 mb-8">{steps[step].description}</p>
            
            {/* Navigation */}
            <div className="flex items-center justify-between mt-auto">
              <button
                onClick={handlePrevious}
                className={`flex items-center justify-center px-4 py-2 rounded-lg border ${
                  step === 0 
                    ? 'border-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                disabled={step === 0}
              >
                <ChevronLeft size={16} className="mr-1" />
                Previous
              </button>
              
              <button
                onClick={handleNext}
                className="flex items-center justify-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors ml-auto"
              >
                {step === steps.length - 1 ? (
                  <>
                    <CheckCircle size={16} className="mr-1" />
                    Get Started
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight size={16} className="ml-1" />
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Image */}
          <div className="hidden md:block">
            <img 
              src={steps[step].image} 
              alt={steps[step].title}
              className="w-full h-full object-cover rounded-lg shadow-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;