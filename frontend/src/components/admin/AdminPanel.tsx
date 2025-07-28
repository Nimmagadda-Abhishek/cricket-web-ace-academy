import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import AdminLogin from './AdminLogin';
import Dashboard from './Dashboard';
import StudentsManagement from './StudentsManagement';
import ProgramsManagement from './ProgramsManagement';
import CoachesManagement from './CoachesManagement';
import ContactsManagement from './ContactsManagement';
import FacilitiesManagement from './FacilitiesManagement';
import AchievementsManagement from './AchievementsManagement';
import TestimonialsManagement from './TestimonialsManagement';
import GalleryManagement from './GalleryManagement';
import Settings from './Settings';
import { api } from '@/lib/api';
import { useApiConnection } from '@/hooks/use-api-connection';
import { useToast } from '@/hooks/use-toast';

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isConnected, isDatabaseConnected, error: connectionError, dbError } = useApiConnection();
  const { toast } = useToast();

  // Check connection status and token when component mounts
  useEffect(() => {
    // Check for existing token
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Found existing token in localStorage');
      setIsAuthenticated(true);
    }
    
    // Show API connection error if any
    if (connectionError) {
      toast({
        title: "Backend Connection Error",
        description: "Could not connect to the backend server. Please check if it's running.",
        variant: "destructive",
      });
    }
    
    // Show database connection error if any
    if (dbError) {
      toast({
        title: "Database Connection Error",
        description: `Could not connect to the Hostinger database: ${dbError}`,
        variant: "destructive",
      });
    }
  }, [connectionError, dbError, toast]);

  const handleLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setLoginError('');
      
      // Check if backend is connected
      if (!isConnected) {
        console.warn('Backend connection check failed, but still attempting login...');
        // We'll still try to log in even if the connection check failed
        // This allows login to work even if the health endpoint is not available
      }
      
      // For development/testing, allow fallback to mock login
      if ((import.meta.env.DEV || process.env.NODE_ENV === 'development') && 
          ((email === 'admin' && password === 'password') || 
           (email === 'admin@kalyancricketacademy.com' && password === 'Admin@123456'))) {
        setIsAuthenticated(true);
        localStorage.setItem('token', 'mock-token');
        return;
      }
      
      // Real authentication using the API
      console.log('Attempting login with:', { email });
      
      try {
        // First try direct fetch for debugging
        const directResponse = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
          credentials: 'include'
        });
        
        console.log('Direct fetch response status:', directResponse.status);
        const directData = await directResponse.json();
        console.log('Direct fetch response data:', directData);
        
        if (directResponse.ok && directData.status === 'success' && directData.token) {
          localStorage.setItem('token', directData.token);
          setIsAuthenticated(true);
          return;
        }
      } catch (directError) {
        console.error('Direct fetch error:', directError);
      }
      
      // If direct fetch fails, try through the API service
      const response = await api.auth.login(email, password);
      console.log('API service response:', response);
      
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

  // All mock components have been replaced with real implementations

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
      case 'achievements':
        return <AchievementsManagement />;
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