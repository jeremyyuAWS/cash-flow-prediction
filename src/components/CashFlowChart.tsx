import React from 'react';
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
  ReferenceLine
} from 'recharts';
import { format, parseISO } from 'date-fns';

interface CashFlowChartProps {
  forecastData: any;
}

// Custom tooltip component that shows all values
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 shadow-md rounded-md">
        <p className="font-medium text-sm">{format(parseISO(label), 'MMM dd, yyyy')}</p>
        <div className="mt-2">
          <p className="text-sm text-blue-600">
            <span className="font-medium">Balance:</span> ${payload[0].value.toLocaleString()}
          </p>
          <p className="text-sm text-green-600">
            <span className="font-medium">Inflows:</span> ${payload[1].value.toLocaleString()}
          </p>
          <p className="text-sm text-red-600">
            <span className="font-medium">Outflows:</span> ${payload[2].value.toLocaleString()}
          </p>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Prediction confidence: {payload[0].payload.confidence}%
        </p>
      </div>
    );
  }
  return null;
};

const CashFlowChart: React.FC<CashFlowChartProps> = ({ forecastData }) => {
  const formattedData = forecastData.dailyForecasts.map((forecast: any) => ({
    date: forecast.date,
    balance: forecast.balance,
    inflows: forecast.inflows,
    outflows: forecast.outflows,
    confidence: forecast.confidence
  }));

  // Find minimum balance to set threshold line
  const minSafeBalance = Math.min(...forecastData.dailyForecasts.map((d: any) => d.balance)) * 0.8;

  // Identify low balance dates (less than 15% above minimum)
  const riskDates = forecastData.dailyForecasts
    .filter((d: any) => d.balance < minSafeBalance * 1.15)
    .map((d: any) => d.date);

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={formattedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis 
            dataKey="date" 
            tickFormatter={(date) => format(parseISO(date), 'MM/dd')} 
            axisLine={false}
            minTickGap={20}
          />
          <YAxis 
            yAxisId="left"
            axisLine={false}
            tickFormatter={(value) => `$${value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`}
            domain={['auto', 'auto']}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            axisLine={false}
            tickFormatter={(value) => `$${value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`}
            domain={[0, 'auto']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <ReferenceLine 
            y={minSafeBalance} 
            yAxisId="left" 
            label="Min Safe Balance" 
            stroke="#ff7300"
            strokeDasharray="3 3"
          />
          <Bar yAxisId="right" dataKey="inflows" name="Inflows" fill="rgba(16, 185, 129, 0.7)" barSize={10} />
          <Bar yAxisId="right" dataKey="outflows" name="Outflows" fill="rgba(239, 68, 68, 0.7)" barSize={10} />
          <Line 
            yAxisId="left" 
            type="monotone" 
            dataKey="balance" 
            name="Cash Balance" 
            stroke="#3b82f6" 
            strokeWidth={3}
            dot={(props: any) => {
              const { cx, cy, payload } = props;
              const isRiskDate = riskDates.includes(payload.date);
              if (isRiskDate) {
                return (
                  <circle 
                    cx={cx} 
                    cy={cy} 
                    r={5} 
                    fill="#ef4444" 
                    stroke="white"
                    strokeWidth={2}
                  />
                );
              }
              return (
                <circle 
                  cx={cx} 
                  cy={cy} 
                  r={3} 
                  fill="#3b82f6" 
                  opacity={0.8}
                />
              );
            }}
          />
          <Area 
            yAxisId="left"
            dataKey="balance"
            type="monotone"
            fill="rgba(59, 130, 246, 0.1)"
            stroke="none"
          />
        </ComposedChart>
      </ResponsiveContainer>
      <div className="text-center text-xs text-gray-500 mt-2">
        <span className="inline-flex items-center">
          <span className="h-2 w-2 rounded-full bg-red-500 inline-block mr-1"></span>
          Red dots indicate potential liquidity risk days
        </span>
      </div>
    </div>
  );
};

export default CashFlowChart;