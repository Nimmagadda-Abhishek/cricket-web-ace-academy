import { useState, useEffect } from 'react';
import { checkApiConnection, checkDatabaseConnection } from '@/lib/api';

/**
 * Hook to check if the API and database are connected
 * @returns Object containing connection status and error message
 */
export function useApiConnection() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isDatabaseConnected, setIsDatabaseConnected] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dbError, setDbError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkConnections = async () => {
      try {
        setIsLoading(true);
        
        // Check API connection with timeout
        const apiCheckPromise = checkApiConnection();
        const apiConnected = await Promise.race([
          apiCheckPromise,
          new Promise<boolean>(resolve => setTimeout(() => resolve(false), 5000)) // 5 second timeout
        ]);
        
        setIsConnected(apiConnected);
        setError(apiConnected ? null : 'Could not connect to the API');
        
        // Check database connection with timeout
        const dbCheckPromise = checkDatabaseConnection();
        const dbStatus = await Promise.race([
          dbCheckPromise,
          new Promise<{connected: boolean, message: string}>(resolve => 
            setTimeout(() => resolve({connected: false, message: 'Database connection timed out'}), 5000)
          )
        ]);
        
        setIsDatabaseConnected(dbStatus.connected);
        setDbError(dbStatus.connected ? null : dbStatus.message);
        
        // Even if connections fail, we can still show the app with mock data
        if (!apiConnected || !dbStatus.connected) {
          console.warn('Using mock data due to connection issues');
        }
      } catch (err) {
        setIsConnected(false);
        setIsDatabaseConnected(false);
        setError('Error checking connections');
        console.error('Connection check error:', err);
        // We can still show the app with mock data
        console.warn('Using mock data due to connection error');
      } finally {
        setIsLoading(false);
      }
    };

    checkConnections();
  }, []);

  return { 
    isConnected, 
    isDatabaseConnected,
    error, 
    dbError,
    isLoading,
    // Overall connection status (both API and DB)
    isFullyConnected: isConnected && isDatabaseConnected
  };
}

export default useApiConnection;