import React, { useState, useEffect } from 'react';
import { X, Bot, ArrowRight } from 'lucide-react';

interface WelcomePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onStartOnboarding: () => void;
}

const WelcomePopup: React.FC<WelcomePopupProps> = ({ isOpen, onClose, onStartOnboarding }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setAnimate(true), 100);
    } else {
      setAnimate(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center transition-opacity duration-300 ${animate ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`bg-white rounded-xl shadow-2xl w-full max-w-lg transition-transform duration-500 ${animate ? 'transform-none' : 'scale-95'} p-6`}>
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X size={20} />
        </button>
        
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <Bot size={32} className="text-indigo-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-center mb-2">Welcome to Financial AI Hub</h2>
          <p className="text-gray-600 text-center mb-6">
            Your intelligent cash flow prediction and liquidity management platform powered by AI agents
          </p>
          
          <div className="w-full border-t border-gray-200 my-4"></div>
          
          <div className="grid grid-cols-2 gap-4 w-full mb-6">
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-1">AI-Powered Insights</h4>
              <p className="text-xs text-gray-600">Advanced forecasting with multiple AI models</p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-1">Agent Collaboration</h4>
              <p className="text-xs text-gray-600">Specialized agents working together</p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-1">Natural Language Interface</h4>
              <p className="text-xs text-gray-600">Chat with AI agents for instant insights</p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-1">Financial Intelligence</h4>
              <p className="text-xs text-gray-600">Deep analysis of liquidity and cash flow</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 w-full">
            <button
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Skip Tour
            </button>
            <button
              onClick={onStartOnboarding}
              className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
            >
              Start Tour
              <ArrowRight size={16} className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePopup;