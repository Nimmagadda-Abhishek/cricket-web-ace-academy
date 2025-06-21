import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import AdminLogin from './AdminLogin';
import Dashboard from './Dashboard';
import StudentsManagement from './StudentsManagement';
import ProgramsManagement from './ProgramsManagement';
import CoachesManagement from './CoachesManagement';
import ContactsManagement from './ContactsManagement';
import Settings from './Settings';

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [loginError, setLoginError] = useState('');

  const handleLogin = (username: string, password: string) => {
    // Simple authentication check (in real app, this would be proper authentication)
    if (username === 'admin' && password === 'password') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid username or password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('dashboard');
    setLoginError('');
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  // Mock components for remaining pages
  const FacilitiesManagement = () => (
    <div className="text-center py-20">
      <div className="text-6xl mb-4">🏢</div>
      <h2 className="text-2xl font-bold text-cricket-green mb-4">Facilities Management</h2>
      <p className="text-gray-600">Monitor and manage academy facilities and equipment.</p>
    </div>
  );

  const TestimonialsManagement = () => (
    <div className="text-center py-20">
      <div className="text-6xl mb-4">⭐</div>
      <h2 className="text-2xl font-bold text-cricket-green mb-4">Testimonials Management</h2>
      <p className="text-gray-600">Manage customer testimonials and reviews.</p>
    </div>
  );

  const GalleryManagement = () => (
    <div className="text-center py-20">
      <div className="text-6xl mb-4">📸</div>
      <h2 className="text-2xl font-bold text-cricket-green mb-4">Gallery Management</h2>
      <p className="text-gray-600">Upload and organize academy photos and videos.</p>
    </div>
  );

  const renderPageContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'students':
        return <StudentsManagement />;
      case 'programs':
        return <ProgramsManagement />;
      case 'coaches':
        return <CoachesManagement />;
      case 'facilities':
        return <FacilitiesManagement />;
      case 'testimonials':
        return <TestimonialsManagement />;
      case 'gallery':
        return <GalleryManagement />;
      case 'contacts':
        return <ContactsManagement />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} error={loginError} />;
  }

  return (
    <AdminLayout
      currentPage={currentPage}
      onNavigate={handleNavigate}
      onLogout={handleLogout}
    >
      {renderPageContent()}
    </AdminLayout>
  );
};

export default AdminPanel;