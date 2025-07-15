import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  change?: number;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon, color, change }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
          
          {change !== undefined && (
            <div className="flex items-center mt-2">
              {change >= 0 ? (
                <>
                  <TrendingUp size={16} className="text-green-500 mr-1" />
                  <span className="text-xs text-green-500">{`+$${Math.abs(change).toLocaleString()}`}</span>
                </>
              ) : (
                <>
                  <TrendingDown size={16} className="text-red-500 mr-1" />
                  <span className="text-xs text-red-500">{`-$${Math.abs(change).toLocaleString()}`}</span>
                </>
              )}
            </div>
          )}
        </div>
        
        <div className={`${color} p-3 rounded-full`}>
          <div className="text-white">{icon}</div>
        </div>
      </div>
    </div>
  );
};

export default KpiCard;