import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Clock, Calendar, AlertTriangle, BarChart4 } from 'lucide-react';
import KpiCard from './KpiCard';
import CashFlowChart from './CashFlowChart';
import ForecastTable from './ForecastTable';
import AlertsList from './AlertsList';
import TabChatInterface from './TabChatInterface';
import InteractiveChart from './InteractiveChart';
import ComparisonView from './ComparisonView';
import DrilldownTable from './DrilldownTable';
import FeatureTooltip from './FeatureTooltip';

interface DashboardProps {
  historicalData: any;
  forecastData: any;
  alerts: any[];
}

const Dashboard: React.FC<DashboardProps> = ({ historicalData, forecastData, alerts }) => {
  // Calculate KPI values
  const currentCashPosition = forecastData.dailyForecasts[0].balance;
  const projectedPosition30Days = forecastData.dailyForecasts[29].balance;
  const cashFlowDelta = projectedPosition30Days - currentCashPosition;
  const burnRate = Math.abs(forecastData.monthlyForecasts.reduce((acc, month) => acc + month.outflows, 0) / 3);
  const dso = Math.round(forecastData.kpis.dso);
  const dpo = Math.round(forecastData.kpis.dpo);

  const suggestedQuestions = [
    "What's my cash position in 30 days?",
    "What's our burn rate?",
    "Show me the forecast details",
    "Are there any liquidity risks?"
  ];

  // Format daily data for interactive charts
  const formatDailyData = () => {
    // Combine historical and forecast data
    const historicalPoints = historicalData.dailyData.slice(-30);
    
    // Include the data source type for visualization
    return [
      ...historicalPoints.map((day: any) => ({
        ...day,
        dataType: 'historical'
      })),
      ...forecastData.dailyForecasts.slice(0, 60).map((day: any) => ({
        ...day,
        dataType: 'forecast'
      }))
    ];
  };

  // Format monthly data for table with nested transactions
  const formatMonthlyData = () => {
    return forecastData.monthlyForecasts.map((month: any, index: number) => {
      // Generate nested transaction data for each month
      const nestedTransactions = [];
      const transactionCount = 5 + Math.floor(Math.random() * 5); // 5-10 transactions
      
      for (let i = 0; i < transactionCount; i++) {
        const isInflow = Math.random() > 0.4;
        const amount = Math.round((isInflow ? month.inflows : month.outflows) * (0.05 + Math.random() * 0.15));
        
        nestedTransactions.push({
          id: `transaction-${index}-${i}`,
          date: new Date(2025, index, 1 + Math.floor(Math.random() * 28)).toISOString().split('T')[0],
          description: isInflow 
            ? ['Customer Payment', 'Subscription Revenue', 'Investment', 'Asset Sale', 'Loan Disbursement'][Math.floor(Math.random() * 5)]
            : ['Vendor Payment', 'Payroll', 'Rent', 'Utilities', 'Equipment Purchase', 'Marketing'][Math.floor(Math.random() * 6)],
          category: isInflow ? 'Income' : 'Expense',
          amount: isInflow ? amount : -amount,
          status: ['Confirmed', 'Pending', 'Confirmed', 'Confirmed', 'Scheduled'][Math.floor(Math.random() * 5)]
        });
      }
      
      // Sort transactions by date
      nestedTransactions.sort((a, b) => a.date.localeCompare(b.date));
      
      return {
        id: `month-${index}`,
        month: month.month,
        inflows: month.inflows,
        outflows: month.outflows,
        balance: month.balance,
        transactions: nestedTransactions,
        confidence: month.confidence
      };
    });
  };

  const dailyData = formatDailyData();
  const monthlyData = formatMonthlyData();

  // Create nested data for drilldown table
  const nestedDataConfig = {};
  monthlyData.forEach(month => {
    nestedDataConfig[month.id] = {
      key: month.id,
      data: month.transactions,
      columns: [
        { key: 'date', header: 'Date', formatter: (value) => new Date(value).toLocaleDateString() },
        { key: 'description', header: 'Description' },
        { key: 'category', header: 'Category' },
        { 
          key: 'amount', 
          header: 'Amount', 
          align: 'right',
          formatter: (value) => {
            const formatted = `$${Math.abs(value).toLocaleString()}`;
            return (
              <span className={value >= 0 ? 'text-green-600' : 'text-red-600'}>
                {value >= 0 ? '+' : '-'}{formatted}
              </span>
            );
          }
        },
        { 
          key: 'status', 
          header: 'Status',
          align: 'center',
          formatter: (value) => {
            const getStatusClass = () => {
              switch (value) {
                case 'Confirmed': return 'bg-green-100 text-green-800';
                case 'Pending': return 'bg-yellow-100 text-yellow-800';
                case 'Scheduled': return 'bg-blue-100 text-blue-800';
                default: return 'bg-gray-100 text-gray-800';
              }
            };
            
            return (
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusClass()}`}>
                {value}
              </span>
            );
          }
        }
      ]
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold text-gray-800">Financial Dashboard</h2>
        <div className="text-sm text-gray-500">
          <span>Industry: </span>
          <span className="font-medium">{forecastData.industry || 'Manufacturing'}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard 
              title="Current Cash Position" 
              value={`$${currentCashPosition.toLocaleString()}`} 
              icon={<DollarSign size={20} />} 
              color="bg-blue-500" 
            />
            <KpiCard 
              title="Projected in 30 Days" 
              value={`$${projectedPosition30Days.toLocaleString()}`} 
              icon={<Calendar size={20} />} 
              color={cashFlowDelta >= 0 ? "bg-green-500" : "bg-red-500"}
              change={cashFlowDelta}
            />
            <KpiCard 
              title="Days Sales Outstanding" 
              value={`${dso} days`} 
              icon={<Clock size={20} />} 
              color="bg-indigo-500" 
            />
            <KpiCard 
              title="Monthly Burn Rate" 
              value={`$${burnRate.toLocaleString()}`} 
              icon={<TrendingDown size={20} />} 
              color="bg-purple-500" 
            />
          </div>

          <div className="grid grid-cols-1 gap-4 mt-4">
            <FeatureTooltip
              id="interactive-chart"
              title="Interactive Chart"
              description="This enhanced chart allows you to compare historical and forecast data, zoom into specific periods, and toggle between different view modes."
              position="top"
            >
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Cash Flow Forecast (90 Days)</h3>
                <div id="cash-flow-chart-container">
                  <InteractiveChart
                    data={dailyData}
                    series={[
                      { key: 'balance', name: 'Cash Balance', type: 'line', color: '#3b82f6' },
                      { key: 'inflows', name: 'Inflows', type: 'bar', color: 'rgba(16, 185, 129, 0.7)', yAxis: 'right' },
                      { key: 'outflows', name: 'Outflows', type: 'bar', color: 'rgba(239, 68, 68, 0.7)', yAxis: 'right' }
                    ]}
                    height={300}
                    allowZoom={true}
                    allowTimeframeSelection={true}
                  />
                </div>
              </div>
            </FeatureTooltip>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FeatureTooltip
                id="comparison-view"
                title="Period Comparison"
                description="Compare your current financial performance against previous periods. Toggle between monthly, quarterly, or yearly comparisons."
                position="left"
              >
                <ComparisonView
                  currentData={dailyData.filter(d => d.dataType === 'forecast').slice(0, 30)}
                  valueKey="balance"
                  title="Cash Balance YoY Comparison"
                  showChange={true}
                />
              </FeatureTooltip>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Cash Flow Metrics</h3>
                <div className="space-y-4">
                  {/* Cash Conversion Cycle */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Cash Conversion Cycle</p>
                      <p className="text-lg font-medium">{dso + 30 - dpo} days</p>
                    </div>
                    <div 
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        dso + 30 - dpo < 45 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {dso + 30 - dpo < 45 ? 'Good' : 'Needs Improvement'}
                    </div>
                  </div>
                  
                  {/* Burn Rate Runway */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Runway (at current burn rate)</p>
                      <p className="text-lg font-medium">{Math.round(currentCashPosition / (burnRate / 30))} days</p>
                    </div>
                    <div 
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        currentCashPosition / (burnRate / 30) > 180 ? 'bg-green-100 text-green-800' : 
                        currentCashPosition / (burnRate / 30) > 90 ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}
                    >
                      {currentCashPosition / (burnRate / 30) > 180 ? 'Healthy' : 
                       currentCashPosition / (burnRate / 30) > 90 ? 'Moderate' : 'At Risk'}
                    </div>
                  </div>
                  
                  {/* Forecast Confidence */}
                  <div>
                    <p className="text-sm text-gray-600 mb-1">30-Day Forecast Confidence</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${forecastData.dailyForecasts[29].confidence}%` }}
                      ></div>
                    </div>
                    <p className="text-right text-xs text-gray-500 mt-1">{forecastData.dailyForecasts[29].confidence}%</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Monthly Forecast Breakdown</h3>
              <DrilldownTable
                data={monthlyData}
                columns={[
                  { key: 'month', header: 'Month' },
                  { 
                    key: 'inflows', 
                    header: 'Inflows', 
                    align: 'right',
                    formatter: (value) => <span className="text-green-600">${value.toLocaleString()}</span>
                  },
                  { 
                    key: 'outflows', 
                    header: 'Outflows', 
                    align: 'right',
                    formatter: (value) => <span className="text-red-600">${value.toLocaleString()}</span>
                  },
                  { 
                    key: 'balance', 
                    header: 'Ending Balance', 
                    align: 'right',
                    formatter: (value) => <span className="font-medium">${value.toLocaleString()}</span>
                  },
                  {
                    key: 'confidence',
                    header: 'Confidence',
                    align: 'center',
                    formatter: (value) => (
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${
                              value > 80 ? 'bg-green-500' : 
                              value > 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${value}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">{value}%</span>
                      </div>
                    )
                  }
                ]}
                nestedData={nestedDataConfig}
                title="Monthly Cash Flow Forecast"
                exportable={true}
                searchable={true}
                pagination={true}
              />
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-md font-semibold mb-2">Liquidity Alerts</h3>
            <AlertsList alerts={alerts} />
          </div>
          
          <div className="h-[400px]">
            <TabChatInterface
              agentName="Analysis Agent"
              agentNumber="Agent-02"
              agentDescription="I analyze your financial metrics and provide insights on your cash flow forecast."
              placeholderText="Ask about your financial metrics..."
              suggestedQuestions={suggestedQuestions}
              historicalData={historicalData}
              forecastData={forecastData}
              view="dashboard"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;