import React, { useState } from 'react';
import { Database, Download, ExternalLink, FileText, Globe, Lock, RefreshCw, Share2, Check, AlertTriangle, Info } from 'lucide-react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import TabChatInterface from './TabChatInterface';

interface DataIntegrationProps {
  forecastData: any;
  historicalData: any;
}

const DataIntegration: React.FC<DataIntegrationProps> = ({ forecastData, historicalData }) => {
  const [activeTab, setActiveTab] = useState('export');
  const [exportFormat, setExportFormat] = useState('csv');
  const [exportDataType, setExportDataType] = useState('forecast');
  const [selectedSystem, setSelectedSystem] = useState('');
  const [connectedSystems, setConnectedSystems] = useState<string[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState('');
  const [exportSuccess, setExportSuccess] = useState(false);
  
  const suggestedQuestions = [
    "What file formats can I export to?",
    "How do I connect to my ERP system?",
    "What APIs are available?",
    "How secure is the data integration?"
  ];
  
  const handleExportData = () => {
    // Get the data to export
    const dataToExport = exportDataType === 'forecast' 
      ? forecastData.dailyForecasts 
      : exportDataType === 'historical' 
        ? historicalData.dailyData
        : [...historicalData.dailyData, ...forecastData.dailyForecasts];
    
    // Format data for export
    const formattedData = dataToExport.map((item: any) => ({
      Date: item.date,
      Inflows: item.inflows,
      Outflows: item.outflows,
      Balance: item.balance,
      ...(exportDataType === 'forecast' ? { Confidence: `${item.confidence}%` } : {})
    }));
    
    if (exportFormat === 'csv') {
      // Convert to CSV
      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, `cash_flow_${exportDataType}_${new Date().toISOString().split('T')[0]}.csv`);
    } else if (exportFormat === 'xlsx') {
      // Convert to XLSX
      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, exportDataType.charAt(0).toUpperCase() + exportDataType.slice(1));
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `cash_flow_${exportDataType}_${new Date().toISOString().split('T')[0]}.xlsx`);
    } else if (exportFormat === 'json') {
      // Convert to JSON
      const json = JSON.stringify(formattedData, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      saveAs(blob, `cash_flow_${exportDataType}_${new Date().toISOString().split('T')[0]}.json`);
    }
    
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };
  
  const handleConnectSystem = () => {
    if (!selectedSystem) return;
    
    setIsConnecting(true);
    setConnectionError('');
    
    // Simulate connection process
    setTimeout(() => {
      if (Math.random() > 0.2) { // 80% success rate for demo
        setConnectedSystems(prev => [...prev, selectedSystem]);
        setSelectedSystem('');
      } else {
        setConnectionError(`Failed to connect to ${selectedSystem}. Please check your credentials and try again.`);
      }
      setIsConnecting(false);
    }, 2000);
  };
  
  const handleDisconnectSystem = (system: string) => {
    setConnectedSystems(prev => prev.filter(s => s !== system));
  };
  
  const integrationSystems = [
    { id: 'sap', name: 'SAP', category: 'erp', icon: <Database size={18} /> },
    { id: 'oracle', name: 'Oracle NetSuite', category: 'erp', icon: <Database size={18} /> },
    { id: 'quickbooks', name: 'QuickBooks', category: 'accounting', icon: <FileText size={18} /> },
    { id: 'xero', name: 'Xero', category: 'accounting', icon: <FileText size={18} /> },
    { id: 'salesforce', name: 'Salesforce', category: 'crm', icon: <Globe size={18} /> },
    { id: 'bank_api', name: 'Bank API (Demo)', category: 'banking', icon: <Lock size={18} /> },
  ];
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Data Export & Integration</h2>
        </div>
        
        <p className="text-gray-600">
          Export your cash flow data or connect with external systems to enhance your financial analysis.
        </p>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="flex border-b">
            <button 
              onClick={() => setActiveTab('export')}
              className={`px-4 py-3 font-medium text-sm ${
                activeTab === 'export' 
                  ? 'border-b-2 border-indigo-600 text-indigo-600' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Download size={16} className="inline-block mr-1" />
              Export Data
            </button>
            <button 
              onClick={() => setActiveTab('integration')}
              className={`px-4 py-3 font-medium text-sm ${
                activeTab === 'integration' 
                  ? 'border-b-2 border-indigo-600 text-indigo-600' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Share2 size={16} className="inline-block mr-1" />
              System Integrations
            </button>
            <button 
              onClick={() => setActiveTab('api')}
              className={`px-4 py-3 font-medium text-sm ${
                activeTab === 'api' 
                  ? 'border-b-2 border-indigo-600 text-indigo-600' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Globe size={16} className="inline-block mr-1" />
              API Access
            </button>
          </div>
          
          <div className="p-6">
            {activeTab === 'export' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Export Financial Data</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Export your cash flow data in various formats for use in external analysis tools or reporting systems.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Data to Export</label>
                      <select
                        value={exportDataType}
                        onChange={(e) => setExportDataType(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      >
                        <option value="forecast">Forecast Data (90 days)</option>
                        <option value="historical">Historical Data (90 days)</option>
                        <option value="combined">Combined Historical & Forecast</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Export Format</label>
                      <select
                        value={exportFormat}
                        onChange={(e) => setExportFormat(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      >
                        <option value="csv">CSV</option>
                        <option value="xlsx">Excel (XLSX)</option>
                        <option value="json">JSON</option>
                      </select>
                    </div>
                    
                    <div className="flex items-end">
                      <button
                        onClick={handleExportData}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <Download size={16} className="mr-2" />
                        Export Data
                      </button>
                      
                      {exportSuccess && (
                        <span className="ml-3 text-sm text-green-600 flex items-center">
                          <Check size={16} className="mr-1" />
                          Export successful!
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-sm mb-2">Data Fields</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-white p-2 rounded border border-gray-200 text-xs">
                        <span className="font-medium">Date</span>
                        <span className="text-gray-500 block">YYYY-MM-DD</span>
                      </div>
                      <div className="bg-white p-2 rounded border border-gray-200 text-xs">
                        <span className="font-medium">Inflows</span>
                        <span className="text-gray-500 block">Daily Cash In</span>
                      </div>
                      <div className="bg-white p-2 rounded border border-gray-200 text-xs">
                        <span className="font-medium">Outflows</span>
                        <span className="text-gray-500 block">Daily Cash Out</span>
                      </div>
                      <div className="bg-white p-2 rounded border border-gray-200 text-xs">
                        <span className="font-medium">Balance</span>
                        <span className="text-gray-500 block">End of Day</span>
                      </div>
                      {exportDataType === 'forecast' && (
                        <div className="bg-white p-2 rounded border border-gray-200 text-xs">
                          <span className="font-medium">Confidence</span>
                          <span className="text-gray-500 block">Prediction Accuracy</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'integration' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Connect External Systems</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Integrate with your existing financial systems to enhance your cash flow predictions with real-time data.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Select System to Connect</label>
                      <select
                        value={selectedSystem}
                        onChange={(e) => setSelectedSystem(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      >
                        <option value="">Select a system...</option>
                        {integrationSystems
                          .filter(system => !connectedSystems.includes(system.id))
                          .map(system => (
                            <option key={system.id} value={system.id}>
                              {system.name} ({system.category})
                            </option>
                          ))
                        }
                      </select>
                    </div>
                    
                    <div className="flex items-end">
                      <button
                        onClick={handleConnectSystem}
                        disabled={!selectedSystem || isConnecting}
                        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                          !selectedSystem || isConnecting 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                        }`}
                      >
                        {isConnecting ? (
                          <>
                            <RefreshCw size={16} className="mr-2 animate-spin" />
                            Connecting...
                          </>
                        ) : (
                          <>
                            <Share2 size={16} className="mr-2" />
                            Connect
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {connectionError && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center">
                      <AlertTriangle size={18} className="mr-2" />
                      {connectionError}
                    </div>
                  )}
                  
                  <div>
                    <h4 className="font-medium text-sm mb-3">Connected Systems</h4>
                    {connectedSystems.length === 0 ? (
                      <p className="text-sm text-gray-500 italic">No systems connected yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {connectedSystems.map(systemId => {
                          const system = integrationSystems.find(s => s.id === systemId);
                          if (!system) return null;
                          
                          return (
                            <div key={system.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                              <div className="flex items-center">
                                <div className="bg-indigo-100 p-2 rounded-full mr-3">
                                  {system.icon}
                                </div>
                                <div>
                                  <p className="font-medium text-sm">{system.name}</p>
                                  <p className="text-xs text-gray-500">Connected • Auto-sync enabled</p>
                                </div>
                              </div>
                              <button
                                onClick={() => handleDisconnectSystem(system.id)}
                                className="text-sm text-gray-500 hover:text-red-500"
                              >
                                Disconnect
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6 bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded text-sm">
                    <h4 className="font-medium mb-1 flex items-center">
                      <AlertTriangle size={16} className="mr-1" />
                      Demo Environment Notice
                    </h4>
                    <p className="text-yellow-700">
                      This is a demonstration environment. System connections simulate the integration experience but do not connect to actual external systems.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'api' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">API Access</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Use our RESTful API to build custom integrations or retrieve real-time cash flow data.
                  </p>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">Your API Keys</h4>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                    </div>
                    
                    <div className="bg-white p-3 rounded border border-gray-200 mb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-500">API Key</p>
                          <p className="font-mono text-sm mt-1">********-****-****-****-************</p>
                        </div>
                        <button className="text-indigo-600 text-sm hover:text-indigo-800">
                          Show
                        </button>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <button className="text-sm text-indigo-600 hover:text-indigo-800">
                        Regenerate API Keys
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm mb-3">Available Endpoints</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-start">
                          <span className="font-mono text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded mt-0.5 mr-2">GET</span>
                          <div>
                            <p className="font-mono text-sm">/api/v1/cash-flow/forecast</p>
                            <p className="text-xs text-gray-500 mt-1">Retrieve cash flow forecast for the next 90 days</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-start">
                          <span className="font-mono text-xs bg-green-100 text-green-800 px-2 py-1 rounded mt-0.5 mr-2">GET</span>
                          <div>
                            <p className="font-mono text-sm">/api/v1/cash-flow/historical</p>
                            <p className="text-xs text-gray-500 mt-1">Retrieve historical cash flow data</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-start">
                          <span className="font-mono text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mt-0.5 mr-2">POST</span>
                          <div>
                            <p className="font-mono text-sm">/api/v1/cash-flow/simulate</p>
                            <p className="text-xs text-gray-500 mt-1">Run custom cash flow simulations with parametrized scenarios</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-start">
                          <span className="font-mono text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded mt-0.5 mr-2">GET</span>
                          <div>
                            <p className="font-mono text-sm">/api/v1/alerts</p>
                            <p className="text-xs text-gray-500 mt-1">Retrieve current alerts and notifications</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-sm">API Documentation</h4>
                      <a href="#" className="text-indigo-600 text-sm hover:text-indigo-800 flex items-center">
                        <ExternalLink size={14} className="mr-1" /> 
                        Open
                      </a>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-600 mb-3">
                        Our comprehensive API documentation includes example requests, response schemas, and implementation guides.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
                        <div className="p-3 bg-gray-50 rounded border border-gray-200">
                          <p className="text-xs font-medium mb-1">Authentication</p>
                          <p className="text-xs text-gray-500">OAuth 2.0 & API Keys</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded border border-gray-200">
                          <p className="text-xs font-medium mb-1">Response Format</p>
                          <p className="text-xs text-gray-500">JSON</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded border border-gray-200">
                          <p className="text-xs font-medium mb-1">Rate Limit</p>
                          <p className="text-xs text-gray-500">100 requests/minute</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 bg-indigo-50 border border-indigo-200 text-indigo-800 p-4 rounded text-sm">
                    <h4 className="font-medium mb-1 flex items-center">
                      <Info size={16} className="mr-1" />
                      Demo Environment Notice
                    </h4>
                    <p className="text-indigo-700">
                      This is a demonstration API environment. API calls will return simulated data and do not connect to actual financial systems.
                    </p>
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
            agentName="Integration Agent"
            agentNumber="Agent-06"
            agentDescription="I help you connect with external systems and export your financial data."
            placeholderText="Ask about data integration..."
            suggestedQuestions={suggestedQuestions}
            view="integration"
          />
        </div>
      </div>
    </div>
  );
};

export default DataIntegration;