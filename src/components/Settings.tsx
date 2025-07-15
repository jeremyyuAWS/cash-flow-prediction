import React, { useState } from 'react';
import { User, Bell, Globe, Lock, Moon, Sun, Save, RefreshCw, Clock, Database, Shield, Trash2, Check, X, EyeOff } from 'lucide-react';
import TabChatInterface from './TabChatInterface';

interface SettingsProps {
  // In a real app, this would include user data and app settings
}

const Settings: React.FC<SettingsProps> = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  const suggestedQuestions = [
    "How do I change my password?",
    "What notification settings should I use?",
    "How is my data stored?",
    "How can I optimize my settings?"
  ];
  
  // Profile settings
  const [profile, setProfile] = useState({
    name: 'Priya Mehta',
    email: 'priya.mehta@example.com',
    title: 'Treasury Manager',
    phone: '+1 (555) 123-4567',
    company: 'Acme Financial Services',
    department: 'Finance',
  });
  
  // App preferences
  const [preferences, setPreferences] = useState({
    defaultView: 'dashboard',
    dataRefreshRate: '30m',
    dateFormat: 'MM/DD/YYYY',
    currencyFormat: 'USD',
    showHistoricalComparisons: true,
    showConfidenceIntervals: true,
  });
  
  // Security settings
  const [security, setSecurity] = useState({
    twoFactorEnabled: true,
    sessionTimeout: '30m',
    lastPasswordChange: '2025-01-15',
    loginNotifications: true,
  });
  
  // Data retention settings
  const [dataRetention, setDataRetention] = useState({
    keepHistoricalData: '12m',
    automaticBackups: true,
    backupFrequency: 'daily',
    backupLocation: 'cloud',
  });
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePreferenceChange = (name: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSecurityChange = (name: string, value: any) => {
    setSecurity(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleDataRetentionChange = (name: string, value: any) => {
    setDataRetention(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSaveSettings = () => {
    setLoading(true);
    
    // Simulate API call to save settings
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }, 1500);
  };
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Settings</h2>
          <div className="flex space-x-2">
            <button 
              onClick={toggleDarkMode}
              className="flex items-center bg-gray-100 text-gray-700 px-3 py-2 rounded hover:bg-gray-200 transition-colors"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun size={16} className="mr-1" /> : <Moon size={16} className="mr-1" />}
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
            <button 
              onClick={handleSaveSettings}
              disabled={loading}
              className={`flex items-center px-4 py-2 rounded ${
                loading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              } transition-colors`}
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Save All Changes
                </>
              )}
            </button>
          </div>
        </div>
        
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded flex items-center">
            <Check size={18} className="mr-2" />
            Settings saved successfully!
          </div>
        )}
        
        <p className="text-gray-600">
          Customize your application settings and preferences. Changes will be applied immediately after saving.
        </p>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="flex border-b">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-3 font-medium text-sm ${
                activeTab === 'profile' 
                  ? 'border-b-2 border-indigo-600 text-indigo-600' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <User size={16} className="inline-block mr-1" />
              Profile
            </button>
            <button 
              onClick={() => setActiveTab('preferences')}
              className={`px-4 py-3 font-medium text-sm ${
                activeTab === 'preferences' 
                  ? 'border-b-2 border-indigo-600 text-indigo-600' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Globe size={16} className="inline-block mr-1" />
              Preferences
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={`px-4 py-3 font-medium text-sm ${
                activeTab === 'security' 
                  ? 'border-b-2 border-indigo-600 text-indigo-600' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Lock size={16} className="inline-block mr-1" />
              Security
            </button>
            <button 
              onClick={() => setActiveTab('data')}
              className={`px-4 py-3 font-medium text-sm ${
                activeTab === 'data' 
                  ? 'border-b-2 border-indigo-600 text-indigo-600' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Database size={16} className="inline-block mr-1" />
              Data Management
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
              Notifications
            </button>
          </div>
          
          <div className="p-6">
            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="mr-6">
                    <div className="w-24 h-24 bg-indigo-700 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      PM
                    </div>
                    <button className="mt-2 text-sm text-indigo-600 block mx-auto">
                      Change
                    </button>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">User Profile</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={profile.name}
                          onChange={handleProfileChange}
                          className="block w-full border border-gray-300 rounded-md py-2 px-4 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={profile.email}
                          onChange={handleProfileChange}
                          className="block w-full border border-gray-300 rounded-md py-2 px-4 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Job Title
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={profile.title}
                          onChange={handleProfileChange}
                          className="block w-full border border-gray-300 rounded-md py-2 px-4 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={profile.phone}
                          onChange={handleProfileChange}
                          className="block w-full border border-gray-300 rounded-md py-2 px-4 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Company
                        </label>
                        <input
                          type="text"
                          name="company"
                          value={profile.company}
                          onChange={handleProfileChange}
                          className="block w-full border border-gray-300 rounded-md py-2 px-4 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Department
                        </label>
                        <input
                          type="text"
                          name="department"
                          value={profile.department}
                          onChange={handleProfileChange}
                          className="block w-full border border-gray-300 rounded-md py-2 px-4 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Application Preferences */}
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Application Preferences</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Default Dashboard View
                    </label>
                    <select
                      value={preferences.defaultView}
                      onChange={(e) => handlePreferenceChange('defaultView', e.target.value)}
                      className="block w-full border border-gray-300 rounded-md py-2 px-4 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="dashboard">Main Dashboard</option>
                      <option value="scenarios">Scenario Planner</option>
                      <option value="analytics">Advanced Analytics</option>
                      <option value="reports">Reports</option>
                    </select>
                    <p className="mt-1 text-xs text-gray-500">
                      The default view shown when you log in
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data Auto-Refresh Rate
                    </label>
                    <select
                      value={preferences.dataRefreshRate}
                      onChange={(e) => handlePreferenceChange('dataRefreshRate', e.target.value)}
                      className="block w-full border border-gray-300 rounded-md py-2 px-4 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="off">Off (Manual refresh only)</option>
                      <option value="1m">Every minute</option>
                      <option value="5m">Every 5 minutes</option>
                      <option value="15m">Every 15 minutes</option>
                      <option value="30m">Every 30 minutes</option>
                      <option value="1h">Hourly</option>
                    </select>
                    <p className="mt-1 text-xs text-gray-500">
                      How often to automatically refresh data
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date Format
                    </label>
                    <select
                      value={preferences.dateFormat}
                      onChange={(e) => handlePreferenceChange('dateFormat', e.target.value)}
                      className="block w-full border border-gray-300 rounded-md py-2 px-4 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                    <p className="mt-1 text-xs text-gray-500">
                      Format for displaying dates throughout the application
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Currency Format
                    </label>
                    <select
                      value={preferences.currencyFormat}
                      onChange={(e) => handlePreferenceChange('currencyFormat', e.target.value)}
                      className="block w-full border border-gray-300 rounded-md py-2 px-4 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="JPY">JPY (¥)</option>
                      <option value="CAD">CAD (C$)</option>
                    </select>
                    <p className="mt-1 text-xs text-gray-500">
                      Primary currency for financial values
                    </p>
                  </div>
                </div>
                
                <h4 className="font-medium text-gray-800 mt-8 mb-4">Display Options</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h5 className="font-medium">Show Historical Comparisons</h5>
                      <p className="text-sm text-gray-600 mt-1">
                        Display year-over-year or month-over-month comparison data on charts
                      </p>
                    </div>
                    <div className={`w-12 h-6 flex items-center rounded-full p-1 ${
                      preferences.showHistoricalComparisons ? 'bg-indigo-600' : 'bg-gray-300'
                    }`}
                    onClick={() => handlePreferenceChange('showHistoricalComparisons', !preferences.showHistoricalComparisons)}>
                      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        preferences.showHistoricalComparisons ? 'translate-x-6' : ''
                      }`}></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h5 className="font-medium">Show Confidence Intervals</h5>
                      <p className="text-sm text-gray-600 mt-1">
                        Display prediction confidence intervals on forecast charts
                      </p>
                    </div>
                    <div className={`w-12 h-6 flex items-center rounded-full p-1 ${
                      preferences.showConfidenceIntervals ? 'bg-indigo-600' : 'bg-gray-300'
                    }`}
                    onClick={() => handlePreferenceChange('showConfidenceIntervals', !preferences.showConfidenceIntervals)}>
                      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        preferences.showConfidenceIntervals ? 'translate-x-6' : ''
                      }`}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium flex items-center">
                      <Lock size={18} className="mr-2 text-indigo-600" />
                      Password Management
                    </h4>
                    <p className="text-sm text-gray-600 mt-2 mb-4">
                      Last password change: {new Date(security.lastPasswordChange).toLocaleDateString()}
                    </p>
                    
                    <div className="space-y-3">
                      <button className="w-full text-left text-sm bg-white p-3 border rounded-md hover:border-indigo-300 transition-colors">
                        Change Password
                      </button>
                      <button className="w-full text-left text-sm bg-white p-3 border rounded-md hover:border-indigo-300 transition-colors">
                        Set Up Recovery Options
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium flex items-center">
                        <Shield size={18} className="mr-2 text-indigo-600" />
                        Two-Factor Authentication
                      </h4>
                      <div className={`w-12 h-6 flex items-center rounded-full p-1 ${
                        security.twoFactorEnabled ? 'bg-indigo-600' : 'bg-gray-300'
                      }`}
                      onClick={() => handleSecurityChange('twoFactorEnabled', !security.twoFactorEnabled)}>
                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          security.twoFactorEnabled ? 'translate-x-6' : ''
                        }`}></div>
                      </div>
                    </div>
                    
                    {security.twoFactorEnabled ? (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-800 flex items-center">
                        <Check size={16} className="mr-2" />
                        Two-factor authentication is enabled
                      </div>
                    ) : (
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
                        Two-factor authentication is recommended for enhanced security
                      </div>
                    )}
                    
                    {security.twoFactorEnabled && (
                      <div className="mt-3">
                        <button className="text-sm text-indigo-600 hover:text-indigo-800">
                          Reconfigure 2FA
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Session Timeout
                    </label>
                    <select
                      value={security.sessionTimeout}
                      onChange={(e) => handleSecurityChange('sessionTimeout', e.target.value)}
                      className="block w-full border border-gray-300 rounded-md py-2 px-4 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="never">Never timeout</option>
                      <option value="15m">15 minutes</option>
                      <option value="30m">30 minutes</option>
                      <option value="1h">1 hour</option>
                      <option value="4h">4 hours</option>
                      <option value="8h">8 hours</option>
                    </select>
                    <p className="mt-1 text-xs text-gray-500">
                      How long until an inactive session is automatically logged out
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h5 className="font-medium">Login Notifications</h5>
                      <p className="text-sm text-gray-600 mt-1">
                        Receive email notifications when there's a new login to your account
                      </p>
                    </div>
                    <div className={`w-12 h-6 flex items-center rounded-full p-1 ${
                      security.loginNotifications ? 'bg-indigo-600' : 'bg-gray-300'
                    }`}
                    onClick={() => handleSecurityChange('loginNotifications', !security.loginNotifications)}>
                      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        security.loginNotifications ? 'translate-x-6' : ''
                      }`}></div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 p-4 border border-gray-300 rounded-lg bg-gray-50">
                  <h4 className="font-medium mb-3">Security Log</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between p-2 border-b border-gray-200">
                      <span>Last successful login</span>
                      <span className="text-gray-600">Today, 9:45 AM</span>
                    </div>
                    <div className="flex justify-between p-2 border-b border-gray-200">
                      <span>Last login location</span>
                      <span className="text-gray-600">San Francisco, CA</span>
                    </div>
                    <div className="flex justify-between p-2 border-b border-gray-200">
                      <span>Failed login attempts (last 30 days)</span>
                      <span className="text-gray-600">0</span>
                    </div>
                    <div className="flex justify-between p-2">
                      <span>Active sessions</span>
                      <span className="text-gray-600">1</span>
                    </div>
                  </div>
                  <button className="mt-3 text-sm text-indigo-600 hover:text-indigo-800 flex items-center">
                    <EyeOff size={14} className="mr-1" />
                    View full security log
                  </button>
                </div>
              </div>
            )}
            
            {/* Data Management Settings */}
            {activeTab === 'data' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Data Management</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Historical Data Retention
                    </label>
                    <select
                      value={dataRetention.keepHistoricalData}
                      onChange={(e) => handleDataRetentionChange('keepHistoricalData', e.target.value)}
                      className="block w-full border border-gray-300 rounded-md py-2 px-4 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="3m">3 months</option>
                      <option value="6m">6 months</option>
                      <option value="12m">12 months</option>
                      <option value="24m">24 months</option>
                      <option value="unlimited">Unlimited</option>
                    </select>
                    <p className="mt-1 text-xs text-gray-500">
                      How long to keep historical financial data in the system
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h5 className="font-medium">Automatic Backups</h5>
                      <p className="text-sm text-gray-600 mt-1">
                        Regularly back up your financial data and settings
                      </p>
                    </div>
                    <div className={`w-12 h-6 flex items-center rounded-full p-1 ${
                      dataRetention.automaticBackups ? 'bg-indigo-600' : 'bg-gray-300'
                    }`}
                    onClick={() => handleDataRetentionChange('automaticBackups', !dataRetention.automaticBackups)}>
                      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        dataRetention.automaticBackups ? 'translate-x-6' : ''
                      }`}></div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Backup Frequency
                    </label>
                    <select
                      value={dataRetention.backupFrequency}
                      onChange={(e) => handleDataRetentionChange('backupFrequency', e.target.value)}
                      disabled={!dataRetention.automaticBackups}
                      className={`block w-full border border-gray-300 rounded-md py-2 px-4 focus:ring-indigo-500 focus:border-indigo-500 ${
                        !dataRetention.automaticBackups ? 'bg-gray-100 text-gray-500' : ''
                      }`}
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="biweekly">Bi-weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                    <p className="mt-1 text-xs text-gray-500">
                      How often backups should be created
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Backup Storage Location
                    </label>
                    <select
                      value={dataRetention.backupLocation}
                      onChange={(e) => handleDataRetentionChange('backupLocation', e.target.value)}
                      disabled={!dataRetention.automaticBackups}
                      className={`block w-full border border-gray-300 rounded-md py-2 px-4 focus:ring-indigo-500 focus:border-indigo-500 ${
                        !dataRetention.automaticBackups ? 'bg-gray-100 text-gray-500' : ''
                      }`}
                    >
                      <option value="cloud">Cloud Storage (Encrypted)</option>
                      <option value="local">Local Storage Only</option>
                      <option value="both">Both Cloud and Local</option>
                    </select>
                    <p className="mt-1 text-xs text-gray-500">
                      Where backup data should be stored
                    </p>
                  </div>
                </div>
                
                <div className="mt-8 p-4 border-t border-gray-200">
                  <h4 className="font-medium text-gray-800 mb-4">Data Actions</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button className="text-sm flex items-center justify-center p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                      <Database size={16} className="mr-2 text-indigo-600" />
                      Export All Data
                    </button>
                    
                    <button className="text-sm flex items-center justify-center p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                      <Database size={16} className="mr-2 text-indigo-600" />
                      Import Data
                    </button>
                    
                    <button className="text-sm flex items-center justify-center p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                      <RefreshCw size={16} className="mr-2 text-yellow-600" />
                      Reset Cash Flow History
                    </button>
                    
                    <button className="text-sm flex items-center justify-center p-3 border border-red-200 text-red-700 rounded-md hover:bg-red-50 transition-colors">
                      <Trash2 size={16} className="mr-2" />
                      Delete All Data
                    </button>
                  </div>
                </div>
                
                <div className="p-4 mt-6 bg-yellow-50 border border-yellow-200 rounded-md">
                  <h4 className="font-medium text-yellow-800 flex items-center">
                    <Shield size={16} className="mr-2" />
                    Data Privacy
                  </h4>
                  <p className="mt-2 text-sm text-yellow-700">
                    This is a demonstration app with simulated data. In a production environment, all financial data would be encrypted both in transit and at rest, and comply with relevant financial regulations.
                  </p>
                </div>
              </div>
            )}
            
            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Settings</h3>
                
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-3">Email Notifications</h4>
                    <div className="space-y-3 ml-2">
                      <div className="flex items-center">
                        <input 
                          id="email-alerts" 
                          type="checkbox" 
                          checked={true}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="email-alerts" className="ml-2 block text-sm text-gray-700">
                          Cash flow alerts
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          id="email-reports" 
                          type="checkbox" 
                          checked={true}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="email-reports" className="ml-2 block text-sm text-gray-700">
                          Weekly summary reports
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          id="email-forecasts" 
                          type="checkbox" 
                          checked={false}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="email-forecasts" className="ml-2 block text-sm text-gray-700">
                          Forecast updates
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          id="email-tips" 
                          type="checkbox" 
                          checked={false}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="email-tips" className="ml-2 block text-sm text-gray-700">
                          Tips and product updates
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-3">In-App Notifications</h4>
                    <div className="space-y-3 ml-2">
                      <div className="flex items-center">
                        <input 
                          id="app-alerts" 
                          type="checkbox" 
                          checked={true}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="app-alerts" className="ml-2 block text-sm text-gray-700">
                          Cash flow alerts
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          id="app-reminders" 
                          type="checkbox" 
                          checked={true}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="app-reminders" className="ml-2 block text-sm text-gray-700">
                          Analysis reminders
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          id="app-tips" 
                          type="checkbox" 
                          checked={true}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="app-tips" className="ml-2 block text-sm text-gray-700">
                          Financial insights and tips
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          id="app-updates" 
                          type="checkbox" 
                          checked={true}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="app-updates" className="ml-2 block text-sm text-gray-700">
                          System updates and maintenance
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-3">Notification Schedule</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Notification Time Window
                        </label>
                        <div className="flex space-x-3">
                          <select
                            className="block w-full border border-gray-300 rounded-md py-2 px-4 focus:ring-indigo-500 focus:border-indigo-500"
                            defaultValue="9:00"
                          >
                            {Array.from({ length: 24 }, (_, i) => {
                              const hour = i.toString().padStart(2, '0');
                              return <option key={hour} value={`${hour}:00`}>{`${hour}:00`}</option>;
                            })}
                          </select>
                          <span className="self-center">to</span>
                          <select
                            className="block w-full border border-gray-300 rounded-md py-2 px-4 focus:ring-indigo-500 focus:border-indigo-500"
                            defaultValue="17:00"
                          >
                            {Array.from({ length: 24 }, (_, i) => {
                              const hour = i.toString().padStart(2, '0');
                              return <option key={hour} value={`${hour}:00`}>{`${hour}:00`}</option>;
                            })}
                          </select>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          Only receive notifications during these hours
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Quiet Days
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                            <button
                              key={day}
                              className={`px-2 py-1 rounded-md text-xs ${
                                index >= 5 
                                  ? 'bg-gray-200 text-gray-600' 
                                  : 'bg-white border border-gray-300 text-gray-700'
                              }`}
                            >
                              {day}
                            </button>
                          ))}
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          Selected days will not receive notifications
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h5 className="font-medium">Notification Sound</h5>
                      <p className="text-sm text-gray-600 mt-1">
                        Play a sound when receiving in-app notifications
                      </p>
                    </div>
                    <div className={`w-12 h-6 flex items-center rounded-full p-1 bg-indigo-600`}
                    onClick={() => {}}>
                      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform translate-x-6`}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="lg:col-span-1">
        <div className="h-[780px]">
          <TabChatInterface
            agentName="Settings Agent"
            agentNumber="Agent-09"
            agentDescription="I help you configure and customize the application to meet your needs."
            placeholderText="Ask about settings..."
            suggestedQuestions={suggestedQuestions}
            view="settings"
          />
        </div>
      </div>
    </div>
  );
};

export default Settings;