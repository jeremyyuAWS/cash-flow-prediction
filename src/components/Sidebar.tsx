import React from 'react';
import { Landmark, HelpCircle, LogOut, BookOpen, BellRing } from 'lucide-react';
import AgentIcon from './AgentIcon';
import { showNotification } from './NotificationSystem';

interface SidebarProps {
  view: string;
  setView: (view: string) => void;
  onChatClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ view, setView, onChatClick }) => {
  const navItems = [
    // Data flow process
    { id: 'upload', label: 'Data Agent', group: 'primary', agentName: 'Agent-01' },
    { id: 'dashboard', label: 'Analysis Agent', group: 'primary', agentName: 'Agent-02' },
    { id: 'analytics', label: 'Insights Agent', group: 'primary', agentName: 'Agent-03' },
    { id: 'scenarios', label: 'Scenario Agent', group: 'primary', agentName: 'Agent-04' },
    { id: 'reports', label: 'Reporting Agent', group: 'primary', agentName: 'Agent-05' },
    
    // System & Configuration
    { id: 'integration', label: 'Integration Agent', group: 'system', agentName: 'Agent-06' },
    { id: 'alerts', label: 'Alert Agent', group: 'system', agentName: 'Agent-07' },
    { id: 'model', label: 'Model Agent', group: 'system', agentName: 'Agent-08' },
    { id: 'settings', label: 'Settings Agent', group: 'system', agentName: 'Agent-09' },
    
    // Library section
    { id: 'scenario-library', label: 'Scenario Library', group: 'libraries', icon: 'book' },
  ];

  const primaryAgents = navItems.filter(item => item.group === 'primary');
  const systemAgents = navItems.filter(item => item.group === 'system');
  const libraries = navItems.filter(item => item.group === 'libraries');
  
  const handleLogout = () => {
    // Show confirmation notification
    showNotification({
      title: 'Logged Out',
      message: 'You have been logged out of the system.',
      type: 'info',
      autoDismiss: true
    });
    
    // Clear local storage
    localStorage.removeItem('demoUser');
    
    // Reload the page to show login screen
    window.location.reload();
  };
  
  const handleHelpClick = () => {
    showNotification({
      title: 'Help & Support',
      message: 'AI agents are available in each section to help you. Click the chat icon in any view for assistance.',
      type: 'info',
      autoDismiss: true
    });
  };

  return (
    <div className="w-64 bg-indigo-900 text-white flex flex-col">
      <div className="p-4 flex items-center">
        <Landmark className="mr-2" size={24} />
        <h1 className="text-xl font-bold">Financial AI Hub</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 mt-8 mb-2">
          <h2 className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">Workflow Agents</h2>
        </div>
        <nav>
          <ul>
            {primaryAgents.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setView(item.id)}
                  className={`flex items-center w-full py-3 px-4 text-left hover:bg-indigo-800 transition-colors duration-200 ${
                    view === item.id ? 'bg-indigo-800 border-l-4 border-white' : ''
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    view === item.id ? 'bg-indigo-600' : 'bg-indigo-700'
                  }`}>
                    <AgentIcon id={item.id} size={16} className="text-white" />
                  </div>
                  <div className="ml-3">
                    <span className="block">{item.label}</span>
                    <span className="text-xs text-indigo-300">{item.agentName}</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="px-4 mt-8 mb-2">
          <h2 className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">System Agents</h2>
        </div>
        <nav>
          <ul>
            {systemAgents.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setView(item.id)}
                  className={`flex items-center w-full py-3 px-4 text-left hover:bg-indigo-800 transition-colors duration-200 ${
                    view === item.id ? 'bg-indigo-800 border-l-4 border-white' : ''
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    view === item.id ? 'bg-indigo-600' : 'bg-indigo-700'
                  }`}>
                    <AgentIcon id={item.id} size={16} className="text-white" />
                  </div>
                  <div className="ml-3">
                    <span className="block">{item.label}</span>
                    <span className="text-xs text-indigo-300">{item.agentName}</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Libraries section */}
        {libraries.length > 0 && (
          <>
            <div className="px-4 mt-8 mb-2">
              <h2 className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">Libraries</h2>
            </div>
            <nav>
              <ul>
                {libraries.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => setView(item.id)}
                      className={`flex items-center w-full py-3 px-4 text-left hover:bg-indigo-800 transition-colors duration-200 ${
                        view === item.id ? 'bg-indigo-800 border-l-4 border-white' : ''
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        view === item.id ? 'bg-indigo-600' : 'bg-indigo-700'
                      }`}>
                        {item.icon === 'book' ? <BookOpen size={16} className="text-white" /> : <BellRing size={16} className="text-white" />}
                      </div>
                      <div className="ml-3">
                        <span className="block">{item.label}</span>
                        <span className="text-xs text-indigo-300">Shared Resources</span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </>
        )}
      </div>
      
      <div className="p-4">
        <button 
          className="flex items-center justify-center w-full py-2 px-4 bg-indigo-800 hover:bg-indigo-700 transition-colors duration-200 rounded"
          onClick={onChatClick}
        >
          <span className="mr-2 w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold">AI</span>
          <span>Assistant Agent</span>
        </button>
      </div>
      
      <div className="p-4 border-t border-indigo-800">
        <div className="flex space-x-2 mb-4">
          <button 
            onClick={handleHelpClick}
            className="flex items-center justify-center flex-1 py-2 px-3 bg-indigo-800 hover:bg-indigo-700 transition-colors duration-200 rounded text-sm"
            title="Help & Support"
          >
            <HelpCircle size={14} className="mr-1" />
            <span>Help</span>
          </button>
          
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center flex-1 py-2 px-3 bg-indigo-800 hover:bg-indigo-700 transition-colors duration-200 rounded text-sm"
            title="Sign Out"
          >
            <LogOut size={14} className="mr-1" />
            <span>Logout</span>
          </button>
        </div>
        
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-indigo-700 flex items-center justify-center">
            <span className="font-bold">PM</span>
          </div>
          <div className="ml-3">
            <p className="font-medium">Priya Mehta</p>
            <p className="text-xs text-indigo-300">Treasury Manager</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;