import { createContext, useContext } from 'react';

// Define agent types
export type AgentType = 
  | 'data-agent' 
  | 'analysis-agent' 
  | 'insights-agent' 
  | 'scenario-agent' 
  | 'reporting-agent'
  | 'integration-agent'
  | 'alert-agent'
  | 'model-agent'
  | 'settings-agent'
  | 'assistant-agent';

// Define agent information type
export interface AgentInfo {
  id: AgentType;
  number: string;
  name: string;
  description: string;
  expertise: string[];
  icon: string;
}

// Define conversation message
export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  agentId?: AgentType;
  markdown?: boolean;
  feedback?: 'positive' | 'negative' | null;
  referenceData?: any;
  isReference?: boolean;
  referenceAgent?: AgentType;
}

// Conversation memory context for each agent
export interface AgentMemory {
  conversationHistory: ChatMessage[];
  lastInteraction: Date | null;
  userPreferences: {
    preferredMetrics: string[];
    communicationStyle: 'detailed' | 'concise' | 'balanced';
    dataVisualizationPreference: 'charts' | 'tables' | 'text';
  };
  knownEntities: {
    importantDates: string[];
    keyMetrics: { name: string; value: any }[];
    businessContext: Record<string, any>;
  };
}

// Agent system context
export interface AgentContext {
  agents: Record<AgentType, AgentInfo>;
  memories: Record<AgentType, AgentMemory>;
  activeAgent: AgentType;
  latestUserMessage: string | null;
  currentView: string;
  saveMessage: (message: ChatMessage) => void;
  getConversationFor: (agentId: AgentType) => ChatMessage[];
  setActiveAgent: (agentId: AgentType) => void;
  setUserPreference: (agentId: AgentType, key: string, value: any) => void;
}

// Default agent configuration
export const agentConfig: Record<AgentType, AgentInfo> = {
  'data-agent': {
    id: 'data-agent',
    number: 'Agent-01',
    name: 'Data Agent',
    description: 'I help you prepare and upload your financial data for analysis.',
    expertise: ['data-processing', 'file-formats', 'data-validation', 'data-preparation'],
    icon: 'upload'
  },
  'analysis-agent': {
    id: 'analysis-agent',
    number: 'Agent-02',
    name: 'Analysis Agent',
    description: 'I analyze your financial metrics and provide insights on your cash flow forecast.',
    expertise: ['financial-metrics', 'kpi-analysis', 'cash-flow-analysis', 'trend-detection'],
    icon: 'dashboard'
  },
  'insights-agent': {
    id: 'insights-agent',
    number: 'Agent-03',
    name: 'Insights Agent',
    description: 'I provide deep financial analysis and pattern recognition to help you optimize your working capital.',
    expertise: ['pattern-recognition', 'seasonality-analysis', 'anomaly-detection', 'cash-conversion-cycle'],
    icon: 'analytics'
  },
  'scenario-agent': {
    id: 'scenario-agent',
    number: 'Agent-04',
    name: 'Scenario Agent',
    description: 'I simulate different financial scenarios to help you understand potential outcomes.',
    expertise: ['scenario-planning', 'what-if-analysis', 'risk-assessment', 'sensitivity-analysis'],
    icon: 'scenarios'
  },
  'reporting-agent': {
    id: 'reporting-agent',
    number: 'Agent-05',
    name: 'Reporting Agent',
    description: 'I help you create and customize comprehensive financial reports.',
    expertise: ['report-generation', 'data-visualization', 'executive-summaries', 'compliance-reporting'],
    icon: 'reports'
  },
  'integration-agent': {
    id: 'integration-agent',
    number: 'Agent-06',
    name: 'Integration Agent',
    description: 'I help you connect with external systems and export your financial data.',
    expertise: ['system-integration', 'api-connections', 'data-export', 'file-formats'],
    icon: 'integration'
  },
  'alert-agent': {
    id: 'alert-agent',
    number: 'Agent-07',
    name: 'Alert Agent',
    description: 'I help you configure alerts and notifications for your cash flow management.',
    expertise: ['alert-configuration', 'threshold-setting', 'notification-management', 'risk-monitoring'],
    icon: 'alerts'
  },
  'model-agent': {
    id: 'model-agent',
    number: 'Agent-08',
    name: 'Model Agent',
    description: 'I help you configure and optimize the AI forecasting models for your business needs.',
    expertise: ['model-configuration', 'algorithm-selection', 'parameter-tuning', 'forecast-optimization'],
    icon: 'model'
  },
  'settings-agent': {
    id: 'settings-agent',
    number: 'Agent-09',
    name: 'Settings Agent',
    description: 'I help you configure and customize the application to meet your needs.',
    expertise: ['application-settings', 'user-preferences', 'system-configuration', 'security-settings'],
    icon: 'settings'
  },
  'assistant-agent': {
    id: 'assistant-agent',
    number: 'Agent-00',
    name: 'Assistant Agent',
    description: 'I coordinate with all other agents to provide comprehensive insights about your cash flow forecasts and financial data.',
    expertise: ['agent-coordination', 'query-routing', 'multi-agent-collaboration', 'comprehensive-answers'],
    icon: 'bot'
  }
};

// Create initial memory for each agent
const createInitialMemory = (): AgentMemory => ({
  conversationHistory: [],
  lastInteraction: null,
  userPreferences: {
    preferredMetrics: ['cash-balance', 'burn-rate', 'dso'],
    communicationStyle: 'balanced',
    dataVisualizationPreference: 'charts'
  },
  knownEntities: {
    importantDates: [],
    keyMetrics: [],
    businessContext: {}
  }
});

// Create initial memories for all agents
const initialMemories: Record<AgentType, AgentMemory> = {
  'data-agent': createInitialMemory(),
  'analysis-agent': createInitialMemory(),
  'insights-agent': createInitialMemory(),
  'scenario-agent': createInitialMemory(),
  'reporting-agent': createInitialMemory(),
  'integration-agent': createInitialMemory(),
  'alert-agent': createInitialMemory(),
  'model-agent': createInitialMemory(),
  'settings-agent': createInitialMemory(),
  'assistant-agent': createInitialMemory()
};

// Create the context
export const AgentContext = createContext<AgentContext>({
  agents: agentConfig,
  memories: initialMemories,
  activeAgent: 'assistant-agent',
  latestUserMessage: null,
  currentView: 'dashboard',
  saveMessage: () => {},
  getConversationFor: () => [],
  setActiveAgent: () => {},
  setUserPreference: () => {}
});

// Create a hook for using the agent context
export const useAgentContext = () => useContext(AgentContext);