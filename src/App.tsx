import React, { useState, useEffect } from 'react';
import { Landmark, MessageSquare } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import ChatInterface from './components/ChatInterface';
import ScenarioPlanner from './components/ScenarioPlanner';
import ReportGenerator from './components/ReportGenerator';
import AdvancedAnalytics from './components/AdvancedAnalytics';
import AlertSettings from './components/AlertSettings';
import DataIntegration from './components/DataIntegration';
import ModelConfiguration from './components/ModelConfiguration';
import Settings from './components/Settings';
import WorkflowHeader, { WorkflowStep } from './components/WorkflowHeader';
import AgentIcon from './components/AgentIcon';
import { generateForecastData, generateHistoricalData } from './utils/dataGenerator';
import Onboarding from './components/Onboarding';
import WelcomePopup from './components/WelcomePopup';
import FeatureTooltip from './components/FeatureTooltip';
import DemoLogin from './components/DemoLogin';
import NotificationSystem, { NotificationConfig, createNotification } from './components/NotificationSystem';

function App() {
  const [view, setView] = useState('dashboard');
  const [fileUploaded, setFileUploaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [historicalData, setHistoricalData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [industryType, setIndustryType] = useState('manufacturing');
  const [showChat, setShowChat] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [hasVisitedBefore, setHasVisitedBefore] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [userData, setUserData] = useState<{ username: string; role: string } | null>(null);
  const [notifications, setNotifications] = useState<NotificationConfig[]>([]);

  // Check if user has visited before
  useEffect(() => {
    const onboardingCompleted = localStorage.getItem('onboardingCompleted');
    if (onboardingCompleted) {
      setHasVisitedBefore(true);
    } else {
      // Show welcome popup on first visit
      setShowWelcome(true);
    }
  }, []);

  // Define workflow steps with their status
  const workflowSteps: WorkflowStep[] = [
    {
      id: 'upload',
      label: 'Data Agent',
      description: 'Import and prepare financial data',
      status: fileUploaded ? 'completed' : view === 'upload' ? 'active' : 'pending',
      icon: <AgentIcon id="upload" size={18} className="text-white" />
    },
    {
      id: 'dashboard',
      label: 'Analysis Agent',
      description: 'Review financial metrics and KPIs',
      status: historicalData && view === 'dashboard' ? 'active' : historicalData ? 'completed' : 'pending',
      icon: <AgentIcon id="dashboard" size={18} className="text-white" />
    },
    {
      id: 'analytics',
      label: 'Insights Agent',
      description: 'Discover deep financial patterns',
      status: view === 'analytics' ? 'active' : view === 'scenarios' || view === 'reports' ? 'completed' : 'pending',
      icon: <AgentIcon id="analytics" size={18} className="text-white" />
    },
    {
      id: 'scenarios',
      label: 'Scenario Agent',
      description: 'Simulate what-if scenarios',
      status: view === 'scenarios' ? 'active' : view === 'reports' ? 'completed' : 'pending',
      icon: <AgentIcon id="scenarios" size={18} className="text-white" />
    },
    {
      id: 'reports',
      label: 'Reporting Agent',
      description: 'Generate comprehensive reports',
      status: view === 'reports' ? 'active' : 'pending',
      icon: <AgentIcon id="reports" size={18} className="text-white" />
    },
  ];
  
  // Handle notifications
  const addNotification = (notification: NotificationConfig) => {
    setNotifications(prev => [...prev, notification]);
  };
  
  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  useEffect(() => {
    // Auto-load sample data for demo purposes
    if (!historicalData) {
      const sampleData = generateHistoricalData(industryType);
      setHistoricalData(sampleData);
      
      // Generate forecast data based on historical data
      const forecast = generateForecastData(sampleData);
      setForecastData(forecast);
      
      // Generate sample alerts
      setAlerts([
        {
          id: 1,
          type: 'warning',
          message: 'Potential liquidity shortage predicted on May 15, 2025',
          date: '2025-05-15',
        },
        {
          id: 2,
          type: 'info',
          message: 'Large outflow of $45,000 scheduled for April 28, 2025',
          date: '2025-04-28',
        },
      ]);
    }
  }, [historicalData, industryType]);
  
  // Show welcome notification after login
  useEffect(() => {
    if (userData && historicalData) {
      // Add welcome notification
      const welcomeNotification = createNotification(
        'success',
        `Welcome, ${userData.username}`,
        `Your cash flow dashboard is ready. We've detected a potential liquidity risk in May 2025.`,
        [
          { 
            label: 'View Risk Details', 
            onClick: () => {
              setView('scenarios');
              setAlerts(prev => [
                ...prev,
                {
                  id: Date.now(),
                  type: 'warning',
                  message: 'Liquidity risk analysis requested',
                  date: new Date().toISOString().split('T')[0],
                }
              ]);
            }
          }
        ],
        true,
        8000
      );
      
      addNotification(welcomeNotification);
    }
  }, [userData, historicalData]);

  const handleFileUpload = (file) => {
    setIsLoading(true);
    
    // Simulate file processing
    setTimeout(() => {
      const newHistoricalData = generateHistoricalData(industryType);
      setHistoricalData(newHistoricalData);
      
      const newForecast = generateForecastData(newHistoricalData);
      setForecastData(newForecast);
      
      setFileUploaded(true);
      setIsLoading(false);
      
      // Add new alert for demo purposes
      setAlerts(prev => [
        ...prev,
        {
          id: prev.length + 1,
          type: 'warning',
          message: 'New data indicates potential cash flow gap in Q2',
          date: '2025-06-10',
        }
      ]);
      
      // Add notification
      addNotification(createNotification(
        'success',
        'Data Processed Successfully',
        'Your financial data has been processed and your forecast has been updated.',
        [
          { 
            label: 'View Forecast', 
            onClick: () => setView('dashboard')
          }
        ],
        true,
        5000
      ));
    }, 2000);
  };

  const toggleChat = () => {
    setShowChat(!showChat);
  };

  const handleDownloadReport = () => {
    // This function is passed to components that need to trigger report generation
    setView('reports');
    
    // Add notification
    addNotification(createNotification(
      'info',
      'Report Generation Requested',
      'Your financial report is being prepared. You will be redirected to the Reports section.',
      undefined,
      true,
      4000
    ));
  };

  const handleModelUpdate = (newForecastData) => {
    setForecastData(newForecastData);
    
    // Add notification
    addNotification(createNotification(
      'success',
      'Forecast Model Updated',
      'Your forecast model parameters have been updated and a new forecast has been generated.',
      [
        { 
          label: 'View Changes', 
          onClick: () => setView('dashboard')
        }
      ],
      true,
      5000
    ));
  };

  const handleSaveAlertSettings = (settings) => {
    // In a real app, this would save the settings to a backend
    console.log('Alert settings saved:', settings);
    
    // Add a confirmation alert
    setAlerts(prev => [
      ...prev,
      {
        id: Date.now(),
        type: 'info',
        message: 'Alert settings updated successfully',
        date: new Date().toISOString().split('T')[0],
      }
    ]);
    
    // Add notification
    addNotification(createNotification(
      'success',
      'Alert Settings Saved',
      'Your alert thresholds and notification preferences have been updated.',
      undefined,
      true,
      4000
    ));
  };
  
  const handleLogin = (userData: { username: string; role: string }) => {
    setUserData(userData);
    setShowLogin(false);
    
    // If first time visitor, show welcome popup
    if (!hasVisitedBefore) {
      setTimeout(() => setShowWelcome(true), 1000);
    }
  };

  // Determine if the current view should show the workflow header
  const showWorkflowHeader = ['upload', 'dashboard', 'analytics', 'scenarios', 'reports'].includes(view);

  // Find the appropriate step ID for the current view (for views not directly in workflow)
  const mapViewToWorkflowStep = (currentView) => {
    // Map views to their appropriate workflow step
    const viewToStepMap = {
      'integration': 'upload',
      'alerts': 'dashboard',
      'model': 'analytics',
      'settings': 'dashboard'
    };
    
    return viewToStepMap[currentView] || currentView;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {showLogin ? (
        <DemoLogin onLogin={handleLogin} />
      ) : (
        <>
          <Sidebar 
            view={view} 
            setView={setView} 
            onChatClick={toggleChat} 
            userData={userData}
          />
          
          <div className="flex flex-col flex-1 overflow-hidden">
            <Header alerts={alerts} />
            
            {showWorkflowHeader && (
              <FeatureTooltip
                id="workflow-header"
                title="Workflow Navigation"
                description="This shows your current progress through the financial analysis workflow. Each step has its own specialized AI agent to assist you."
                position="bottom"
              >
                <WorkflowHeader 
                  steps={workflowSteps} 
                  currentStepId={mapViewToWorkflowStep(view)}
                />
              </FeatureTooltip>
            )}
            
            <main className={`flex-1 overflow-y-auto p-4 ${!showWorkflowHeader && 'pt-6'}`}>
              {view === 'dashboard' && historicalData && forecastData && (
                <Dashboard 
                  historicalData={historicalData} 
                  forecastData={forecastData}
                  alerts={alerts}
                />
              )}
              
              {view === 'upload' && (
                <FileUpload 
                  onFileUpload={handleFileUpload} 
                  isLoading={isLoading}
                  fileUploaded={fileUploaded}
                  industryType={industryType}
                  setIndustryType={setIndustryType}
                />
              )}

              {view === 'scenarios' && historicalData && forecastData && (
                <ScenarioPlanner
                  historicalData={historicalData}
                  forecastData={forecastData}
                  onDownloadReport={handleDownloadReport}
                  onAddNotification={addNotification}
                />
              )}

              {view === 'reports' && historicalData && forecastData && (
                <ReportGenerator
                  historicalData={historicalData}
                  forecastData={forecastData}
                  alerts={alerts}
                />
              )}

              {view === 'analytics' && historicalData && forecastData && (
                <AdvancedAnalytics
                  historicalData={historicalData}
                  forecastData={forecastData}
                />
              )}

              {view === 'alerts' && (
                <AlertSettings 
                  alerts={alerts}
                  onSaveSettings={handleSaveAlertSettings}
                />
              )}

              {view === 'integration' && historicalData && forecastData && (
                <DataIntegration
                  historicalData={historicalData}
                  forecastData={forecastData}
                />
              )}

              {view === 'model' && historicalData && forecastData && (
                <ModelConfiguration
                  historicalData={historicalData}
                  forecastData={forecastData}
                  onModelUpdate={handleModelUpdate}
                />
              )}

              {view === 'settings' && (
                <Settings />
              )}
            </main>
          </div>
          
          {showChat && historicalData && forecastData && (
            <div className="fixed bottom-4 right-4 w-96 h-[500px] z-10 shadow-2xl rounded-lg overflow-hidden">
              <ChatInterface 
                forecastData={forecastData}
                historicalData={historicalData}
              />
              <button 
                onClick={toggleChat}
                className="absolute top-3 right-3 text-white hover:text-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
          
          {!showChat && (
            <FeatureTooltip
              id="assistant-button"
              title="AI Assistant"
              description="Click here to chat with your financial AI assistant. Ask any questions about cash flow, forecasts, or financial metrics."
              position="left"
            >
              <button
                onClick={toggleChat}
                className="fixed bottom-4 right-4 bg-indigo-600 text-white rounded-full p-3 shadow-lg hover:bg-indigo-700 transition-colors z-10"
              >
                <MessageSquare size={24} />
              </button>
            </FeatureTooltip>
          )}

          {/* Onboarding components */}
          <WelcomePopup 
            isOpen={showWelcome} 
            onClose={() => setShowWelcome(false)}
            onStartOnboarding={() => {
              setShowWelcome(false);
              setShowOnboarding(true);
            }}
          />

          <Onboarding 
            isOpen={showOnboarding}
            onClose={() => setShowOnboarding(false)}
          />
          
          {/* Notification system */}
          <NotificationSystem 
            notifications={notifications}
            onNotificationDismiss={removeNotification}
          />
        </>
      )}
    </div>
  );
}

export default App;