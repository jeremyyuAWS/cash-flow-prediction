import React, { useState, useEffect } from 'react';
import { format, parseISO, addDays } from 'date-fns';
import { TrendingUp, ArrowUpRight, ArrowDownRight, RefreshCw, Download, Library, Save, AlertTriangle } from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area
} from 'recharts';
import { generateForecastData } from '../utils/dataGenerator';
import TabChatInterface from './TabChatInterface';
import InteractiveChart from './InteractiveChart';
import ScenarioLibrary from './ScenarioLibrary';
import { createNotification } from './NotificationSystem';

interface ScenarioPlannerProps {
  historicalData: any;
  forecastData: any;
  onDownloadReport: () => void;
  onAddNotification?: (notification: any) => void;
}

const ScenarioPlanner: React.FC<ScenarioPlannerProps> = ({ 
  historicalData, 
  forecastData,
  onDownloadReport,
  onAddNotification
}) => {
  const [scenarios, setScenarios] = useState([
    { id: 'base', name: 'Base Forecast', data: forecastData, color: '#3b82f6', isActive: true },
    { id: 'optimistic', name: 'Optimistic', data: null, color: '#10b981', isActive: false },
    { id: 'pessimistic', name: 'Pessimistic', data: null, color: '#ef4444', isActive: false },
    { id: 'custom', name: 'Custom Scenario', data: null, color: '#8b5cf6', isActive: false }
  ]);

  const [adjustments, setAdjustments] = useState({
    inflowAdjustment: 0,
    outflowAdjustment: 0,
    delayedPayments: 0,
    oneTimeExpense: 0,
    oneTimeExpenseDate: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
    oneTimeRevenue: 0,
    oneTimeRevenueDate: format(addDays(new Date(), 15), 'yyyy-MM-dd'),
  });

  const [lastSavedScenario, setLastSavedScenario] = useState<string | null>(null);
  const [scenarioName, setScenarioName] = useState('Custom Scenario');
  const [showSaveForm, setShowSaveForm] = useState(false);

  const suggestedQuestions = [
    "What if revenue increases by 20%?",
    "What if our largest customer delays payment?",
    "How would a market downturn affect us?",
    "Can you recommend contingency plans?"
  ];

  // Generate optimistic and pessimistic scenarios on load
  useEffect(() => {
    if (forecastData) {
      // Deep clone historical data
      const optimisticHistory = JSON.parse(JSON.stringify(historicalData));
      const pessimisticHistory = JSON.parse(JSON.stringify(historicalData));
      
      // Modify the historical data
      optimisticHistory.dailyData = optimisticHistory.dailyData.map((day: any) => ({
        ...day,
        inflows: Math.round(day.inflows * 1.15),
        outflows: Math.round(day.outflows * 0.9)
      }));
      
      pessimisticHistory.dailyData = pessimisticHistory.dailyData.map((day: any) => ({
        ...day,
        inflows: Math.round(day.inflows * 0.85),
        outflows: Math.round(day.outflows * 1.1)
      }));
      
      // Generate forecast based on modified history
      const optimisticData = generateForecastData(optimisticHistory);
      const pessimisticData = generateForecastData(pessimisticHistory);
      
      // Update scenarios
      setScenarios(prevScenarios => 
        prevScenarios.map(scenario => {
          if (scenario.id === 'optimistic') {
            return { ...scenario, data: optimisticData };
          } else if (scenario.id === 'pessimistic') {
            return { ...scenario, data: pessimisticData };
          }
          return scenario;
        })
      );
    }
  }, [forecastData, historicalData]);

  const toggleScenario = (id: string) => {
    setScenarios(prevScenarios => 
      prevScenarios.map(scenario => ({
        ...scenario,
        isActive: scenario.id === id ? true : false
      }))
    );
    
    // If selecting base scenario, show a notification about the forecast confidence
    if (id === 'base' && onAddNotification) {
      onAddNotification(createNotification(
        'info',
        'Forecast Confidence',
        'The base forecast has a 92% confidence rating based on 3 months of historical data.',
        [{ label: 'View Details', onClick: () => console.log('View details clicked') }]
      ));
    }
    
    // If selecting pessimistic scenario, show a risk notification
    if (id === 'pessimistic' && onAddNotification) {
      onAddNotification(createNotification(
        'warning',
        'Liquidity Risk Detected',
        'The pessimistic scenario shows potential cash flow shortages in late May 2025.',
        [{ label: 'Run Contingency Analysis', onClick: () => console.log('Contingency analysis clicked') }]
      ));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAdjustments(prev => ({
      ...prev,
      [name]: name.includes('Date') ? value : Number(value)
    }));
    
    // Clear last saved status when making changes
    setLastSavedScenario(null);
  };

  const applyCustomScenario = () => {
    if (!historicalData) return;
    
    // Deep clone historical data
    const customHistory = JSON.parse(JSON.stringify(historicalData));
    
    // Apply inflow/outflow adjustments to all days
    customHistory.dailyData = customHistory.dailyData.map((day: any) => ({
      ...day,
      inflows: Math.round(day.inflows * (1 + adjustments.inflowAdjustment / 100)),
      outflows: Math.round(day.outflows * (1 + adjustments.outflowAdjustment / 100))
    }));
    
    // Generate forecast with adjusted history
    let customData = generateForecastData(customHistory);
    
    // Modify the forecast data with one-time events
    if (adjustments.oneTimeExpense > 0) {
      const expenseDate = adjustments.oneTimeExpenseDate;
      customData.dailyForecasts = customData.dailyForecasts.map((day: any) => {
        if (day.date === expenseDate) {
          return {
            ...day,
            outflows: day.outflows + adjustments.oneTimeExpense,
            balance: day.balance - adjustments.oneTimeExpense
          };
        }
        // Adjust balances for all days after the expense
        if (day.date > expenseDate) {
          return {
            ...day,
            balance: day.balance - adjustments.oneTimeExpense
          };
        }
        return day;
      });
    }
    
    if (adjustments.oneTimeRevenue > 0) {
      const revenueDate = adjustments.oneTimeRevenueDate;
      customData.dailyForecasts = customData.dailyForecasts.map((day: any) => {
        if (day.date === revenueDate) {
          return {
            ...day,
            inflows: day.inflows + adjustments.oneTimeRevenue,
            balance: day.balance + adjustments.oneTimeRevenue
          };
        }
        // Adjust balances for all days after the revenue
        if (day.date > revenueDate) {
          return {
            ...day,
            balance: day.balance + adjustments.oneTimeRevenue
          };
        }
        return day;
      });
    }
    
    // Simulate payment delays
    if (adjustments.delayedPayments > 0) {
      // Identify days with significant inflows
      const significantInflowDays = customData.dailyForecasts
        .filter((day: any, index: number) => 
          index < 60 && day.inflows > customData.dailyForecasts.reduce((avg: number, d: any) => avg + d.inflows, 0) / customData.dailyForecasts.length
        )
        .slice(0, 5); // Take top 5 inflow days
      
      // Delay these payments
      significantInflowDays.forEach((inflowDay: any) => {
        const originalDate = inflowDay.date;
        const delayedDate = format(
          addDays(parseISO(originalDate), adjustments.delayedPayments),
          'yyyy-MM-dd'
        );
        
        const inflow = inflowDay.inflows;
        
        // Remove inflow from original date
        customData.dailyForecasts = customData.dailyForecasts.map((day: any) => {
          if (day.date === originalDate) {
            return {
              ...day,
              inflows: day.inflows - inflow,
              balance: day.balance - inflow
            };
          }
          // Reduce balance for all days between original and delayed date
          if (day.date > originalDate && day.date < delayedDate) {
            return {
              ...day,
              balance: day.balance - inflow
            };
          }
          // Add inflow to delayed date
          if (day.date === delayedDate) {
            return {
              ...day,
              inflows: day.inflows + inflow,
              balance: day.balance
            };
          }
          return day;
        });
      });
    }
    
    // Recalculate monthly forecasts based on modified daily forecasts
    const monthlyForecasts = [];
    const currentDate = new Date();
    const months = [];
    
    for (let i = 0; i < 3; i++) {
      const month = new Date(currentDate);
      month.setMonth(currentDate.getMonth() + i);
      months.push(month.toLocaleString('default', { month: 'short', year: 'numeric' }));
      
      const daysInMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + i + 1,
        0
      ).getDate();
      
      const monthStart = i === 0 ? 0 : customData.dailyForecasts.findIndex((forecast: any) => {
        const forecastDate = new Date(forecast.date);
        return forecastDate.getMonth() === (currentDate.getMonth() + i) % 12 &&
               forecastDate.getDate() === 1;
      });
      
      if (monthStart === -1) continue;
      
      const monthEnd = Math.min(
        monthStart + daysInMonth - 1,
        customData.dailyForecasts.length - 1
      );
      
      const monthData = customData.dailyForecasts.slice(monthStart, monthEnd + 1);
      
      if (monthData.length === 0) continue;
      
      const totalInflows = monthData.reduce((sum: number, day: any) => sum + day.inflows, 0);
      const totalOutflows = monthData.reduce((sum: number, day: any) => sum + day.outflows, 0);
      const endBalance = monthData[monthData.length - 1].balance;
      const avgConfidence = Math.round(
        monthData.reduce((sum: number, day: any) => sum + day.confidence, 0) / monthData.length
      );
      
      monthlyForecasts.push({
        month: months[i],
        inflows: totalInflows,
        outflows: totalOutflows,
        balance: endBalance,
        confidence: avgConfidence
      });
    }
    
    customData.monthlyForecasts = monthlyForecasts;
    
    // Update custom scenario
    setScenarios(prevScenarios => 
      prevScenarios.map(scenario => {
        if (scenario.id === 'custom') {
          return { ...scenario, data: customData, isActive: true, name: scenarioName };
        }
        return { ...scenario, isActive: scenario.id === 'custom' };
      })
    );
    
    // Show notification about the impact
    if (onAddNotification) {
      // Check for critical impacts
      const firstDayBalance = customData.dailyForecasts[0].balance;
      const lastDayBalance = customData.dailyForecasts[customData.dailyForecasts.length - 1].balance;
      const cashGrowth = ((lastDayBalance - firstDayBalance) / firstDayBalance) * 100;
      
      if (cashGrowth < -20) {
        onAddNotification(createNotification(
          'warning',
          'Critical Cash Flow Impact',
          `This scenario results in a ${Math.abs(cashGrowth).toFixed(1)}% reduction in cash over the forecast period. Consider risk mitigation strategies.`,
          [{ label: 'View Mitigation Options', onClick: () => console.log('View mitigation options clicked') }],
          true,
          8000
        ));
      } else {
        onAddNotification(createNotification(
          'success',
          'Scenario Applied Successfully',
          `Your custom scenario "${scenarioName}" has been calculated and applied.`,
          undefined,
          true,
          4000
        ));
      }
    }
  };
  
  const handleApplyFromLibrary = (parameters: any) => {
    setAdjustments(parameters);
    
    // Apply the scenario after setting the adjustments
    setTimeout(() => {
      applyCustomScenario();
      
      // Show notification
      if (onAddNotification) {
        onAddNotification(createNotification(
          'info',
          'Scenario Applied',
          'The scenario from the library has been applied. You can further customize it as needed.',
          undefined,
          true,
          4000
        ));
      }
    }, 0);
  };

  const resetCustomScenario = () => {
    setAdjustments({
      inflowAdjustment: 0,
      outflowAdjustment: 0,
      delayedPayments: 0,
      oneTimeExpense: 0,
      oneTimeExpenseDate: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
      oneTimeRevenue: 0,
      oneTimeRevenueDate: format(addDays(new Date(), 15), 'yyyy-MM-dd'),
    });
    setScenarioName('Custom Scenario');
    setLastSavedScenario(null);
  };
  
  const saveScenario = () => {
    setLastSavedScenario(scenarioName);
    
    // Show save form
    setShowSaveForm(false);
    
    // Show notification
    if (onAddNotification) {
      onAddNotification(createNotification(
        'success',
        'Scenario Saved',
        `Your scenario "${scenarioName}" has been saved to the library.`,
        undefined,
        true,
        4000
      ));
    }
  };

  const activeScenario = scenarios.find(s => s.isActive)?.data || forecastData;
  const baseScenario = scenarios.find(s => s.id === 'base')?.data || forecastData;
  
  if (!activeScenario) return <div className="p-4">Loading scenarios...</div>;

  const formattedData = activeScenario.dailyForecasts
    .filter((_: any, index: number) => index % 3 === 0) // Show every 3rd day to reduce chart clutter
    .slice(0, 30) // Show only next 30 days (90 days / 3)
    .map((forecast: any) => ({
      date: forecast.date,
      balance: forecast.balance,
      baseBalance: baseScenario.dailyForecasts.find((d: any) => d.date === forecast.date)?.balance || 0
    }));

  // Calculate difference between active scenario and base scenario at end of forecast
  const endOfPeriod = 29; // 30 days (0-indexed)
  const activeEndBalance = activeScenario.dailyForecasts[endOfPeriod].balance;
  const baseEndBalance = baseScenario.dailyForecasts[endOfPeriod].balance;
  const endBalanceDifference = activeEndBalance - baseEndBalance;
  const endBalancePercentage = ((endBalanceDifference / baseEndBalance) * 100).toFixed(1);
  
  // Detect potential risks in the scenario
  const lowestBalance = Math.min(...activeScenario.dailyForecasts.map((d: any) => d.balance));
  const startingBalance = activeScenario.dailyForecasts[0].balance;
  const hasLiquidityRisk = lowestBalance < startingBalance * 0.5;
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">What-If Scenario Planner</h2>
          <div className="flex space-x-3">
            <ScenarioLibrary onApplyScenario={handleApplyFromLibrary} industryType={historicalData?.industry?.toLowerCase() || 'manufacturing'} />
            
            <button
              onClick={onDownloadReport}
              className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
            >
              <Download size={16} className="mr-2" />
              Download Report
            </button>
          </div>
        </div>
        
        <p className="text-gray-600">
          Simulate different business scenarios to see how they might impact your future cash flow.
        </p>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Cash Balance Forecast Comparison</h3>
            <div className="flex space-x-2">
              {scenarios.map(scenario => (
                <button
                  key={scenario.id}
                  onClick={() => toggleScenario(scenario.id)}
                  className={`px-3 py-1 text-xs rounded-full ${
                    scenario.isActive 
                      ? `bg-${scenario.color} text-white` 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={{ backgroundColor: scenario.isActive ? scenario.color : '' }}
                  disabled={!scenario.data && scenario.id !== 'base'}
                >
                  {scenario.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="h-80">
            <InteractiveChart
              data={activeScenario.dailyForecasts}
              series={[
                { 
                  key: 'balance', 
                  name: scenarios.find(s => s.isActive)?.name || 'Cash Balance', 
                  type: 'line', 
                  color: scenarios.find(s => s.isActive)?.color || '#3b82f6' 
                },
                { 
                  key: 'baseBalance', 
                  name: 'Base Forecast', 
                  type: 'line', 
                  color: '#d1d5db',
                  opacity: 0.7
                }
              ]}
              height={320}
              allowZoom={true}
              allowTimeframeSelection={true}
              title={`${scenarios.find(s => s.isActive)?.name || 'Cash Balance'} vs Base Forecast`}
            />
          </div>
          
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Scenario Impact Summary</h4>
            <div className="flex items-center">
              <div 
                className={`mr-2 p-1 rounded-full ${
                  endBalanceDifference >= 0 ? 'bg-green-100' : 'bg-red-100'
                }`}
              >
                {endBalanceDifference >= 0 ? (
                  <ArrowUpRight size={16} className="text-green-600" />
                ) : (
                  <ArrowDownRight size={16} className="text-red-600" />
                )}
              </div>
              <span className="text-sm">
                This scenario results in a {endBalanceDifference >= 0 ? 'higher' : 'lower'} ending balance of{' '}
                <span className={endBalanceDifference >= 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                  {endBalanceDifference >= 0 ? '+' : '-'}${Math.abs(endBalanceDifference).toLocaleString()}
                </span>
                {' '}({endBalanceDifference >= 0 ? '+' : ''}{endBalancePercentage}%) compared to the base forecast.
              </span>
            </div>
            
            {hasLiquidityRisk && (
              <div className="mt-3 flex items-start">
                <AlertTriangle size={16} className="text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-yellow-700">
                  <span className="font-medium">Liquidity Risk Detected:</span> This scenario shows your cash balance dropping as low as ${lowestBalance.toLocaleString()}, which may create cash flow constraints. Consider preparing contingency measures.
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Scenario Parameters</h3>
            <div className="flex space-x-2">
              <button
                onClick={resetCustomScenario}
                className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm"
              >
                <RefreshCw size={14} className="mr-1" />
                Reset
              </button>
              
              {!showSaveForm && (
                <button
                  onClick={() => setShowSaveForm(true)}
                  className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm"
                  disabled={lastSavedScenario === scenarioName}
                >
                  <Save size={14} className="mr-1" />
                  {lastSavedScenario === scenarioName ? 'Saved' : 'Save Scenario'}
                </button>
              )}
            </div>
          </div>
          
          {showSaveForm && (
            <div className="mb-4 p-4 bg-indigo-50 rounded-lg">
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scenario Name
                </label>
                <input
                  type="text"
                  value={scenarioName}
                  onChange={(e) => setScenarioName(e.target.value)}
                  className="w-full border rounded p-2"
                  placeholder="Enter scenario name..."
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowSaveForm(false)}
                  className="px-3 py-1 border border-gray-300 rounded text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={saveScenario}
                  className="px-3 py-1 bg-indigo-600 text-white rounded text-sm"
                  disabled={!scenarioName.trim()}
                >
                  Save to Library
                </button>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Inflow Adjustment (%)
              </label>
              <div className="flex items-center">
                <input
                  type="range"
                  name="inflowAdjustment"
                  min="-50"
                  max="50"
                  value={adjustments.inflowAdjustment}
                  onChange={handleInputChange}
                  className="w-full"
                />
                <span className="ml-2 text-sm font-medium w-12 text-right">
                  {adjustments.inflowAdjustment > 0 ? '+' : ''}{adjustments.inflowAdjustment}%
                </span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Outflow Adjustment (%)
              </label>
              <div className="flex items-center">
                <input
                  type="range"
                  name="outflowAdjustment"
                  min="-50"
                  max="50"
                  value={adjustments.outflowAdjustment}
                  onChange={handleInputChange}
                  className="w-full"
                />
                <span className="ml-2 text-sm font-medium w-12 text-right">
                  {adjustments.outflowAdjustment > 0 ? '+' : ''}{adjustments.outflowAdjustment}%
                </span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Delays (days)
              </label>
              <div className="flex items-center">
                <input
                  type="range"
                  name="delayedPayments"
                  min="0"
                  max="30"
                  value={adjustments.delayedPayments}
                  onChange={handleInputChange}
                  className="w-full"
                />
                <span className="ml-2 text-sm font-medium w-12 text-right">
                  {adjustments.delayedPayments} days
                </span>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-medium text-sm mb-2">One-time Transactions</h4>
              
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  One-time Revenue
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    name="oneTimeRevenue"
                    value={adjustments.oneTimeRevenue}
                    onChange={handleInputChange}
                    placeholder="Amount"
                    className="border rounded p-2 text-sm"
                  />
                  <input
                    type="date"
                    name="oneTimeRevenueDate"
                    value={adjustments.oneTimeRevenueDate}
                    onChange={handleInputChange}
                    className="border rounded p-2 text-sm"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  One-time Expense
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    name="oneTimeExpense"
                    value={adjustments.oneTimeExpense}
                    onChange={handleInputChange}
                    placeholder="Amount"
                    className="border rounded p-2 text-sm"
                  />
                  <input
                    type="date"
                    name="oneTimeExpenseDate"
                    value={adjustments.oneTimeExpenseDate}
                    onChange={handleInputChange}
                    className="border rounded p-2 text-sm"
                  />
                </div>
              </div>
            </div>
            
            <button
              onClick={applyCustomScenario}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded mt-4 hover:bg-indigo-700 transition-colors flex items-center justify-center"
            >
              <TrendingUp size={16} className="mr-2" />
              Apply Custom Scenario
            </button>
          </div>
        </div>
      </div>
      
      <div className="lg:col-span-1">
        <div className="h-[780px]">
          <TabChatInterface
            agentName="Scenario Agent"
            agentNumber="Agent-04"
            agentDescription="I simulate different financial scenarios to help you understand potential outcomes."
            placeholderText="Ask about scenario planning..."
            suggestedQuestions={suggestedQuestions}
            historicalData={historicalData}
            forecastData={forecastData}
            view="scenarios"
          />
        </div>
      </div>
    </div>
  );
};

export default ScenarioPlanner;