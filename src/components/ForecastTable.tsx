import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ForecastTableProps {
  forecastData: any;
}

const ForecastTable: React.FC<ForecastTableProps> = ({ forecastData }) => {
  const [timeFrame, setTimeFrame] = useState('monthly');
  
  const data = timeFrame === 'monthly' 
    ? forecastData.monthlyForecasts 
    : forecastData.dailyForecasts.slice(0, 14); // Show only next 14 days for daily view
  
  return (
    <div>
      <div className="flex justify-between mb-4">
        <div className="text-sm font-medium text-gray-500">
          Showing {timeFrame === 'monthly' ? 'monthly' : 'daily'} forecast
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => setTimeFrame('daily')}
            className={`px-3 py-1 rounded text-sm ${
              timeFrame === 'daily' 
                ? 'bg-indigo-100 text-indigo-700' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Daily
          </button>
          <button 
            onClick={() => setTimeFrame('monthly')}
            className={`px-3 py-1 rounded text-sm ${
              timeFrame === 'monthly' 
                ? 'bg-indigo-100 text-indigo-700' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {timeFrame === 'monthly' ? 'Month' : 'Date'}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Starting Balance
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Inflows
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Outflows
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ending Balance
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Confidence
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {timeFrame === 'monthly' 
                    ? item.month 
                    : new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  }
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${(item.balance - item.inflows + item.outflows).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                  +${item.inflows.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                  -${item.outflows.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  ${item.balance.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          item.confidence > 80 ? 'bg-green-500' : 
                          item.confidence > 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${item.confidence}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-xs text-gray-500">{item.confidence}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ForecastTable;