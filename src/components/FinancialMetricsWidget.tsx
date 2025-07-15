import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, ArrowUp, ArrowDown, Zap, Info } from 'lucide-react';
import InteractiveChart from './InteractiveChart';
import { format, parseISO, subDays } from 'date-fns';

interface FinancialMetricsWidgetProps {
  historicalData: any;
  forecastData: any;
}

const FinancialMetricsWidget: React.FC<FinancialMetricsWidgetProps> = ({
  historicalData,
  forecastData
}) => {
  const [timeframe, setTimeframe] = useState<'30' | '60' | '90'>('30');
  const [selectedMetric, setSelectedMetric] = useState<'dso' | 'dpo' | 'ccc' | 'cashRatio' | 'burnRate'>('dso');
  
  // Prepare metrics data from historical/forecast data
  const [metricsData, setMetricsData] = useState<any[]>([]);
  
  useEffect(() => {
    if (!historicalData || !forecastData) return;
    
    // Combine historical and forecast data
    const allData = [
      ...historicalData.dailyData.map((d: any) => ({ ...d, type: 'historical' })),
      ...forecastData.dailyForecasts.map((d: any) => ({ ...d, type: 'forecast' }))
    ];
    
    // Sort by date
    allData.sort((a: any, b: any) => a.date.localeCompare(b.date));
    
    // Calculate metrics for each week
    const weeklyMetrics: any[] = [];
    
    // Process in 7-day chunks to calculate weekly metrics
    for (let i = 0; i < allData.length; i += 7) {
      const weekData = allData.slice(i, Math.min(i + 7, allData.length));
      if (weekData.length < 3) continue; // Skip if not enough days in the week
      
      const lastDay = weekData[weekData.length - 1];
      const date = lastDay.date;
      
      // Calculate DSO (Days Sales Outstanding)
      // For demo purposes, we'll simulate this as a calculated metric
      // In real world, this would be calculated from actual AR and revenue data
      const baseDSO = historicalData.kpis?.dso || 30;
      
      // Add some variability to simulate real metric fluctuation
      const randomVariation = (Math.random() * 2 - 1) * 5; // +/- 5 days
      const dsoValue = baseDSO + randomVariation;
      
      // Calculate DPO (Days Payable Outstanding)
      const baseDPO = historicalData.kpis?.dpo || 30;
      const dpoValue = baseDPO + (Math.random() * 2 - 1) * 4; // +/- 4 days
      
      // Cash Conversion Cycle (CCC) = DSO + DIO - DPO
      // For simplicity, assuming DIO (Days Inventory Outstanding) is 30
      const dio = 30 + (Math.random() * 2 - 1) * 3; // 30 days +/- 3 days
      const cccValue = dsoValue + dio - dpoValue;
      
      // Calculate Cash Ratio
      // Cash Ratio = Cash / Current Liabilities
      // Simulating current liabilities as 30% more than current outflows
      const weeklyOutflows = weekData.reduce((sum: number, day: any) => sum + day.outflows, 0);
      const simulatedLiabilities = weeklyOutflows * 4; // Monthly liabilities estimate
      const cashRatio = lastDay.balance / simulatedLiabilities;
      
      // Calculate burn rate (average daily outflow)
      const burnRate = weekData.reduce((sum: number, day: any) => sum + day.outflows, 0) / weekData.length;
      
      weeklyMetrics.push({
        date,
        dso: dsoValue,
        dpo: dpoValue,
        ccc: cccValue,
        cashRatio: cashRatio,
        burnRate: burnRate,
        type: lastDay.type
      });
    }
    
    setMetricsData(weeklyMetrics);
  }, [historicalData, forecastData]);
  
  // Filter data based on selected timeframe
  const filteredData = React.useMemo(() => {
    const numDays = parseInt(timeframe, 10);
    const startDate = format(subDays(new Date(), numDays), 'yyyy-MM-dd');
    return metricsData.filter((d: any) => d.date >= startDate);
  }, [metricsData, timeframe]);
  
  // Get the current value of the selected metric
  const currentValue = React.useMemo(() => {
    if (filteredData.length === 0) return null;
    
    // Latest value
    return filteredData[filteredData.length - 1][selectedMetric];
  }, [filteredData, selectedMetric]);
  
  // Calculate change percentage
  const changePercentage = React.useMemo(() => {
    if (filteredData.length < 2) return null;
    
    const oldestValue = filteredData[0][selectedMetric];
    const latestValue = filteredData[filteredData.length - 1][selectedMetric];
    
    return ((latestValue - oldestValue) / oldestValue) * 100;
  }, [filteredData, selectedMetric]);
  
  // Format the current value based on metric type
  const formattedValue = React.useMemo(() => {
    if (currentValue === null) return '-';
    
    switch (selectedMetric) {
      case 'dso':
      case 'dpo':
      case 'ccc':
        return `${Math.round(currentValue)} days`;
      case 'cashRatio':
        return currentValue.toFixed(2);
      case 'burnRate':
        return `$${Math.round(currentValue).toLocaleString()}/day`;
      default:
        return currentValue.toString();
    }
  }, [currentValue, selectedMetric]);
  
  const metricConfig = {
    dso: {
      title: 'Days Sales Outstanding',
      icon: <Clock size={20} />,
      description: 'Average number of days to collect payment after a sale',
      goodDirection: 'down',
      color: '#8b5cf6', // Purple
      benchmark: 30
    },
    dpo: {
      title: 'Days Payable Outstanding',
      icon: <Clock size={20} />,
      description: 'Average number of days to pay vendors after receiving an invoice',
      goodDirection: 'up',
      color: '#3b82f6', // Blue
      benchmark: 45
    },
    ccc: {
      title: 'Cash Conversion Cycle',
      icon: <RefreshCw size={20} />,
      description: 'Number of days it takes to convert investments into cash flows',
      goodDirection: 'down',
      color: '#10b981', // Green
      benchmark: 30
    },
    cashRatio: {
      title: 'Cash Ratio',
      icon: <DollarSign size={20} />,
      description: 'Ratio of cash to current liabilities',
      goodDirection: 'up',
      color: '#f59e0b', // Amber
      benchmark: 1.0
    },
    burnRate: {
      title: 'Burn Rate',
      icon: <Flame size={20} />,
      description: 'Average daily cash outflow',
      goodDirection: 'down',
      color: '#ef4444', // Red
      benchmark: null
    }
  };
  
  const selectedMetricConfig = metricConfig[selectedMetric];
  
  // Format the chart label for the metric
  const getMetricLabel = () => {
    switch (selectedMetric) {
      case 'dso':
        return 'Days Sales Outstanding';
      case 'dpo':
        return 'Days Payable Outstanding';
      case 'ccc':
        return 'Cash Conversion Cycle';
      case 'cashRatio':
        return 'Cash Ratio';
      case 'burnRate':
        return 'Daily Burn Rate';
      default:
        return selectedMetric;
    }
  };
  
  // Determine if the current trend is positive or negative based on the metric
  const isDeltaPositive = React.useMemo(() => {
    if (changePercentage === null) return null;
    
    return selectedMetricConfig.goodDirection === 'down' 
      ? changePercentage < 0 
      : changePercentage > 0;
  }, [changePercentage, selectedMetricConfig]);
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-md font-semibold flex items-center">
          <Activity size={18} className="mr-1" />
          Financial Metrics
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeframe('30')}
            className={`px-2 py-1 text-xs rounded ${
              timeframe === '30' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'
            }`}
          >
            30D
          </button>
          <button
            onClick={() => setTimeframe('60')}
            className={`px-2 py-1 text-xs rounded ${
              timeframe === '60' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'
            }`}
          >
            60D
          </button>
          <button
            onClick={() => setTimeframe('90')}
            className={`px-2 py-1 text-xs rounded ${
              timeframe === '90' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'
            }`}
          >
            90D
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-4">
        {Object.entries(metricConfig).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setSelectedMetric(key as any)}
            className={`p-2 rounded-lg text-left ${
              selectedMetric === key 
                ? 'bg-indigo-100 border border-indigo-200' 
                : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
            }`}
          >
            <div className="text-xs font-medium text-gray-500">{config.title}</div>
            {filteredData.length > 0 && (
              <div className="mt-1 font-medium">
                {key === 'burnRate' 
                  ? `$${Math.round(filteredData[filteredData.length - 1][key]).toLocaleString()}`
                  : key === 'cashRatio'
                    ? filteredData[filteredData.length - 1][key].toFixed(2)
                    : `${Math.round(filteredData[filteredData.length - 1][key])} days`
                }
              </div>
            )}
          </button>
        ))}
      </div>
      
      <div className="p-4 border rounded-lg mb-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h4 className="font-medium text-gray-800">{selectedMetricConfig.title}</h4>
            <div className="flex items-center mt-1">
              <div className="text-2xl font-bold">{formattedValue}</div>
              {changePercentage !== null && (
                <div className={`ml-2 flex items-center text-sm ${
                  isDeltaPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {isDeltaPositive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                  {Math.abs(changePercentage).toFixed(1)}%
                </div>
              )}
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-xs text-gray-500">Benchmark</div>
            <div className="font-medium">
              {selectedMetricConfig.benchmark 
                ? (selectedMetric === 'cashRatio' 
                    ? selectedMetricConfig.benchmark.toFixed(2) 
                    : `${selectedMetricConfig.benchmark} days`)
                : 'N/A'
              }
            </div>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-3">{selectedMetricConfig.description}</p>
        
        <div className="h-48">
          <InteractiveChart
            data={filteredData}
            series={[
              { key: selectedMetric, name: getMetricLabel(), type: 'line', color: selectedMetricConfig.color },
            ]}
            height={192}
            allowZoom={true}
          />
        </div>
      </div>
      
      <div className="bg-indigo-50 p-3 rounded-lg text-sm">
        <div className="flex items-start">
          <Info size={16} className="text-indigo-600 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-indigo-800">
              {selectedMetric === 'dso' && (
                "Your DSO is slightly above industry average. Consider implementing early payment incentives to improve cash flow."
              )}
              {selectedMetric === 'dpo' && (
                "Your DPO is below industry average. You may have an opportunity to negotiate longer payment terms with vendors."
              )}
              {selectedMetric === 'ccc' && (
                "Your Cash Conversion Cycle indicates how long it takes to turn investments into cash. A shorter cycle generally indicates better cash flow efficiency."
              )}
              {selectedMetric === 'cashRatio' && (
                "Your Cash Ratio is healthy, indicating good short-term liquidity. This ratio shows your ability to cover short-term liabilities with available cash."
              )}
              {selectedMetric === 'burnRate' && (
                "Your current Burn Rate gives you approximately 160 days of runway based on your cash reserves. Consider ways to reduce non-essential expenses if this needs improvement."
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Clock = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const RefreshCw = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 2v6h-6" />
    <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
    <path d="M3 22v-6h6" />
    <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
  </svg>
);

const DollarSign = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="12" y1="2" x2="12" y2="22" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const Flame = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
);

export default FinancialMetricsWidget;