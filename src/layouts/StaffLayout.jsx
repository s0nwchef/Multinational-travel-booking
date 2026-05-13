import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MapPin, 
  Calendar, 
  Users, 
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  User,
  Bell,
  Search
} from 'lucide-react';
import authService from '../services/authService.js';
import Header from './Header.jsx';

const StaffLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        // Try to fetch from server
        const freshUser = await authService.fetchCurrentUser();
        if (freshUser) {
          setUser(freshUser);
        } else {
          // Redirect to home if not authenticated
          navigate('/home');
        }
      } else {
        setUser(currentUser);
      }
    };

    loadUser();
  }, [navigate]);

  const navigationItems = [
    { 
      name: 'Dashboard', 
      icon: LayoutDashboard, 
      path: '/staff/dashboard',
      color: 'text-orange-500'
    },
    { 
      name: 'Tours', 
      icon: MapPin, 
      path: '/staff/tours',
      color: 'text-blue-500'
    },
    { 
      name: 'Bookings', 
      icon: Calendar, 
      path: '/staff/bookings',
      color: 'text-green-500'
    },
    { 
      name: 'Customers', 
      icon: Users, 
      path: '/staff/customers',
      color: 'text-purple-500'
    },
    { 
      name: 'Analytics', 
      icon: BarChart3, 
      path: '/staff/analytics',
      color: 'text-pink-500'
    },
    { 
      name: 'Settings', 
      icon: Settings, 
      path: '/staff/settings',
      color: 'text-gray-500'
    },
  ];

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/home');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/home');
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Use regular Header */}
      <Header 
        onOpenAuth={() => {}} 
        onOpenWishlist={() => {}} 
        onOpenNotifications={() => {}} 
      />
      
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className={`
          ${sidebarOpen ? 'w-80' : 'w-20'} 
          bg-white shadow-xl transition-all duration-300 
          flex flex-col border-r border-gray-200
          fixed h-full z-40
        `}>
          {/* Logo và toggle button */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            {sidebarOpen ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Staff Portal</h1>
                  <p className="text-xs text-gray-500">Tour Operator</p>
                </div>
              </div>
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto">
                <MapPin className="w-6 h-6 text-white" />
              </div>
            )}
            
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5 text-gray-500" />
              ) : (
                <Menu className="w-5 h-5 text-gray-500" />
              )}
            </button>
          </div>

          {/* User info */}
          <div className="p-6 border-b border-gray-100">
            {sidebarOpen ? (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center">
                  {user.avatarUrl ? (
                    <img 
                      src={user.avatarUrl} 
                      alt={user.fullName}
                      className="w-12 h-12 rounded-2xl object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6 text-orange-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="font-semibold text-gray-900 truncate">{user.fullName || user.name}</h2>
                  <p className="text-sm text-gray-500 truncate">
                    {user.role === 'staff' ? 'Staff' : 
                     user.role === 'admin' ? 'Administrator' : user.role}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
              </div>
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center mx-auto">
                {user.avatarUrl ? (
                  <img 
                    src={user.avatarUrl} 
                    alt={user.fullName}
                    className="w-12 h-12 rounded-2xl object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 text-orange-600" />
                )}
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200
                    ${isActive 
                      ? 'bg-orange-50 text-orange-600 font-semibold' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                    ${sidebarOpen ? 'justify-start' : 'justify-center'}
                  `}
                >
                  <Icon className={`w-5 h-5 ${item.color}`} />
                  {sidebarOpen && (
                    <span className="flex-1">{item.name}</span>
                  )}
                  {sidebarOpen && (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Logout button */}
          <div className="p-6 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-2xl 
                text-gray-600 hover:bg-gray-50 hover:text-gray-900 
                transition-all duration-200
                ${sidebarOpen ? 'justify-start' : 'justify-center'}
              `}
            >
              <LogOut className="w-5 h-5 text-gray-500" />
              {sidebarOpen && <span className="flex-1">Logout</span>}
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className={`
          flex-1 transition-all duration-300
          ${sidebarOpen ? 'ml-80' : 'ml-20'}
        `}>
          {/* Content */}
          <div className="p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default StaffLayout;