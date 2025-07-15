import React, { useState } from 'react';
import { Library, Plus, Trash2, Edit, Check, PlayCircle, Download, X, Copy } from 'lucide-react';

interface ScenarioTemplate {
  id: string;
  name: string;
  description: string;
  category: 'risk' | 'growth' | 'operational' | 'custom';
  parameters: {
    inflowAdjustment: number;
    outflowAdjustment: number;
    delayedPayments: number;
    oneTimeExpense: number;
    oneTimeExpenseDate: string;
    oneTimeRevenue: number;
    oneTimeRevenueDate: string;
  };
  industry: string[];
  author: string;
  dateCreated: string;
}

interface ScenarioLibraryProps {
  onApplyScenario: (parameters: any) => void;
  industryType: string;
}

const ScenarioLibrary: React.FC<ScenarioLibraryProps> = ({ onApplyScenario, industryType }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'risk' | 'growth' | 'operational' | 'custom'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editMode, setEditMode] = useState(false);
  
  const predefinedScenarios: ScenarioTemplate[] = [
    {
      id: 'recession',
      name: 'Market Recession',
      description: 'Simulates a severe economic downturn with decreased revenue and delayed payments',
      category: 'risk',
      parameters: {
        inflowAdjustment: -30,
        outflowAdjustment: 0,
        delayedPayments: 30,
        oneTimeExpense: 0,
        oneTimeExpenseDate: new Date().toISOString().split('T')[0],
        oneTimeRevenue: 0,
        oneTimeRevenueDate: new Date().toISOString().split('T')[0],
      },
      industry: ['all'],
      author: 'System',
      dateCreated: '2025-01-15'
    },
    {
      id: 'growth-surge',
      name: 'Rapid Growth Surge',
      description: 'Models a significant uptick in sales with corresponding increase in expenses',
      category: 'growth',
      parameters: {
        inflowAdjustment: 40,
        outflowAdjustment: 25,
        delayedPayments: 0,
        oneTimeExpense: 50000,
        oneTimeExpenseDate: new Date().toISOString().split('T')[0],
        oneTimeRevenue: 0,
        oneTimeRevenueDate: new Date().toISOString().split('T')[0],
      },
      industry: ['all'],
      author: 'System',
      dateCreated: '2025-01-15'
    },
    {
      id: 'delayed-payments',
      name: 'Major Customer Payment Delay',
      description: 'Simulates a key customer delaying their payments by 45 days',
      category: 'risk',
      parameters: {
        inflowAdjustment: 0,
        outflowAdjustment: 0,
        delayedPayments: 45,
        oneTimeExpense: 0,
        oneTimeExpenseDate: new Date().toISOString().split('T')[0],
        oneTimeRevenue: 0,
        oneTimeRevenueDate: new Date().toISOString().split('T')[0],
      },
      industry: ['all'],
      author: 'System',
      dateCreated: '2025-01-15'
    },
    {
      id: 'seasonal-peak',
      name: 'Seasonal Peak',
      description: 'Models a strong seasonal sales period with increased operational expenses',
      category: 'operational',
      parameters: {
        inflowAdjustment: 35,
        outflowAdjustment: 20,
        delayedPayments: 0,
        oneTimeExpense: 0,
        oneTimeExpenseDate: new Date().toISOString().split('T')[0],
        oneTimeRevenue: 0,
        oneTimeRevenueDate: new Date().toISOString().split('T')[0],
      },
      industry: ['retail'],
      author: 'System',
      dateCreated: '2025-01-15'
    },
    {
      id: 'cost-cutting',
      name: 'Strategic Cost Reduction',
      description: 'Simulates the impact of a 15% reduction in operational expenses',
      category: 'operational',
      parameters: {
        inflowAdjustment: 0,
        outflowAdjustment: -15,
        delayedPayments: 0,
        oneTimeExpense: 25000,
        oneTimeExpenseDate: new Date().toISOString().split('T')[0],
        oneTimeRevenue: 0,
        oneTimeRevenueDate: new Date().toISOString().split('T')[0],
      },
      industry: ['all'],
      author: 'System',
      dateCreated: '2025-01-15'
    },
    {
      id: 'major-contract',
      name: 'Major Contract Win',
      description: 'Models winning a significant new contract with upfront costs and delayed revenue',
      category: 'growth',
      parameters: {
        inflowAdjustment: 25,
        outflowAdjustment: 15,
        delayedPayments: 0,
        oneTimeExpense: 75000,
        oneTimeExpenseDate: new Date().toISOString().split('T')[0],
        oneTimeRevenue: 150000,
        oneTimeRevenueDate: new Date(new Date().setDate(new Date().getDate() + 45)).toISOString().split('T')[0],
      },
      industry: ['manufacturing', 'saas'],
      author: 'System',
      dateCreated: '2025-01-15'
    },
  ];
  
  const [scenarios, setScenarios] = useState<ScenarioTemplate[]>(predefinedScenarios);
  
  // Filter scenarios based on selected filter and search term
  const filteredScenarios = scenarios.filter(scenario => {
    const matchesFilter = filter === 'all' || scenario.category === filter;
    const matchesSearch = scenario.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         scenario.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = scenario.industry.includes('all') || scenario.industry.includes(industryType);
    
    return matchesFilter && matchesSearch && matchesIndustry;
  });
  
  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'risk':
        return 'bg-red-100 text-red-800';
      case 'growth':
        return 'bg-green-100 text-green-800';
      case 'operational':
        return 'bg-blue-100 text-blue-800';
      case 'custom':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const handleApplyScenario = (scenario: ScenarioTemplate) => {
    onApplyScenario(scenario.parameters);
    setIsOpen(false);
  };
  
  const handleDeleteScenario = (id: string) => {
    setScenarios(prev => prev.filter(scenario => scenario.id !== id));
  };
  
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center text-indigo-600 hover:text-indigo-800"
      >
        <Library size={18} className="mr-1" />
        <span>Scenario Library</span>
      </button>
    );
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold flex items-center">
            <Library size={20} className="mr-2 text-indigo-600" />
            Scenario Library
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 border-b bg-gray-50">
          <div className="flex flex-wrap gap-2 items-center">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search scenarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            
            <div className="flex space-x-1">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-md text-sm ${
                  filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('risk')}
                className={`px-3 py-1 rounded-md text-sm ${
                  filter === 'risk' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                Risk
              </button>
              <button
                onClick={() => setFilter('growth')}
                className={`px-3 py-1 rounded-md text-sm ${
                  filter === 'growth' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                Growth
              </button>
              <button
                onClick={() => setFilter('operational')}
                className={`px-3 py-1 rounded-md text-sm ${
                  filter === 'operational' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                Operational
              </button>
            </div>
            
            <button
              onClick={() => setEditMode(!editMode)}
              className={`px-3 py-1 rounded-md text-sm ${
                editMode ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {editMode ? 'Done Editing' : 'Edit Library'}
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {filteredScenarios.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="mb-2">
                <Library size={48} className="mx-auto text-gray-300" />
              </div>
              <p>No scenarios match your search or filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredScenarios.map(scenario => (
                <div 
                  key={scenario.id}
                  className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-white"
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{scenario.name}</h3>
                        <div className="flex items-center mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getCategoryBadgeColor(scenario.category)}`}>
                            {scenario.category.charAt(0).toUpperCase() + scenario.category.slice(1)}
                          </span>
                          {scenario.industry.includes('all') ? (
                            <span className="text-xs text-gray-500 ml-2">All Industries</span>
                          ) : (
                            <span className="text-xs text-gray-500 ml-2">
                              {scenario.industry.map(i => i.charAt(0).toUpperCase() + i.slice(1)).join(', ')}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {!editMode ? (
                        <button
                          onClick={() => handleApplyScenario(scenario)}
                          className="bg-indigo-600 text-white p-1 rounded hover:bg-indigo-700"
                          title="Apply Scenario"
                        >
                          <PlayCircle size={18} />
                        </button>
                      ) : (
                        <div className="flex space-x-1">
                          <button
                            className="text-blue-600 p-1 rounded hover:bg-blue-50"
                            title="Edit Scenario"
                          >
                            <Edit size={16} />
                          </button>
                          
                          <button
                            className="text-indigo-600 p-1 rounded hover:bg-indigo-50"
                            title="Duplicate Scenario"
                          >
                            <Copy size={16} />
                          </button>
                          
                          {scenario.author !== 'System' && (
                            <button
                              onClick={() => handleDeleteScenario(scenario.id)}
                              className="text-red-600 p-1 rounded hover:bg-red-50"
                              title="Delete Scenario"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-2">{scenario.description}</p>
                    
                    <div className="mt-4 border-t pt-3">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-500">Revenue:</span> 
                          <span className={scenario.parameters.inflowAdjustment >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {scenario.parameters.inflowAdjustment >= 0 ? '+' : ''}{scenario.parameters.inflowAdjustment}%
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Expenses:</span> 
                          <span className={scenario.parameters.outflowAdjustment <= 0 ? 'text-green-600' : 'text-red-600'}>
                            {scenario.parameters.outflowAdjustment >= 0 ? '+' : ''}{scenario.parameters.outflowAdjustment}%
                          </span>
                        </div>
                        {scenario.parameters.delayedPayments > 0 && (
                          <div>
                            <span className="text-gray-500">Payment Delays:</span> 
                            <span className="text-red-600">+{scenario.parameters.delayedPayments} days</span>
                          </div>
                        )}
                        {scenario.parameters.oneTimeExpense > 0 && (
                          <div>
                            <span className="text-gray-500">One-time Expense:</span> 
                            <span className="text-red-600">${scenario.parameters.oneTimeExpense.toLocaleString()}</span>
                          </div>
                        )}
                        {scenario.parameters.oneTimeRevenue > 0 && (
                          <div>
                            <span className="text-gray-500">One-time Revenue:</span> 
                            <span className="text-green-600">${scenario.parameters.oneTimeRevenue.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-4 py-2 bg-gray-50 text-xs text-gray-500 flex justify-between">
                    <span>Created by: {scenario.author}</span>
                    <span>Date: {scenario.dateCreated}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t flex justify-between">
          <button
            className="text-sm text-gray-600 hover:text-gray-800"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </button>
          
          <div className="flex space-x-2">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              onClick={() => setIsOpen(false)}
            >
              Close
            </button>
            
            <button
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center"
            >
              <Plus size={16} className="mr-1" />
              New Scenario
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioLibrary;