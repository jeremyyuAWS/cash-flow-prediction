import React, { useState, useEffect } from 'react';
import { Bell, X, Check, AlertTriangle, Clock, Info, Settings, ChevronRight } from 'lucide-react';
import { Toaster, toast } from 'sonner';

interface NotificationProps {
  alerts: any[];
  onDismissAlert?: (id: number) => void;
  onViewAllAlerts?: () => void;
  onSettingsClick?: () => void;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: Date;
  read: boolean;
  actionLabel?: string;
  actionHandler?: () => void;
  autoDismiss?: boolean;
}

export interface NotificationConfig {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  actions?: { label: string; onClick: () => void }[];
  autoDismiss?: boolean;
  duration?: number;
}

// Create notification helper function
export const createNotification = (
  type: 'success' | 'error' | 'warning' | 'info',
  title: string,
  message: string,
  actions?: { label: string; onClick: () => void }[],
  autoDismiss = true,
  duration = 5000
): NotificationConfig => {
  const id = Math.random().toString(36).substring(2, 9);
  return {
    id,
    type,
    title,
    message,
    actions,
    autoDismiss,
    duration
  };
};

export const showNotification = (
  notification: Omit<SystemNotification, 'id' | 'timestamp' | 'read'>
) => {
  const id = Math.random().toString(36).substring(2, 9);
  const fullNotification: SystemNotification = {
    ...notification,
    id,
    timestamp: new Date(),
    read: false,
  };

  // Show the toast notification
  const toastOptions: any = {
    id,
    duration: notification.autoDismiss ? 5000 : Infinity,
  };

  if (notification.actionLabel && notification.actionHandler) {
    toastOptions.action = {
      label: notification.actionLabel,
      onClick: notification.actionHandler,
    };
  }

  switch (notification.type) {
    case 'success':
      toast.success(notification.message, toastOptions);
      break;
    case 'error':
      toast.error(notification.message, toastOptions);
      break;
    case 'warning':
      toast.warning(notification.message, toastOptions);
      break;
    case 'info':
      toast.info(notification.message, toastOptions);
      break;
    default:
      toast(notification.message, toastOptions);
  }

  // Add to notification store
  addNotificationToLocalStore(fullNotification);
  
  return id;
};

// Helper to store notifications in local storage
const addNotificationToLocalStore = (notification: SystemNotification) => {
  try {
    const storedNotifications = localStorage.getItem('notifications');
    let notifications: SystemNotification[] = storedNotifications 
      ? JSON.parse(storedNotifications) 
      : [];
    
    notifications.unshift(notification);
    
    // Keep only the latest 50 notifications
    if (notifications.length > 50) {
      notifications = notifications.slice(0, 50);
    }
    
    localStorage.setItem('notifications', JSON.stringify(notifications));
  } catch (error) {
    console.error('Failed to store notification in local storage:', error);
  }
};

// Helper to get notifications from local storage
const getNotificationsFromLocalStore = (): SystemNotification[] => {
  try {
    const storedNotifications = localStorage.getItem('notifications');
    return storedNotifications ? JSON.parse(storedNotifications) : [];
  } catch (error) {
    console.error('Failed to get notifications from local storage:', error);
    return [];
  }
};

// Helper to mark a notification as read
const markNotificationAsRead = (id: string) => {
  try {
    const storedNotifications = localStorage.getItem('notifications');
    if (!storedNotifications) return;
    
    const notifications: SystemNotification[] = JSON.parse(storedNotifications);
    
    const updatedNotifications = notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    );
    
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
  }
};

