import { useState, useEffect } from 'react';
import { checkApiConnection } from '@/lib/api';

/**
 * Hook to check if the API is connected
 * @returns Object containing connection status and error message
 */
export function useApiConnection() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        setIsLoading(true);
        const connected = await checkApiConnection();
        setIsConnected(connected);
        setError(connected ? null : 'Could not connect to the API');
      } catch (err) {
        setIsConnected(false);
        setError('Error checking API connection');
        console.error('API connection check error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkConnection();
  }, []);

  return { isConnected, error, isLoading };
}

export default useApiConnection;