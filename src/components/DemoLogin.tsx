import React, { useState } from 'react';
import { Lock, Eye, EyeOff, User, ArrowRight, Landmark } from 'lucide-react';

interface DemoLoginProps {
  onLogin: (userData: { username: string; role: string }) => void;
}

const DemoLogin: React.FC<DemoLoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  
  const predefinedUsers = [
    { name: 'Priya Mehta', role: 'Treasury Manager', avatar: 'PM', color: 'bg-blue-600' },
    { name: 'James Wilson', role: 'Credit Risk Analyst', avatar: 'JW', color: 'bg-purple-600' },
    { name: 'Sarah Johnson', role: 'Relationship Manager', avatar: 'SJ', color: 'bg-green-600' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username) {
      setError('Please enter your username');
      return;
    }
    
    if (!password) {
      setError('Please enter your password');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    // Simulate authentication delay
    setTimeout(() => {
      setIsLoading(false);
      
      // Always succeed for demo purposes
      const selectedUser = predefinedUsers.find(user => 
        user.name.toLowerCase().includes(username.toLowerCase())
      ) || predefinedUsers[0];
      
      onLogin({ 
        username: selectedUser.name,
        role: selectedUser.role
      });
    }, 1500);
  };
  
  const handleUserSelect = (user: { name: string; role: string }) => {
    setUsername(user.name);
    setSelectedRole(user.role);
    setPassword('demo1234'); // Auto-fill password for demo purposes
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 transform transition-all">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-600 rounded-full mb-4">
            <Landmark className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Financial AI Hub</h2>
          <p className="text-gray-600 mt-1">Sign in to access your cash flow predictions</p>
        </div>
        
        <div className="mb-6">
          <div className="text-sm font-medium text-gray-700 mb-2">Select a demo user:</div>
          <div className="grid grid-cols-3 gap-3">
            {predefinedUsers.map(user => (
              <button
                key={user.name}
                onClick={() => handleUserSelect(user)}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
                  selectedRole === user.role 
                    ? 'border-indigo-500 bg-indigo-50' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className={`${user.color} text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mb-2`}>
                  {user.avatar}
                </div>
                <span className="text-sm font-medium text-gray-900">{user.name}</span>
                <span className="text-xs text-gray-500">{user.role}</span>
              </button>
            ))}
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 pr-3 py-2 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Your username"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 py-2 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Your password"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              
              <div className="flex justify-between mt-1">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-xs text-gray-500">
                    Remember me
                  </label>
                </div>
                <a href="#" className="text-xs text-indigo-600 hover:text-indigo-500">
                  Forgot password?
                </a>
              </div>
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">This is a demonstration application. Any credentials will work.</p>
        </div>
      </div>
    </div>
  );
};

export default DemoLogin;