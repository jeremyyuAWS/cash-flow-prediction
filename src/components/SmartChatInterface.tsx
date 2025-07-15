import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, HelpCircle, ThumbsUp, ThumbsDown, Copy, RefreshCw, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { generateAgentResponse, agentConfig } from '../utils/agentResponseGenerator';
import { AgentType } from '../utils/agentContext';
import AgentIcon from './AgentIcon';

interface SmartChatInterfaceProps {
  forecastData: any;
  historicalData: any;
  primaryAgentId: AgentType;
  onAgentChange?: (agentId: AgentType) => void;
  suggestedQuestions?: string[];
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  agentId: AgentType;
  timestamp: Date;
  feedback?: 'positive' | 'negative' | null;
  markdown?: boolean;
  referenceMessages?: ReferenceMessage[];
}

interface ReferenceMessage {
  agentId: AgentType;
  text: string;
}

const SmartChatInterface: React.FC<SmartChatInterfaceProps> = ({ 
  forecastData, 
  historicalData, 
  primaryAgentId,
  onAgentChange,
  suggestedQuestions = []
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [aiModel, setAiModel] = useState<'standard' | 'advanced'>('advanced');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [activeAgent, setActiveAgent] = useState<AgentType>(primaryAgentId);
  const [conversationMemory, setConversationMemory] = useState<Record<AgentType, Message[]>>({} as Record<AgentType, Message[]>);
  
  // Add initial message from primary agent
  useEffect(() => {
    const initialAgentMessage: Message = {
      id: Date.now().toString(),
      text: `Hi, I'm the ${agentConfig[primaryAgentId].name} (${agentConfig[primaryAgentId].number}). ${agentConfig[primaryAgentId].description} How can I help you today?`,
      sender: 'agent',
      agentId: primaryAgentId,
      timestamp: new Date()
    };
    
    setMessages([initialAgentMessage]);
    
    // Initialize conversation memory
    const initialMemory: Record<AgentType, Message[]> = {};
    initialMemory[primaryAgentId] = [initialAgentMessage];
    setConversationMemory(initialMemory);
  }, [primaryAgentId]);
  
  // Scroll to the bottom of the chat when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isProcessing) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      agentId: 'user',
      timestamp: new Date()
    };
    
    // Add user message to the general conversation
    setMessages(prev => [...prev, userMessage]);
    
    // Add user message to the conversation memory for the active agent
    setConversationMemory(prev => {
      const updated = { ...prev };
      
      if (!updated[activeAgent]) {
        updated[activeAgent] = [];
      }
      
      updated[activeAgent] = [...updated[activeAgent], userMessage];
      return updated;
    });
    
    setInputValue('');
    setIsProcessing(true);
    setShowSuggestions(false);
    
    // Simulate processing delay
    setTimeout(() => {
      // Generate a response from the active agent
      let response;
      
      if (aiModel === 'advanced') {
        response = generateAgentResponse(
          activeAgent, 
          inputValue, 
          forecastData, 
          historicalData,
          conversationMemory[activeAgent] || []
        );
      } else {
        // Standard model uses simpler responses
        response = {
          text: generateAgentResponse(
            activeAgent, 
            inputValue, 
            forecastData, 
            historicalData
          ).text,
          markdown: false
        };
      }
      
      // Create agent message
      const agentMessage: Message = {
        id: Date.now().toString(),
        text: response.text,
        sender: 'agent',
        agentId: activeAgent,
        timestamp: new Date(),
        markdown: response.markdown || false
      };
      
      // If the response refers to other agents, add those as references
      if (response.refersToAgents && response.refersToAgents.length > 0) {
        const referenceMessages: ReferenceMessage[] = [];
        
        response.refersToAgents.forEach(refAgentId => {
          if (refAgentId !== activeAgent) {
            // Simulating that this agent has its own take on the question
            const refResponse = generateAgentResponse(
              refAgentId, 
              inputValue, 
              forecastData, 
              historicalData
            );
            
            referenceMessages.push({
              agentId: refAgentId,
              text: refResponse.text
            });
            
            // If this is the assistant agent, we might want to change the active agent
            if (activeAgent === 'assistant-agent' && onAgentChange) {
              setActiveAgent(refAgentId);
              onAgentChange(refAgentId);
            }
          }
        });
        
        if (referenceMessages.length > 0) {
          agentMessage.referenceMessages = referenceMessages;
        }
      }
      
      // Add agent message to the conversation
      setMessages(prev => [...prev, agentMessage]);
      
      // Add agent message to the conversation memory
      setConversationMemory(prev => {
        const updated = { ...prev };
        
        if (!updated[activeAgent]) {
          updated[activeAgent] = [];
        }
        
        updated[activeAgent] = [...updated[activeAgent], agentMessage];
        return updated;
      });
      
      setIsProcessing(false);
    }, aiModel === 'advanced' ? 2000 : 1000);
  };

  const handleSampleQuestionClick = (question: string) => {
    setInputValue(question);
  };

  const provideFeedback = (messageId: string, feedback: 'positive' | 'negative') => {
    setMessages(prev => prev.map(message => 
      message.id === messageId 
        ? { ...message, feedback } 
        : message
    ));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const switchAiModel = () => {
    setAiModel(prev => prev === 'standard' ? 'advanced' : 'standard');
  };
  
  // Handle clicking on a referenced agent to change the active agent
  const handleAgentClick = (agentId: AgentType) => {
    if (activeAgent === agentId) return;
    
    setActiveAgent(agentId);
    if (onAgentChange) {
      onAgentChange(agentId);
    }
    
    // Add a transition message if we haven't already spoken with this agent
    if (!conversationMemory[agentId] || conversationMemory[agentId].length === 0) {
      const transitionMessage: Message = {
        id: Date.now().toString(),
        text: `Hi, I'm now connecting you with the ${agentConfig[agentId].name} (${agentConfig[agentId].number}). ${agentConfig[agentId].description}`,
        sender: 'agent',
        agentId: agentId,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, transitionMessage]);
      
      setConversationMemory(prev => {
        const updated = { ...prev };
        
        if (!updated[agentId]) {
          updated[agentId] = [];
        }
        
        updated[agentId] = [...updated[agentId], transitionMessage];
        return updated;
      });
    } else {
      // If we've spoken with this agent before, add a context reminder
      const lastUserMessage = [...messages].reverse().find(m => m.sender === 'user');
      
      if (lastUserMessage) {
        // Generate a contextualized response from the new agent
        setTimeout(() => {
          const response = generateAgentResponse(
            agentId, 
            lastUserMessage.text, 
            forecastData, 
            historicalData,
            conversationMemory[agentId] || []
          );
          
          const contextMessage: Message = {
            id: Date.now().toString(),
            text: `I see you were asking about ${lastUserMessage.text.slice(0, 40)}${lastUserMessage.text.length > 40 ? '...' : ''}. ${response.text}`,
            sender: 'agent',
            agentId: agentId,
            timestamp: new Date(),
            markdown: response.markdown || false
          };
          
          setMessages(prev => [...prev, contextMessage]);
          
          setConversationMemory(prev => {
            const updated = { ...prev };
            
            if (!updated[agentId]) {
              updated[agentId] = [];
            }
            
            updated[agentId] = [...updated[agentId], contextMessage];
            return updated;
          });
        }, 500);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow overflow-hidden">
      <div className="bg-indigo-900 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <div className="p-1 bg-indigo-700 rounded-full mr-2">
            <AgentIcon id={agentConfig[activeAgent].icon} size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-medium">{agentConfig[activeAgent].name}</h3>
            <p className="text-xs text-indigo-200">{agentConfig[activeAgent].number}</p>
          </div>
        </div>
        <div className="flex items-center">
          <span className="text-xs mr-2">Mode:</span>
          <button 
            onClick={switchAiModel} 
            className={`px-2 py-1 rounded text-xs ${
              aiModel === 'advanced' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-indigo-800 text-gray-300'
            }`}
          >
            {aiModel === 'advanced' ? 'Advanced' : 'Standard'}
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-lg p-3 ${
                message.sender === 'user' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <div className="flex items-start">
                {message.sender === 'agent' && (
                  <div 
                    className="bg-indigo-600 rounded-full w-6 h-6 flex items-center justify-center text-white text-xs font-bold mr-2 flex-shrink-0 mt-1 cursor-pointer"
                    onClick={() => handleAgentClick(message.agentId)}
                    title={`${agentConfig[message.agentId].name} (${agentConfig[message.agentId].number})`}
                  >
                    {agentConfig[message.agentId].number.split('-')[1] || '00'}
                  </div>
                )}
                {message.sender === 'user' && (
                  <User size={16} className="mr-1 mt-1 text-white flex-shrink-0" />
                )}
                <div className="text-sm">
                  {message.sender === 'agent' && (
                    <div className="text-xs text-indigo-600 font-medium mb-1">
                      {agentConfig[message.agentId].name} ({agentConfig[message.agentId].number})
                    </div>
                  )}
                  {message.markdown ? (
                    <ReactMarkdown className="prose prose-sm max-w-none">
                      {message.text}
                    </ReactMarkdown>
                  ) : (
                    message.text
                  )}
                </div>
              </div>
              
              {/* Reference messages from other agents */}
              {message.referenceMessages && message.referenceMessages.length > 0 && (
                <div className="mt-3 pt-2 border-t border-gray-200">
                  <div className="text-xs text-gray-500 mb-2">Reference information:</div>
                  <div className="space-y-2">
                    {message.referenceMessages.map((refMsg, index) => (
                      <div 
                        key={`ref-${message.id}-${index}`}
                        className="p-2 bg-gray-50 rounded border border-gray-200 text-xs"
                      >
                        <div 
                          className="flex items-center mb-1 text-indigo-600 font-medium cursor-pointer"
                          onClick={() => handleAgentClick(refMsg.agentId)}
                        >
                          <div className="bg-indigo-100 rounded-full w-4 h-4 flex items-center justify-center mr-1">
                            <span className="text-[10px]">{agentConfig[refMsg.agentId].number.split('-')[1]}</span>
                          </div>
                          <span>{agentConfig[refMsg.agentId].name}</span>
                        </div>
                        <p className="text-gray-700">{refMsg.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="text-xs opacity-70 flex items-center justify-between mt-2">
                <div>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                {message.sender === 'agent' && (
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => copyToClipboard(message.text)}
                      className="opacity-70 hover:opacity-100" 
                      title="Copy to clipboard"
                    >
                      <Copy size={14} />
                    </button>
                    <button 
                      onClick={() => provideFeedback(message.id, 'positive')}
                      className={`opacity-70 hover:opacity-100 ${message.feedback === 'positive' ? 'text-green-600' : ''}`} 
                      title="Helpful"
                    >
                      <ThumbsUp size={14} />
                    </button>
                    <button 
                      onClick={() => provideFeedback(message.id, 'negative')}
                      className={`opacity-70 hover:opacity-100 ${message.feedback === 'negative' ? 'text-red-600' : ''}`} 
                      title="Not helpful"
                    >
                      <ThumbsDown size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
        
        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <div className="bg-indigo-600 rounded-full h-2 w-2 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="bg-indigo-600 rounded-full h-2 w-2 animate-bounce" style={{ animationDelay: '200ms' }}></div>
                <div className="bg-indigo-600 rounded-full h-2 w-2 animate-bounce" style={{ animationDelay: '400ms' }}></div>
              </div>
              <div className="text-xs mt-1 text-gray-500">
                {aiModel === 'advanced' ? 'Consulting with other agents...' : 'Processing...'}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {messages.length <= 2 && showSuggestions && (
        <div className="px-4 pb-3">
          <p className="text-xs text-gray-500 mb-2 flex items-center">
            <HelpCircle size={14} className="mr-1" />
            Try asking:
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleSampleQuestionClick(question)}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 px-2 rounded transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="border-t p-3 flex items-center">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={`Ask ${agentConfig[activeAgent].name} something...`}
          className="flex-1 border rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={isProcessing}
        />
        <button
          type="submit"
          className={`ml-2 bg-indigo-600 text-white p-2 rounded-lg ${
            !inputValue.trim() || isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'
          }`}
          disabled={!inputValue.trim() || isProcessing}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default SmartChatInterface;