import React, { useState } from 'react';
import { Bell, Search, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import NotificationSystem from './NotificationSystem';

interface Alert {
  id: number;
  type: string;
  message: string;
  date: string;
}

interface HeaderProps {
  alerts: Alert[];
  user?: {
    name: string;
    email: string;
    company: string;
    role: string;
  };
}

const Header: React.FC<HeaderProps> = ({ alerts, user }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 py-3 px-6 flex items-center justify-between">
      <div className="flex items-center">
        <h2 className="text-xl font-semibold text-gray-800">Cash Flow Prediction</h2>
        <div className="ml-6 hidden md:flex items-center text-sm">
          <span className="text-gray-500">Today:</span>
          <span className="ml-2 font-medium">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="hidden md:flex items-center mx-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="py-2 pl-10 pr-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-64"
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        
        <NotificationSystem 
          alerts={alerts}
          onViewAllAlerts={() => {}}
        />
        
        {user && (
          <div className="relative">
            <button 
              className="flex items-center text-sm text-gray-700 hover:text-indigo-600 focus:outline-none"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center mr-2">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <span className="hidden md:inline-block font-medium">{user.name}</span>
              <ChevronDown size={16} className="ml-1 text-gray-500" />
            </button>
            
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                <div className="py-1">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-gray-500 truncate">{user.email}</p>
                  </div>
                  <a
                    href="#"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <User size={16} className="mr-3 text-gray-400" />
                    Profile
                  </a>
                  <a
                    href="#"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Settings size={16} className="mr-3 text-gray-400" />
                    Settings
                  </a>
                  <div className="border-t border-gray-100">
                    <a
                      href="#"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut size={16} className="mr-3 text-gray-400" />
                      Sign out
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;