import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, HelpCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import SmartChatInterface from './SmartChatInterface';
import { AgentType } from '../utils/agentContext';

interface TabChatInterfaceProps {
  agentName: string;
  agentNumber: string;
  agentDescription: string;
  placeholderText?: string;
  onSendMessage?: (message: string) => void;
  suggestedQuestions?: string[];
  historicalData?: any;
  forecastData?: any;
  view?: string;
}

// Map agent number to agent type
function getAgentTypeFromNumber(agentNumber: string): AgentType {
  const agentMap: Record<string, AgentType> = {
    'Agent-00': 'assistant-agent',
    'Agent-01': 'data-agent',
    'Agent-02': 'analysis-agent',
    'Agent-03': 'insights-agent',
    'Agent-04': 'scenario-agent',
    'Agent-05': 'reporting-agent',
    'Agent-06': 'integration-agent',
    'Agent-07': 'alert-agent',
    'Agent-08': 'model-agent',
    'Agent-09': 'settings-agent'
  };
  
  return agentMap[agentNumber] || 'assistant-agent';
}

const TabChatInterface: React.FC<TabChatInterfaceProps> = ({ 
  agentName, 
  agentNumber, 
  agentDescription,
  placeholderText = "Ask a question...",
  onSendMessage,
  suggestedQuestions = [],
  historicalData,
  forecastData,
  view
}) => {
  // Get agent type from agent number
  const agentType = getAgentTypeFromNumber(agentNumber);
  
  // We're now using SmartChatInterface which includes all the enhanced functionality
  return (
    <SmartChatInterface
      forecastData={forecastData}
      historicalData={historicalData}
      primaryAgentId={agentType}
      suggestedQuestions={suggestedQuestions}
    />
  );
};

export default TabChatInterface;