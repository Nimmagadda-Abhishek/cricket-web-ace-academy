import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, currentPage, onNavigate, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'students', name: 'Students', icon: '👥' },
    { id: 'programs', name: 'Programs', icon: '🏏' },
    { id: 'coaches', name: 'Coaches', icon: '👨‍🏫' },
    { id: 'facilities', name: 'Facilities', icon: '🏢' },
    { id: 'achievements', name: 'Achievements', icon: '🏆' },
    { id: 'testimonials', name: 'Testimonials', icon: '⭐' },
    { id: 'gallery', name: 'Gallery', icon: '📸' },
    { id: 'contacts', name: 'Contacts', icon: '📞' },
    { id: 'settings', name: 'Settings', icon: '⚙️' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`bg-cricket-green text-white transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-16'} flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-cricket-dark">
          <div className="flex items-center justify-between">
            <h1 className={`font-bold font-poppins ${isSidebarOpen ? 'text-lg' : 'text-xs'} transition-all duration-300`}>
              {isSidebarOpen ? 'Cricket Academy Admin' : 'CA'}
            </h1>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-white hover:bg-cricket-dark p-1 rounded transition-colors duration-200"
            >
              {isSidebarOpen ? '◀' : '▶'}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => {
                    console.log(`Navigating to ${item.id}`);
                    onNavigate(item.id);
                  }}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                    currentPage === item.id
                      ? 'bg-cricket-orange text-white shadow-lg'
                      : 'hover:bg-cricket-dark hover:shadow-md'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  {isSidebarOpen && <span className="font-medium">{item.name}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-cricket-dark">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-cricket-orange rounded-full flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            {isSidebarOpen && (
              <div>
                <p className="font-medium">Admin User</p>
                <p className="text-sm text-cricket-gold">Administrator</p>
              </div>
            )}
          </div>
          <Button
            onClick={() => {
              console.log('Logout clicked');
              onLogout();
            }}
            variant="outline"
            size="sm"
            type="button"
            className={`${isSidebarOpen ? 'w-full' : 'w-10 h-10 p-0'} text-white border-white hover:bg-white hover:text-cricket-green transition-all duration-200`}
          >
            {isSidebarOpen ? '🚪 Logout' : '🚪'}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-cricket-green capitalize">
                {currentPage === 'dashboard' ? 'Dashboard' : currentPage}
              </h2>
              <p className="text-gray-600">
                {currentPage === 'dashboard' 
                  ? 'Welcome back! Here\'s what\'s happening at your academy.' 
                  : `Manage your academy ${currentPage}`}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-cricket-orange/10 text-cricket-orange px-3 py-1 rounded-full text-sm font-medium">
                🔔 3 New Notifications
              </div>
              <div className="text-sm text-gray-500">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;