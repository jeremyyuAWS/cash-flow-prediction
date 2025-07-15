import React, { useState } from 'react';
import { format, parseISO, subDays, subMonths, subYears } from 'date-fns';
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
  Area,
} from 'recharts';
import { ArrowUp, ArrowDown, Calendar } from 'lucide-react';

interface ComparisonViewProps {
  currentData: any[];
  compareType?: 'year' | 'month' | 'quarter';
  dateKey?: string;
  valueKey: string;
  secondaryValueKey?: string;
  title?: string;
  height?: number;
  showChange?: boolean;
  formatValue?: (value: number) => string;
  formatSecondaryValue?: (value: number) => string;
}

const ComparisonView: React.FC<ComparisonViewProps> = ({
  currentData,
  compareType = 'year',
  dateKey = 'date',
  valueKey,
  secondaryValueKey,
  title,
  height = 300,
  showChange = true,
  formatValue = (value) => `$${value.toLocaleString()}`,
  formatSecondaryValue = (value) => `$${value.toLocaleString()}`,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'year' | 'month' | 'quarter'>(compareType);
  
  // Create comparison data
  const getComparisonData = () => {
    // For each current data point, find the equivalent from previous period
    return currentData.map(dataPoint => {
      const currentDate = parseISO(dataPoint[dateKey]);
      
      // Calculate previous period date
      let previousDate;
      if (selectedPeriod === 'year') {
        previousDate = subYears(currentDate, 1);
      } else if (selectedPeriod === 'quarter') {
        previousDate = subMonths(currentDate, 3);
      } else {
        previousDate = subMonths(currentDate, 1);
      }
      
      // Format dates for display
      const currentFormattedDate = format(currentDate, 'MMM dd');
      const previousFormattedDate = format(previousDate, 'MMM dd');
      
      // Create comparison data point
      return {
        // Original values
        [dateKey]: dataPoint[dateKey],
        [valueKey]: dataPoint[valueKey],
        ...(secondaryValueKey && { [secondaryValueKey]: dataPoint[secondaryValueKey] }),
        
        // Previous period values (simulated by applying random factor)
        [`previous${valueKey}`]: Math.round(dataPoint[valueKey] * (0.7 + Math.random() * 0.6)),
        ...(secondaryValueKey && { 
          [`previous${secondaryValueKey}`]: Math.round(dataPoint[secondaryValueKey] * (0.7 + Math.random() * 0.6)) 
        }),
        
        // Display dates for tooltip
        displayDate: currentFormattedDate,
        previousDisplayDate: previousFormattedDate,
      };
    });
  };
  
  const comparisonData = getComparisonData();
  
  // Calculate overall change
  const calculateChange = () => {
    // Sum the values for current and previous periods
    const currentSum = comparisonData.reduce((sum, item) => sum + item[valueKey], 0);
    const previousSum = comparisonData.reduce((sum, item) => sum + item[`previous${valueKey}`], 0);
    
    // Calculate percentage change
    const change = ((currentSum - previousSum) / previousSum) * 100;
    
    return {
      currentSum,
      previousSum,
      change,
      isPositive: change >= 0
    };
  };
  
  const { currentSum, previousSum, change, isPositive } = showChange ? calculateChange() : { currentSum: 0, previousSum: 0, change: 0, isPositive: true };
  
  // Custom tooltip formatter
  const renderTooltip = (props: any) => {
    const { active, payload, label } = props;
    
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-md rounded">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium">{data.displayDate}</h4>
              <p className="text-xs text-gray-500">Current Period</p>
              
              <div className="mt-2">
                <p className="text-sm">
                  <span className="font-medium">{payload[0].name}: </span>
                  {formatValue(payload[0].value)}
                </p>
                
                {secondaryValueKey && payload.length > 2 && (
                  <p className="text-sm">
                    <span className="font-medium">{payload[2].name}: </span>
                    {formatSecondaryValue(payload[2].value)}
                  </p>
                )}
              </div>
            </div>
            
            <div className="border-l pl-4">
              <h4 className="text-sm font-medium">{data.previousDisplayDate}</h4>
              <p className="text-xs text-gray-500">Previous {selectedPeriod}</p>
              
              <div className="mt-2">
                <p className="text-sm">
                  <span className="font-medium">{payload[1].name}: </span>
                  {formatValue(payload[1].value)}
                </p>
                
                {secondaryValueKey && payload.length > 3 && (
                  <p className="text-sm">
                    <span className="font-medium">{payload[3].name}: </span>
                    {formatSecondaryValue(payload[3].value)}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {/* Change */}
          <div className="mt-3 pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-600">
              Change: 
              <span className={isPositive ? 'text-green-600 ml-1' : 'text-red-600 ml-1'}>
                {((data[valueKey] - data[`previous${valueKey}`]) / data[`previous${valueKey}`] * 100).toFixed(1)}%
              </span>
            </p>
          </div>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          {title && <h3 className="text-sm font-medium text-gray-700">{title}</h3>}
          
          {showChange && (
            <div className="mt-1 flex items-center">
              <div className={`text-lg font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? '+' : ''}{change.toFixed(1)}%
              </div>
              
              <div className="ml-2 flex items-center">
                {isPositive ? (
                  <ArrowUp size={14} className="text-green-600" />
                ) : (
                  <ArrowDown size={14} className="text-red-600" />
                )}
                <span className="text-xs text-gray-500 ml-1">vs previous {selectedPeriod}</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setSelectedPeriod('month')}
            className={`px-2 py-1 text-xs rounded ${selectedPeriod === 'month' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}
          >
            Month
          </button>
          <button
            onClick={() => setSelectedPeriod('quarter')}
            className={`px-2 py-1 text-xs rounded ${selectedPeriod === 'quarter' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}
          >
            Quarter
          </button>
          <button
            onClick={() => setSelectedPeriod('year')}
            className={`px-2 py-1 text-xs rounded ${selectedPeriod === 'year' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}
          >
            Year
          </button>
        </div>
      </div>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={comparisonData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
            
            <XAxis 
              dataKey={dateKey} 
              tickFormatter={(date) => format(parseISO(date), 'MM/dd')}
              axisLine={false}
            />
            
            <YAxis 
              tickFormatter={(value) => `$${value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`}
              axisLine={false}
            />
            
            <Tooltip content={renderTooltip} />
            
            <Legend 
              verticalAlign="top" 
              height={36}
              formatter={(value, entry, index) => {
                if (value.startsWith('previous')) {
                  return `Previous ${selectedPeriod} ${secondaryValueKey ? (entry.dataKey === `previous${secondaryValueKey}` ? secondaryValueKey : valueKey) : valueKey}`;
                }
                return value;
              }}
            />
            
            {/* Current period */}
            <Line 
              type="monotone" 
              dataKey={valueKey} 
              name={valueKey} 
              stroke="#3b82f6" 
              strokeWidth={2}
              activeDot={{ r: 6, stroke: 'white', strokeWidth: 2 }}
            />
            
            {secondaryValueKey && (
              <Bar 
                dataKey={secondaryValueKey} 
                name={secondaryValueKey} 
                fill="#10b981" 
                opacity={0.7}
                barSize={8}
              />
            )}
            
            {/* Previous period */}
            <Line 
              type="monotone" 
              dataKey={`previous${valueKey}`} 
              name={`previous${valueKey}`} 
              stroke="#3b82f6" 
              strokeWidth={1.5}
              strokeDasharray="4 4"
              opacity={0.6}
              dot={false}
            />
            
            {secondaryValueKey && (
              <Bar 
                dataKey={`previous${secondaryValueKey}`} 
                name={`previous${secondaryValueKey}`} 
                fill="#10b981" 
                opacity={0.3}
                barSize={8}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      
      {showChange && (
        <div className="flex space-x-6 mt-4 pt-3 border-t border-gray-200">
          <div>
            <p className="text-xs text-gray-500">Current Period Total</p>
            <p className="text-sm font-medium">{formatValue(currentSum)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Previous {selectedPeriod}</p>
            <p className="text-sm font-medium">{formatValue(previousSum)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Absolute Change</p>
            <p className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}{formatValue(currentSum - previousSum)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparisonView;