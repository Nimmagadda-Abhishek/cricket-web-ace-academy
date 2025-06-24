import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import AdminLogin from './AdminLogin';
import Dashboard from './Dashboard';
import StudentsManagement from './StudentsManagement';
import ProgramsManagement from './ProgramsManagement';
import CoachesManagement from './CoachesManagement';
import ContactsManagement from './ContactsManagement';
import Settings from './Settings';
import { api } from '@/lib/api';
import { useApiConnection } from '@/hooks/use-api-connection';
import { useToast } from '@/hooks/use-toast';

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isConnected, error: connectionError } = useApiConnection();
  const { toast } = useToast();

  // Check connection status when component mounts
  useEffect(() => {
    if (connectionError) {
      toast({
        title: "Backend Connection Error",
        description: "Could not connect to the backend server. Please check if it's running.",
        variant: "destructive",
      });
    }
  }, [connectionError, toast]);

  const handleLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setLoginError('');
      
      // Check if backend is connected
      if (!isConnected) {
        setLoginError('Backend server is not available. Please try again later.');
        return;
      }
      
      // For development/testing, allow fallback to mock login
      if (process.env.NODE_ENV === 'development' && email === 'admin' && password === 'password') {
        setIsAuthenticated(true);
        localStorage.setItem('token', 'mock-token');
        return;
      }
      
      // Real authentication using the API
      const response = await api.auth.login(email, password);
      
      if (response.status === 'success' && response.data?.token) {
        localStorage.setItem('token', response.data.token);
        setIsAuthenticated(true);
      } else {
        setLoginError(response.message || 'Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      
      // Call logout API if connected
      if (isConnected) {
        await api.auth.logout();
      }
      
      // Clear token and state
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setCurrentPage('dashboard');
      setLoginError('');
      
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error('Logout error:', error);
      
      // Still logout locally even if API call fails
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setCurrentPage('dashboard');
    } finally {
      setIsLoading(false);
    }
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
    return <AdminLogin onLogin={handleLogin} error={loginError} isLoading={isLoading} />;
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