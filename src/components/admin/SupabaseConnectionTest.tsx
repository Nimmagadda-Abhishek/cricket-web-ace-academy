import React, { useState, useEffect } from 'react';
import { supabase, checkSupabaseConnection } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ReloadIcon } from '@radix-ui/react-icons';

const SupabaseConnectionTest = () => {
  const [connectionStatus, setConnectionStatus] = useState<{
    connected: boolean;
    message: string;
    loading: boolean;
  }>({
    connected: false,
    message: 'Checking connection...',
    loading: true,
  });

  const testConnection = async () => {
    setConnectionStatus({
      ...connectionStatus,
      loading: true,
      message: 'Checking connection...',
    });

    try {
      const result = await checkSupabaseConnection();
      
      setConnectionStatus({
        connected: result.connected,
        message: result.message,
        loading: false,
      });
    } catch (error) {
      setConnectionStatus({
        connected: false,
        message: error instanceof Error ? error.message : 'Unknown error',
        loading: false,
      });
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">Supabase Connection Test</h2>
      
      <div className="space-y-2">
        <p>
          <strong>Project URL:</strong>{' '}
          {import.meta.env.VITE_SUPABASE_URL || 'Not configured'}
        </p>
        
        <Alert variant={connectionStatus.connected ? "default" : "destructive"}>
          <AlertTitle>
            {connectionStatus.connected ? 'Connected' : 'Connection Failed'}
          </AlertTitle>
          <AlertDescription>{connectionStatus.message}</AlertDescription>
        </Alert>
      </div>
      
      <Button 
        onClick={testConnection} 
        disabled={connectionStatus.loading}
      >
        {connectionStatus.loading ? (
          <>
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            Testing Connection
          </>
        ) : (
          'Test Connection Again'
        )}
      </Button>
      
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-2">Connection Troubleshooting</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Check that your Supabase URL and API key are correct in the .env file</li>
          <li>Ensure your Supabase project is active and not in maintenance mode</li>
          <li>Verify that the database tables have been created</li>
          <li>Check browser console for detailed error messages</li>
          <li>Ensure your IP is not blocked by Supabase's security settings</li>
        </ul>
      </div>
    </div>
  );
};

export default SupabaseConnectionTest;