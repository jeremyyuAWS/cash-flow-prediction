import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, HelpCircle, ThumbsUp, ThumbsDown, Copy, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import SmartChatInterface from './SmartChatInterface';

interface ChatInterfaceProps {
  forecastData: any;
  historicalData: any;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  feedback?: 'positive' | 'negative' | null;
  markdown?: boolean;
  agentName?: string;
}

const INITIAL_MESSAGES = [
  {
    id: '1',
    text: 'Hi, I\'m the Assistant Agent (Agent-00). I can coordinate with all other agents to provide comprehensive insights about your cash flow forecasts and financial data.',
    sender: 'agent' as const,
    timestamp: new Date(),
    markdown: false,
    agentName: 'Agent-00'
  }
];

const SAMPLE_QUESTIONS = [
  "What's our forecasted cash balance for next month?",
  "Are there any liquidity risks in the next 90 days?",
  "How has our DSO changed over the last quarter?",
  "What would happen if our largest customer delayed payment by 30 days?",
  "How does our cash conversion cycle compare to industry benchmarks?",
  "Can you recommend strategies to improve our working capital?"
];

const ChatInterface: React.FC<ChatInterfaceProps> = ({ forecastData, historicalData }) => {
  // We're now using SmartChatInterface which includes all the enhanced functionality
  return (
    <SmartChatInterface
      forecastData={forecastData}
      historicalData={historicalData}
      primaryAgentId="assistant-agent"
      suggestedQuestions={SAMPLE_QUESTIONS}
    />
  );
};

export default ChatInterface;