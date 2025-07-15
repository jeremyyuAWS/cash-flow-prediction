import React, { useState } from 'react';
import { AlertTriangle, Save, Info, Plus, Trash2, RefreshCw, Settings, Mail, Bell } from 'lucide-react';
import TabChatInterface from './TabChatInterface';

interface Alert {
  id: number;
  type: string;
  message: string;
  date: string;
}

interface AlertSettingsProps {
  alerts: Alert[];
  onSaveSettings: (settings: any) => void;
}

// Default thresholds
const DEFAULT_SETTINGS = {
  thresholds: {
    minimumCashBalance: 50000,
    dsoThreshold: 45,
    burnRatePercentage: 15,
    negativeFlowDays: 5,
    workingCapitalRatio: 1.5,
  },
  notifications: {
    email: true,
    dashboard: true,
    frequency: 'daily',
    recipients: ['treasury@example.com'],
  },
  customAlerts: [
    {
      id: 1,
      name: 'Large Customer Payment',
      condition: 'single_inflow',
      parameter: 15000,
      active: true
    }
  ]
};

const AlertSettings: React.FC<AlertSettingsProps> = ({ alerts, onSaveSettings }) => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [newRecipient, setNewRecipient] = useState('');
  const [customAlertName, setCustomAlertName] = useState('');
  const [customAlertCondition, setCustomAlertCondition] = useState('single_inflow');
  const [customAlertParameter, setCustomAlertParameter] = useState('15000');
  const [activeTab, setActiveTab] = useState('thresholds');
  const [saved, setSaved] = useState(false);

  const suggestedQuestions = [
    "How do alert thresholds work?",
    "What custom alerts should I set up?",
    "How do I add email recipients?",
    "What's the best notification frequency?"
  ];

  const handleSettingChange = (category: string, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
    setSaved(false);
  };

  const handleAddRecipient = () => {
    if (newRecipient && !settings.notifications.recipients.includes(newRecipient)) {
      setSettings(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          recipients: [...prev.notifications.recipients, newRecipient]
        }
      }));
      setNewRecipient('');
      setSaved(false);
    }
  };

  const handleRemoveRecipient = (email: string) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        recipients: prev.notifications.recipients.filter(r => r !== email)
      }
    }));
    setSaved(false);
  };

  const handleAddCustomAlert = () => {
    if (customAlertName) {
      const newAlert = {
        id: Date.now(),
        name: customAlertName,
        condition: customAlertCondition,
        parameter: parseFloat(customAlertParameter),
        active: true
      };
      
      setSettings(prev => ({
        ...prev,
        customAlerts: [...prev.customAlerts, newAlert]
      }));
      
      setCustomAlertName('');
      setCustomAlertCondition('single_inflow');
      setCustomAlertParameter('15000');
      setSaved(false);
    }
  };

  const handleRemoveCustomAlert = (id: number) => {
    setSettings(prev => ({
      ...prev,
      customAlerts: prev.customAlerts.filter(alert => alert.id !== id)
    }));
    setSaved(false);
  };

  const handleToggleCustomAlert = (id: number) => {
    setSettings(prev => ({
      ...prev,
      customAlerts: prev.customAlerts.map(alert => 
        alert.id === id ? { ...alert, active: !alert.active } : alert
      )
    }));
    setSaved(false);
  };

  const handleSaveSettings = () => {
    onSaveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const resetToDefaults = () => {
    setSettings(DEFAULT_SETTINGS);
    setSaved(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Alert & Notification Settings</h2>
          <div className="flex space-x-2">
            <button 
              onClick={resetToDefaults}
              className="flex items-center bg-gray-100 text-gray-700 px-3 py-2 rounded hover:bg-gray-200 transition-colors"
            >
              <RefreshCw size={16} className="mr-1" />
              Reset
            </button>
            <button 
              onClick={handleSaveSettings}
              className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
            >
              <Save size={16} className="mr-2" />
              Save Settings
            </button>
          </div>
        </div>
        
        {saved && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded flex items-center">
            <Info size={18} className="mr-2" />
            Alert settings saved successfully!
          </div>
        )}
        
        <p className="text-gray-600">
          Customize when and how you receive alerts about your cash flow and liquidity risks.
        </p>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="flex border-b">
            <button 
              onClick={() => setActiveTab('thresholds')}
              className={`px-4 py-3 font-medium text-sm ${
                activeTab === 'thresholds' 
                  ? 'border-b-2 border-indigo-600 text-indigo-600' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <AlertTriangle size={16} className="inline-block mr-1" />
              Alert Thresholds
            </button>
            <button 
              onClick={() => setActiveTab('notifications')}
              className={`px-4 py-3 font-medium text-sm ${
                activeTab === 'notifications' 
                  ? 'border-b-2 border-indigo-600 text-indigo-600' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Bell size={16} className="inline-block mr-1" />
              Notification Preferences
            </button>
            <button 
              onClick={() => setActiveTab('custom')}
              className={`px-4 py-3 font-medium text-sm ${
                activeTab === 'custom' 
                  ? 'border-b-2 border-indigo-600 text-indigo-600' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Settings size={16} className="inline-block mr-1" />
              Custom Alerts
            </button>
          </div>
          
          <div className="p-6">
            {activeTab === 'thresholds' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Cash Balance
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        value={settings.thresholds.minimumCashBalance}
                        onChange={e => handleSettingChange('thresholds', 'minimumCashBalance', parseInt(e.target.value))}
                        className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="0.00"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Alert when projected cash balance falls below this threshold
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      DSO Threshold (Days)
                    </label>
                    <input
                      type="number"
                      value={settings.thresholds.dsoThreshold}
                      onChange={e => handleSettingChange('thresholds', 'dsoThreshold', parseInt(e.target.value))}
                      className="block w-full border border-gray-300 rounded-md py-2 px-4 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Alert when Days Sales Outstanding exceeds this number of days
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Burn Rate Alert (% of Monthly Revenue)
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        type="number"
                        value={settings.thresholds.burnRatePercentage}
                        onChange={e => handleSettingChange('thresholds', 'burnRatePercentage', parseInt(e.target.value))}
                        className="block w-full pr-12 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">%</span>
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Alert when burn rate exceeds this percentage of monthly revenue
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Negative Cash Flow Days
                    </label>
                    <input
                      type="number"
                      value={settings.thresholds.negativeFlowDays}
                      onChange={e => handleSettingChange('thresholds', 'negativeFlowDays', parseInt(e.target.value))}
                      className="block w-full border border-gray-300 rounded-md py-2 px-4 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Alert when more than this many consecutive days of negative cash flow are forecasted
                    </p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Working Capital Ratio
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={settings.thresholds.workingCapitalRatio}
                    onChange={e => handleSettingChange('thresholds', 'workingCapitalRatio', parseFloat(e.target.value))}
                    className="block w-full border border-gray-300 rounded-md py-2 px-4 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Alert when working capital ratio falls below this threshold
                  </p>
                </div>
              </div>
            )}
            
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Notification Methods</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        id="email-notifications"
                        type="checkbox"
                        checked={settings.notifications.email}
                        onChange={e => handleSettingChange('notifications', 'email', e.target.checked)}
                        className="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <label htmlFor="email-notifications" className="ml-2 block text-sm text-gray-700">
                        <Mail size={16} className="inline-block mr-1" />
                        Email Notifications
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="dashboard-notifications"
                        type="checkbox"
                        checked={settings.notifications.dashboard}
                        onChange={e => handleSettingChange('notifications', 'dashboard', e.target.checked)}
                        className="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <label htmlFor="dashboard-notifications" className="ml-2 block text-sm text-gray-700">
                        <Bell size={16} className="inline-block mr-1" />
                        Dashboard Alerts
                      </label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Notification Frequency</h3>
                  <div className="mt-2 space-y-3">
                    <div className="flex items-center">
                      <input
                        id="frequency-real-time"
                        name="notification-frequency"
                        type="radio"
                        checked={settings.notifications.frequency === 'real-time'}
                        onChange={() => handleSettingChange('notifications', 'frequency', 'real-time')}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label htmlFor="frequency-real-time" className="ml-2 block text-sm text-gray-700">
                        Real-time (immediate)
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="frequency-daily"
                        name="notification-frequency"
                        type="radio"
                        checked={settings.notifications.frequency === 'daily'}
                        onChange={() => handleSettingChange('notifications', 'frequency', 'daily')}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label htmlFor="frequency-daily" className="ml-2 block text-sm text-gray-700">
                        Daily digest
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="frequency-weekly"
                        name="notification-frequency"
                        type="radio"
                        checked={settings.notifications.frequency === 'weekly'}
                        onChange={() => handleSettingChange('notifications', 'frequency', 'weekly')}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label htmlFor="frequency-weekly" className="ml-2 block text-sm text-gray-700">
                        Weekly summary
                      </label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Email Recipients</h3>
                  <div className="space-y-3">
                    {settings.notifications.recipients.map((email, index) => (
                      <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-800">{email}</span>
                        <button 
                          onClick={() => handleRemoveRecipient(email)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    
                    <div className="flex mt-3">
                      <input
                        type="email"
                        value={newRecipient}
                        onChange={e => setNewRecipient(e.target.value)}
                        placeholder="Add email address"
                        className="block w-full border border-gray-300 rounded-l-md py-2 px-4 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={handleAddRecipient}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'custom' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Custom Alert Rules</h3>
                  <div className="space-y-4">
                    {settings.customAlerts.map((alert) => (
                      <div key={alert.id} className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
                        <div>
                          <div className="flex items-center">
                            <span className={`inline-block w-3 h-3 rounded-full ${alert.active ? 'bg-green-500' : 'bg-gray-300'} mr-2`}></span>
                            <span className="font-medium">{alert.name}</span>
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {alert.condition === 'single_inflow' && `Alert when a single inflow exceeds $${alert.parameter.toLocaleString()}`}
                            {alert.condition === 'single_outflow' && `Alert when a single outflow exceeds $${alert.parameter.toLocaleString()}`}
                            {alert.condition === 'balance_increase' && `Alert when balance increases by ${alert.parameter}% in a single day`}
                            {alert.condition === 'balance_decrease' && `Alert when balance decreases by ${alert.parameter}% in a single day`}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleToggleCustomAlert(alert.id)}
                            className={`px-2 py-1 rounded text-xs ${
                              alert.active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {alert.active ? 'Active' : 'Inactive'}
                          </button>
                          <button 
                            onClick={() => handleRemoveCustomAlert(alert.id)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Add New Custom Alert</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Alert Name</label>
                      <input
                        type="text"
                        value={customAlertName}
                        onChange={e => setCustomAlertName(e.target.value)}
                        placeholder="Large customer payment"
                        className="block w-full border border-gray-300 rounded-md py-2 px-4 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                      <select
                        value={customAlertCondition}
                        onChange={e => setCustomAlertCondition(e.target.value)}
                        className="block w-full border border-gray-300 rounded-md py-2 px-4 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="single_inflow">Single inflow exceeds</option>
                        <option value="single_outflow">Single outflow exceeds</option>
                        <option value="balance_increase">Balance increases by (%)</option>
                        <option value="balance_decrease">Balance decreases by (%)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        {customAlertCondition.includes('balance') ? (
                          <div className="flex">
                            <input
                              type="number"
                              value={customAlertParameter}
                              onChange={e => setCustomAlertParameter(e.target.value)}
                              className="block w-full rounded-l-md py-2 px-4 border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500">
                              %
                            </span>
                          </div>
                        ) : (
                          <div className="flex">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                              $
                            </span>
                            <input
                              type="number"
                              value={customAlertParameter}
                              onChange={e => setCustomAlertParameter(e.target.value)}
                              className="block w-full rounded-r-md py-2 px-4 border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleAddCustomAlert}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Plus size={16} className="mr-2" />
                    Add Custom Alert
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-gray-50 p-6 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Current Alerts ({alerts.length})</h3>
          <div className="space-y-2 mt-4">
            {alerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`p-3 rounded-lg ${
                  alert.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' : 'bg-blue-50 border border-blue-200'
                }`}
              >
                <div className="flex items-start">
                  {alert.type === 'warning' ? (
                    <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
                  ) : (
                    <Info className="h-5 w-5 text-blue-400 mt-0.5" />
                  )}
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${
                      alert.type === 'warning' ? 'text-yellow-800' : 'text-blue-800'
                    }`}>
                      {alert.message}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {new Date(alert.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {alerts.length === 0 && (
              <p className="text-gray-500 text-center py-4">No alerts at this time</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="lg:col-span-1">
        <div className="h-[780px]">
          <TabChatInterface
            agentName="Alert Agent"
            agentNumber="Agent-07"
            agentDescription="I help you configure alerts and notifications for your cash flow management."
            placeholderText="Ask about alert settings..."
            suggestedQuestions={suggestedQuestions}
            view="alerts"
          />
        </div>
      </div>
    </div>
  );
};

export default AlertSettings;