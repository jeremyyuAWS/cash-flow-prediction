import React from 'react';
import { 
  BarChart4, FileText, Upload, AlertTriangle, Settings, Database, 
  TrendingUp, LineChart, Sliders, Bot
} from 'lucide-react';

type AgentIconProps = {
  id: string;
  size?: number;
  className?: string;
};

const AgentIcon: React.FC<AgentIconProps> = ({ id, size = 20, className = "" }) => {
  switch (id) {
    case 'dashboard':
      return <BarChart4 size={size} className={className} />;
    case 'scenarios':
      return <TrendingUp size={size} className={className} />;
    case 'analytics':
      return <LineChart size={size} className={className} />;
    case 'reports':
      return <FileText size={size} className={className} />;
    case 'upload':
      return <Upload size={size} className={className} />;
    case 'integration':
      return <Database size={size} className={className} />;
    case 'alerts':
      return <AlertTriangle size={size} className={className} />;
    case 'model':
      return <Sliders size={size} className={className} />;
    case 'settings':
      return <Settings size={size} className={className} />;
    default:
      return <Bot size={size} className={className} />;
  }
};

export default AgentIcon;