// Notification center component
const NotificationSystem: React.FC<NotificationProps> = ({ 
  alerts,
  onDismissAlert,
  onViewAllAlerts,
  onSettingsClick
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Load notifications from local storage
  useEffect(() => {
    const loadedNotifications = getNotificationsFromLocalStore();
    setNotifications(loadedNotifications);
    setUnreadCount(loadedNotifications.filter(n => !n.read).length);
    
    // Setup interval to check for new notifications
    const interval = setInterval(() => {
      const freshNotifications = getNotificationsFromLocalStore();
      setNotifications(freshNotifications);
      setUnreadCount(freshNotifications.filter(n => !n.read).length);
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  // Mark notifications as read when opening the panel
  useEffect(() => {
    if (isOpen && unreadCount > 0) {
      // Update local state
      const updatedNotifications = notifications.map(notification => ({ ...notification, read: true }));
      setNotifications(updatedNotifications);
      setUnreadCount(0);
      
      // Update local storage
      try {
        localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
      } catch (error) {
        console.error('Failed to mark all notifications as read:', error);
      }
    }
  }, [isOpen, unreadCount]);
  
  const handleDismissNotification = (id: string) => {
    const updatedNotifications = notifications.filter(notification => notification.id !== id);
    setNotifications(updatedNotifications);
    
    // Update local storage
    try {
      localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    } catch (error) {
      console.error('Failed to dismiss notification:', error);
    }
  };
  
  // Generate demo notifications when none exist
  useEffect(() => {
    // Only generate if we have no notifications
    if (notifications.length === 0) {
      const demoNotifications: SystemNotification[] = [
        {
          id: 'demo-1',
          title: 'Cash Flow Alert',
          message: 'Potential liquidity shortage predicted on May 15, 2025.',
          type: 'warning',
          timestamp: new Date(new Date().setDate(new Date().getDate() - 1)),
          read: false,
          actionLabel: 'View Forecast',
          actionHandler: () => {},
          autoDismiss: false
        },
        {
          id: 'demo-2',
          title: 'Payment Received',
          message: 'Customer payment of $45,000 confirmed.',
          type: 'success',
          timestamp: new Date(new Date().setHours(new Date().getHours() - 3)),
          read: false,
          autoDismiss: true
        },
        {
          id: 'demo-3',
          title: 'Forecast Updated',
          message: 'Cash flow forecast has been updated with the latest data.',
          type: 'info',
          timestamp: new Date(new Date().setHours(new Date().getHours() - 12)),
          read: true,
          autoDismiss: true
        }
      ];
      
      setNotifications(demoNotifications);
      setUnreadCount(demoNotifications.filter(n => !n.read).length);
      
      // Store in localStorage
      try {
        localStorage.setItem('notifications', JSON.stringify(demoNotifications));
      } catch (error) {
        console.error('Failed to store demo notifications:', error);
      }
    }
  }, [notifications.length]);
  
  // Format notification timestamp
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };
  
  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'error':
        return <X className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };
  
  return (
    <>
      {/* Notification Toaster */}
      <Toaster 
        position="top-right" 
        richColors
        closeButton
        toastOptions={{
          className: 'custom-toast',
          style: {
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }
        }}
      />
      
      {/* Notification Bell */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative rounded-full bg-white p-1.5 text-gray-600 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
        >
          <span className="sr-only">View notifications</span>
          <Bell size={20} />
          
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-medium text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
        
        {/* Notification Dropdown */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-96 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50">
            <div className="p-3 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={onSettingsClick}
                  className="text-gray-500 hover:text-gray-700"
                  title="Notification settings"
                >
                  <Settings size={18} />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                  title="Close notifications"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            
            <div className="max-h-[400px] overflow-y-auto overflow-x-hidden">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <Bell size={40} className="mx-auto mb-4 text-gray-300" />
                  <p>No notifications yet</p>
                  <p className="text-sm mt-1">You'll see alerts and updates here</p>
                </div>
              ) : (
                <div>
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className={`p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-indigo-50' : ''}`}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-3 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {notification.title}
                            </p>
                            <p className="flex-shrink-0 ml-2 text-xs text-gray-500">
                              {formatTimestamp(new Date(notification.timestamp))}
                            </p>
                          </div>
                          
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          
                          {notification.actionLabel && (
                            <button
                              onClick={notification.actionHandler}
                              className="mt-2 text-xs text-indigo-600 font-medium hover:text-indigo-800 flex items-center"
                            >
                              {notification.actionLabel}
                              <ChevronRight size={14} />
                            </button>
                          )}
                        </div>
                        
                        <div className="ml-3 flex-shrink-0">
                          <button
                            onClick={() => handleDismissNotification(notification.id)}
                            className="text-gray-400 hover:text-gray-600"
                            title="Dismiss"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {notifications.length > 0 && (
              <div className="p-3 text-center border-t border-gray-100">
                <button 
                  onClick={onViewAllAlerts}
                  className="text-indigo-600 text-sm font-medium hover:text-indigo-800"
                >
                  View all alerts
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationSystem;