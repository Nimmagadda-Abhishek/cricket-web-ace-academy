import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApiConnection } from '@/hooks/use-api-connection';

interface AdminLoginProps {
  onLogin: (email: string, password: string) => void;
  error?: string;
  isLoading?: boolean;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, error, isLoading: externalLoading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [internalLoading, setInternalLoading] = useState(false);
  const { isConnected, isLoading: connectionLoading } = useApiConnection();
  
  // Use external loading state if provided, otherwise use internal
  const isLoading = externalLoading !== undefined ? externalLoading : internalLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected && !connectionLoading) {
      // If not connected to backend, show a message
      return;
    }
    
    setInternalLoading(true);
    
    try {
      await onLogin(email, password);
    } finally {
      setInternalLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cricket-green to-cricket-dark flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 text-9xl animate-rotate-slow">🏏</div>
        <div className="absolute bottom-20 right-20 text-8xl animate-float">⚾</div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl animate-pulse-slow">🏆</div>
      </div>

      <Card className="w-full max-w-md shadow-2xl border-0 overflow-hidden relative z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50"></div>
        
        <CardHeader className="text-center pb-4 relative z-10">
          <div className="mx-auto w-20 h-20 bg-cricket-orange rounded-full flex items-center justify-center mb-4 animate-bounceIn">
            <span className="text-3xl text-white">🏏</span>
          </div>
          <CardTitle className="text-3xl font-bold font-poppins heading-gradient animate-slideDown">
            Admin Login
          </CardTitle>
          <p className="text-gray-600 animate-fadeInUp">
            Access your Cricket Academy dashboard
          </p>
        </CardHeader>

        <CardContent className="relative z-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg animate-shake">
                <div className="flex items-center">
                  <span className="mr-2">❌</span>
                  {error}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="animate-slideInLeft">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cricket-orange focus:border-transparent transition-all duration-200 pl-12"
                    placeholder="Enter your email"
                    required
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    📧
                  </div>
                </div>
              </div>

              <div className="animate-slideInRight">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cricket-orange focus:border-transparent transition-all duration-200 pl-12"
                    placeholder="Enter your password"
                    required
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    🔒
                  </div>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-cricket-green to-cricket-orange hover:from-cricket-orange hover:to-cricket-green text-white font-semibold py-3 rounded-lg transform transition-all duration-300 hover:scale-105 shadow-lg animate-bounceIn"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Logging in...
                </div>
              ) : (
                '🚀 Login to Dashboard'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center animate-fadeInUp">
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
              <p className="text-sm">
                <strong>Demo Credentials:</strong><br />
                Email: <code className="bg-blue-100 px-2 py-1 rounded">admin@kalyancricketacademy.com</code><br />
                Password: <code className="bg-blue-100 px-2 py-1 rounded">Admin@123456</code>
              </p>
              <p className="text-xs mt-2 text-gray-600">
                For development: You can also use admin/password
              </p>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Forgot your password? Contact your system administrator.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;