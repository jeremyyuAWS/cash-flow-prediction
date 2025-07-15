import React, { useState } from 'react';
import { format, parseISO, subDays } from 'date-fns';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
  Area
} from 'recharts';
import { TrendingUp, TrendingDown, Clock, DollarSign, CreditCard, ArrowRight, List, BarChart4, Activity } from 'lucide-react';
import TabChatInterface from './TabChatInterface';
import TransactionExplorer from './TransactionExplorer';
import FinancialMetricsWidget from './FinancialMetricsWidget';

interface AdvancedAnalyticsProps {
  forecastData: any;
  historicalData: any;
}

const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({ forecastData, historicalData }) => {
  const [timeframe, setTimeframe] = useState<'30' | '60' | '90'>('30');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'metrics'>('dashboard');
  
  // Calculate metrics
  const currentBalance = forecastData.dailyForecasts[0].balance;
  const daysData = parseInt(timeframe, 10);
  const endBalance = forecastData.dailyForecasts[daysData - 1].balance;
  const cashGrowth = ((endBalance - currentBalance) / currentBalance) * 100;
  
  // Calculate cash conversion cycle
  const dso = Math.round(forecastData.kpis.dso); // Days Sales Outstanding
  const dpo = Math.round(forecastData.kpis.dpo); // Days Payable Outstanding
  const dio = Math.round(30 + Math.random() * 10); // Days Inventory Outstanding (simulated)
  const ccc = dso + dio - dpo; // Cash Conversion Cycle
  
  // Calculate working capital
  const totalCurrentAssets = currentBalance * 1.3; // Simulated
  const totalCurrentLiabilities = currentBalance * 0.7; // Simulated
  const workingCapital = totalCurrentAssets - totalCurrentLiabilities;
  const workingCapitalRatio = totalCurrentAssets / totalCurrentLiabilities;
  
  // Calculate variance analysis (forecast vs actual)
  // For demo, we'll use random variance against forecast
  const getVarianceData = () => {
    return Array.from({ length: 12 }, (_, i) => {
      const month = new Date();
      month.setMonth(month.getMonth() - 11 + i);
      const monthName = format(month, 'MMM');
      const forecasted = Math.round(50000 + Math.random() * 20000);
      const actual = Math.round(forecasted * (0.85 + Math.random() * 0.3));
      const variance = ((actual - forecasted) / forecasted) * 100;
      
      return {
        month: monthName,
        forecasted,
        actual,
        variance
      };
    });
  };
  
  // Calculate inflow/outflow composition
  const getInflowCategories = () => {
    return [
      { name: 'Customer Payments', value: 65 },
      { name: 'Investments', value: 15 },
      { name: 'Loans', value: 10 },
      { name: 'Asset Sales', value: 5 },
      { name: 'Other', value: 5 }
    ];
  };
  
  const getOutflowCategories = () => {
    return [
      { name: 'Payroll', value: 45 },
      { name: 'Vendors', value: 25 },
      { name: 'Rent/Facilities', value: 12 },
      { name: 'Marketing', value: 8 },
      { name: 'Equipment', value: 6 },
      { name: 'Other', value: 4 }
    ];
  };
  
  // Prepare trend data
  const getTrendData = () => {
    // Combine historical and forecast data for trend analysis
    const historicalPoints = historicalData.dailyData.slice(-30).map((point: any) => ({
      date: point.date,
      balance: point.balance,
      isHistorical: true
    }));
    
    const forecastPoints = forecastData.dailyForecasts.slice(0, daysData).map((point: any) => ({
      date: point.date,
      balance: point.balance,
      isHistorical: false
    }));
    
    return [...historicalPoints, ...forecastPoints];
  };
  
  // Seasonality analysis
  const getSeasonalityData = () => {
    // Use historical data to identify seasonal patterns
    const monthlyData: Record<string, { inflows: number[], outflows: number[] }> = {};
    
    historicalData.dailyData.forEach((day: any) => {
      const date = new Date(day.date);
      const monthKey = format(date, 'MMM');
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { inflows: [], outflows: [] };
      }
      
      monthlyData[monthKey].inflows.push(day.inflows);
      monthlyData[monthKey].outflows.push(day.outflows);
    });
    
    // Calculate average inflows and outflows per month
    return Object.entries(monthlyData).map(([month, data]) => {
      const avgInflows = data.inflows.reduce((sum, val) => sum + val, 0) / data.inflows.length;
      const avgOutflows = data.outflows.reduce((sum, val) => sum + val, 0) / data.outflows.length;
      
      return {
        month,
        avgInflows: Math.round(avgInflows),
        avgOutflows: Math.round(avgOutflows),
        netCashFlow: Math.round(avgInflows - avgOutflows)
      };
    });
  };
  
  const suggestedQuestions = [
    "What's our cash conversion cycle?",
    "Analyze our working capital",
    "Show me seasonality patterns",
    "How can we optimize cash flow?",
  ];
  
  const varianceData = getVarianceData();
  const inflowCategories = getInflowCategories();
  const outflowCategories = getOutflowCategories();
  const trendData = getTrendData();
  const seasonalityData = getSeasonalityData();
  
  // Colors for charts
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Advanced Financial Analytics</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-2 flex items-center rounded text-sm ${
              activeTab === 'dashboard' 
                ? 'bg-indigo-100 text-indigo-700' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <BarChart4 size={16} className="mr-1" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-3 py-2 flex items-center rounded text-sm ${
              activeTab === 'transactions' 
                ? 'bg-indigo-100 text-indigo-700' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <List size={16} className="mr-1" />
            Transactions
          </button>
          <button
            onClick={() => setActiveTab('metrics')}
            className={`px-3 py-2 flex items-center rounded text-sm ${
              activeTab === 'metrics' 
                ? 'bg-indigo-100 text-indigo-700' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Activity size={16} className="mr-1" />
            Metrics
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          {activeTab === 'dashboard' && (
            <>
              {/* Working Capital & Cash Cycle Analysis */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Cash Conversion Cycle</h3>
                  <div className="flex justify-center mb-6">
                    <div className="text-center w-1/3">
                      <div className="text-2xl font-bold text-indigo-600">{dso}</div>
                      <div className="text-sm text-gray-500">Days Sales Outstanding</div>
                    </div>
                    <div className="text-center w-1/3">
                      <div className="text-2xl font-bold text-yellow-500">{dio}</div>
                      <div className="text-sm text-gray-500">Days Inventory Outstanding</div>
                    </div>
                    <div className="text-center w-1/3">
                      <div className="text-2xl font-bold text-green-500">{dpo}</div>
                      <div className="text-sm text-gray-500">Days Payable Outstanding</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="relative h-12 w-full mx-12">
                      <div className="absolute inset-0 flex items-center">
                        <div className="h-1 w-full bg-gray-200 rounded"></div>
                      </div>
                      <div className="relative flex justify-between">
                        <div className="bg-indigo-600 h-12 w-12 rounded-full border-4 border-white flex items-center justify-center">
                          <span className="text-xs text-white">{dso}d</span>
                        </div>
                        <div className="bg-yellow-500 h-12 w-12 rounded-full border-4 border-white flex items-center justify-center">
                          <span className="text-xs text-white">{dio}d</span>
                        </div>
                        <div className="bg-green-500 h-12 w-12 rounded-full border-4 border-white flex items-center justify-center">
                          <span className="text-xs text-white">{dpo}d</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-indigo-50 rounded-lg flex items-center">
                    <Clock className="text-indigo-500 mr-3" size={24} />
                    <div>
                      <div className="font-bold text-lg">{ccc} Days</div>
                      <div className="text-sm text-gray-600">Cash Conversion Cycle</div>
                    </div>
                    <div className="ml-auto text-sm">
                      <div className={`font-medium ${ccc < 45 ? 'text-green-600' : 'text-red-600'}`}>
                        {ccc < 45 ? 'Good' : 'Needs Improvement'}
                      </div>
                      <div className="text-gray-500">
                        {ccc < 45 ? 'Better than industry average' : 'Industry avg: 45 days'}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Working Capital Analysis</h3>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="text-sm text-gray-500">Working Capital</div>
                      <div className="text-xl font-bold">${workingCapital.toLocaleString()}</div>
                      <div className="text-xs text-gray-500 mt-1">Current Assets - Current Liabilities</div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="text-sm text-gray-500">Working Capital Ratio</div>
                      <div className="text-xl font-bold">{workingCapitalRatio.toFixed(2)}</div>
                      <div className="text-xs text-gray-500 mt-1">Current Assets / Current Liabilities</div>
                    </div>
                  </div>
                  <h4 className="font-medium text-sm mb-3 text-gray-600">Working Capital Breakdown</h4>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: 'Current Assets', value: totalCurrentAssets },
                          { name: 'Current Liabilities', value: totalCurrentLiabilities },
                          { name: 'Working Capital', value: workingCapital }
                        ]}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                        <XAxis dataKey="name" axisLine={false} />
                        <YAxis 
                          axisLine={false} 
                          tickFormatter={(value) => `$${value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`} 
                        />
                        <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                        <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              
              {/* Cash Flow Trend Analysis & Variance Analysis */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Cash Flow Trend Analysis</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart 
                        data={trendData} 
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(date) => format(parseISO(date), 'MM/dd')}
                          axisLine={false}
                        />
                        <YAxis 
                          axisLine={false}
                          tickFormatter={(value) => `$${value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`}
                        />
                        <Tooltip 
                          formatter={(value: any) => [`$${value.toLocaleString()}`, 'Balance']}
                          labelFormatter={(label) => format(parseISO(label), 'MMM dd, yyyy')}
                        />
                        <Legend />
                        <defs>
                          <linearGradient id="colorHistorical" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Area 
                          type="monotone" 
                          dataKey="balance" 
                          stroke="#6366f1" 
                          fillOpacity={1}
                          fill="url(#colorHistorical)"
                          name="Historical"
                          activeDot={{ r: 6 }}
                          dot={false}
                          connectNulls
                          strokeWidth={2}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="balance" 
                          stroke="#10b981" 
                          strokeWidth={2}
                          name="Forecast"
                          activeDot={{ r: 6 }}
                          dot={false}
                          connectNulls
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-between mt-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-500">Start Balance</div>
                      <div className="font-medium">${currentBalance.toLocaleString()}</div>
                    </div>
                    <div className="flex items-center">
                      <ArrowRight className="text-gray-400 mx-2" size={18} />
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500">End Balance</div>
                      <div className="font-medium">${endBalance.toLocaleString()}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500">Growth</div>
                      <div className={`font-medium ${cashGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {cashGrowth >= 0 ? '+' : ''}{cashGrowth.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Variance Analysis</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart
                        data={varianceData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="month" axisLine={false} />
                        <YAxis 
                          yAxisId="left" 
                          orientation="left" 
                          axisLine={false}
                          tickFormatter={(value) => `$${value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`}
                        />
                        <YAxis 
                          yAxisId="right" 
                          orientation="right" 
                          domain={[-30, 30]}
                          axisLine={false}
                          tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="forecasted" name="Forecasted" fill="#8884d8" barSize={10} />
                        <Bar yAxisId="left" dataKey="actual" name="Actual" fill="#82ca9d" barSize={10} />
                        <Line 
                          yAxisId="right" 
                          type="monotone" 
                          dataKey="variance" 
                          name="Variance %" 
                          stroke="#ff7300"
                          strokeWidth={2}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm">
                    <p className="font-medium mb-1">Variance Analysis Insights:</p>
                    <p className="text-gray-600">
                      Historical forecast accuracy averages {Math.round(85 + Math.random() * 8)}%. 
                      The largest variances were observed in Q4, possibly due to seasonal factors not fully 
                      accounted for in the forecast model.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Cash Flow Composition & Seasonality */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Cash Flow Composition</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-2">Inflow Categories</h4>
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={inflowCategories}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={60}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {inflowCategories.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-2">Outflow Categories</h4>
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={outflowCategories}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={60}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {outflowCategories.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm">
                    <p className="font-medium mb-1">Cash Flow Composition Analysis:</p>
                    <p className="text-gray-600">
                      Payroll represents the largest expense category at 45% of outflows, while customer 
                      payments make up 65% of inflows. Diversifying revenue sources could help reduce risk.
                    </p>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Seasonality Analysis</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart
                        data={seasonalityData}
                        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="month" axisLine={false} />
                        <YAxis 
                          axisLine={false}
                          tickFormatter={(value) => `$${value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`}
                        />
                        <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                        <Legend />
                        <Bar dataKey="avgInflows" name="Avg Inflows" fill="#4ade80" barSize={8} />
                        <Bar dataKey="avgOutflows" name="Avg Outflows" fill="#f87171" barSize={8} />
                        <Line type="monotone" dataKey="netCashFlow" name="Net Cash Flow" stroke="#6366f1" strokeWidth={2} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm">
                    <p className="font-medium mb-1">Seasonality Insights:</p>
                    <p className="text-gray-600">
                      Clear seasonal patterns are visible with higher inflows in Q4 and early Q1, while outflows 
                      peak before these high-revenue periods. Planning for these cyclical patterns can improve liquidity management.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Optimization Recommendations */}
              <div className="bg-white rounded-lg shadow p-6 mt-6">
                <h3 className="text-lg font-semibold mb-4">Working Capital Optimization Recommendations</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-start mb-2">
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <TrendingDown size={18} className="text-blue-600" />
                      </div>
                      <h4 className="font-medium">Accounts Receivable</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Your DSO of {dso} days is {dso > 30 ? 'above' : 'below'} industry average (30 days).
                    </p>
                    {dso > 30 ? (
                      <div className="mt-2 text-sm">
                        <p className="font-medium text-blue-700">Recommendations:</p>
                        <ul className="list-disc ml-4 text-gray-600 mt-1 space-y-1">
                          <li>Offer early payment discounts</li>
                          <li>Implement stricter credit policies</li>
                          <li>Automate invoice reminders</li>
                        </ul>
                      </div>
                    ) : (
                      <p className="text-sm text-green-600 font-medium">
                        Your receivables management is effective.
                      </p>
                    )}
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex items-start mb-2">
                      <div className="bg-purple-100 p-2 rounded-full mr-3">
                        <DollarSign size={18} className="text-purple-600" />
                      </div>
                      <h4 className="font-medium">Accounts Payable</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Your DPO of {dpo} days is {dpo < 45 ? 'below' : 'above'} industry average (45 days).
                    </p>
                    {dpo < 45 ? (
                      <div className="mt-2 text-sm">
                        <p className="font-medium text-purple-700">Recommendations:</p>
                        <ul className="list-disc ml-4 text-gray-600 mt-1 space-y-1">
                          <li>Negotiate longer payment terms</li>
                          <li>Optimize payment timing</li>
                          <li>Centralize vendor management</li>
                        </ul>
                      </div>
                    ) : (
                      <p className="text-sm text-green-600 font-medium">
                        Your payables management is effective.
                      </p>
                    )}
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex items-start mb-2">
                      <div className="bg-green-100 p-2 rounded-full mr-3">
                        <CreditCard size={18} className="text-green-600" />
                      </div>
                      <h4 className="font-medium">Liquidity Management</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Your working capital ratio of {workingCapitalRatio.toFixed(2)} is {workingCapitalRatio < 2 ? 'below' : 'above'} the ideal range (2.0).
                    </p>
                    {workingCapitalRatio < 1.5 ? (
                      <div className="mt-2 text-sm">
                        <p className="font-medium text-green-700">Recommendations:</p>
                        <ul className="list-disc ml-4 text-gray-600 mt-1 space-y-1">
                          <li>Increase cash reserves</li>
                          <li>Secure line of credit</li>
                          <li>Reduce short-term debt</li>
                        </ul>
                      </div>
                    ) : workingCapitalRatio > 2.5 ? (
                      <div className="mt-2 text-sm">
                        <p className="font-medium text-blue-700">Recommendations:</p>
                        <ul className="list-disc ml-4 text-gray-600 mt-1 space-y-1">
                          <li>Consider investments</li>
                          <li>Review cash deployment</li>
                          <li>Assess growth opportunities</li>
                        </ul>
                      </div>
                    ) : (
                      <p className="text-sm text-green-600 font-medium">
                        Your liquidity position is balanced.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
          
          {activeTab === 'transactions' && (
            <TransactionExplorer 
              historicalData={historicalData}
              forecastData={forecastData}
            />
          )}
          
          {activeTab === 'metrics' && (
            <FinancialMetricsWidget
              historicalData={historicalData}
              forecastData={forecastData}
            />
          )}
        </div>
        
        <div className="lg:col-span-1">
          <div className="h-[780px]">
            <TabChatInterface
              agentName="Insights Agent"
              agentNumber="Agent-03"
              agentDescription="I provide deep financial analysis and pattern recognition to help you optimize your working capital."
              placeholderText="Ask about patterns or trends..."
              suggestedQuestions={suggestedQuestions}
              historicalData={historicalData}
              forecastData={forecastData}
              view="analytics"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;