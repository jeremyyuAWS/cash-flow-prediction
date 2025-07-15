import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';

interface Alert {
  id: number;
  type: string;
  message: string;
  date: string;
}

interface AlertsListProps {
  alerts: Alert[];
}

const AlertsList: React.FC<AlertsListProps> = ({ alerts }) => {
  return (
    <div className="space-y-3">
      {alerts.length > 0 ? (
        alerts.map((alert) => (
          <div key={alert.id} className={`p-3 rounded-lg border ${
            alert.type === 'warning' ? 'bg-yellow-50 border-yellow-200' : 'bg-blue-50 border-blue-200'
          }`}>
            <div className="flex">
              <div className="flex-shrink-0">
                {alert.type === 'warning' ? (
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                ) : (
                  <Info className="h-5 w-5 text-blue-400" />
                )}
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${
                  alert.type === 'warning' ? 'text-yellow-800' : 'text-blue-800'
                }`}>
                  {alert.message}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {new Date(alert.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-500">No alerts at this time</p>
        </div>
      )}
    </div>
  );
};

export default AlertsList;