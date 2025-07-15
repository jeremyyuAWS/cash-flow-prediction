import React, { useState, useEffect, useRef } from 'react';
import { HelpCircle, X } from 'lucide-react';

interface FeatureTooltipProps {
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactNode;
  id: string;
}

const FeatureTooltip: React.FC<FeatureTooltipProps> = ({ 
  title, 
  description, 
  position = 'top', 
  children,
  id
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Check if this tooltip has been dismissed before
  useEffect(() => {
    const dismissedTooltips = localStorage.getItem('dismissedTooltips');
    if (dismissedTooltips) {
      const dismissed = JSON.parse(dismissedTooltips);
      if (dismissed.includes(id)) {
        setDismissed(true);
      }
    }
  }, [id]);

  const handleDismiss = () => {
    setIsOpen(false);
    setDismissed(true);
    
    // Save dismissed state to localStorage
    const dismissedTooltips = localStorage.getItem('dismissedTooltips');
    let dismissed = dismissedTooltips ? JSON.parse(dismissedTooltips) : [];
    if (!dismissed.includes(id)) {
      dismissed.push(id);
      localStorage.setItem('dismissedTooltips', JSON.stringify(dismissed));
    }
  };

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen && 
        containerRef.current && 
        tooltipRef.current && 
        !containerRef.current.contains(event.target as Node) &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Position classes
  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  const arrowClasses = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-t-indigo-600 border-l-transparent border-r-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-b-indigo-600 border-l-transparent border-r-transparent border-t-transparent',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-l-indigo-600 border-t-transparent border-b-transparent border-r-transparent',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-r-indigo-600 border-t-transparent border-b-transparent border-l-transparent'
  };

  if (dismissed) {
    return <>{children}</>;
  }

  return (
    <div className="relative inline-block" ref={containerRef}>
      <div className="relative group">
        {children}
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="absolute -top-1 -right-1 bg-indigo-100 text-indigo-600 rounded-full p-0.5 border border-indigo-200 hover:bg-indigo-200 transition-colors"
          >
            <HelpCircle size={14} />
          </button>
        )}
      </div>
      
      {isOpen && (
        <div 
          className={`absolute z-50 w-64 ${positionClasses[position]}`}
          ref={tooltipRef}
        >
          <div className="bg-indigo-600 text-white rounded-lg shadow-lg p-4">
            <button 
              onClick={handleDismiss}
              className="absolute top-2 right-2 text-white/80 hover:text-white"
            >
              <X size={14} />
            </button>
            
            <h4 className="font-bold text-sm mb-1">{title}</h4>
            <p className="text-xs text-white/90">{description}</p>
            
            <div className={`absolute w-0 h-0 border-4 ${arrowClasses[position]}`}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeatureTooltip;