import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

type SupabaseSubscription = {
  table: string;
  schema?: string;
  filter?: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  callback: (payload: RealtimePostgresChangesPayload<any>) => void;
};

/**
 * Hook for subscribing to Supabase realtime changes
 * @param subscriptions Array of subscription configurations
 * @returns Object with loading and error states
 */
export function useSupabaseSubscription(subscriptions: SupabaseSubscription[]) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [channels, setChannels] = useState<RealtimeChannel[]>([]);

  useEffect(() => {
    const newChannels: RealtimeChannel[] = [];

    // Set up subscriptions
    subscriptions.forEach((subscription) => {
      try {
        const channel = supabase
          .channel(`${subscription.table}-changes`)
          .on(
            'postgres_changes',
            {
              event: subscription.event || '*',
              schema: subscription.schema || 'public',
              table: subscription.table,
              filter: subscription.filter,
            },
            subscription.callback
          )
          .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
              console.log(`Subscribed to ${subscription.table} changes`);
            }
            if (status === 'CHANNEL_ERROR') {
              setError(new Error(`Failed to subscribe to ${subscription.table} changes`));
            }
          });

        newChannels.push(channel);
      } catch (err) {
        console.error('Error setting up Supabase subscription:', err);
        setError(err instanceof Error ? err : new Error('Unknown error in Supabase subscription'));
      }
    });

    setChannels(newChannels);
    setLoading(false);

    // Clean up subscriptions on unmount
    return () => {
      newChannels.forEach((channel) => {
        supabase.removeChannel(channel);
      });
    };
  }, [subscriptions]);

  return { loading, error };
}

/**
 * Hook for fetching data from Supabase with automatic refetching on changes
 * @param tableName The table to fetch from
 * @param query The query function that takes a supabase query builder and returns a modified query
 * @param dependencies Array of dependencies that should trigger a refetch when changed
 * @returns Object with data, loading, error, and refetch function
 */
export function useSupabaseQuery<T = any>(
  tableName: string,
  query: (queryBuilder: any) => any,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const queryBuilder = supabase.from(tableName).select();
      const { data: result, error: queryError } = await query(queryBuilder);

      if (queryError) {
        throw queryError;
      }

      setData(result as T);
      setError(null);
    } catch (err) {
      console.error(`Error fetching data from ${tableName}:`, err);
      setError(err instanceof Error ? err : new Error(`Error fetching data from ${tableName}`));
    } finally {
      setLoading(false);
    }
  };

  // Set up subscription to refetch on changes
  useSupabaseSubscription([
    {
      table: tableName,
      event: '*',
      callback: () => {
        fetchData();
      },
    },
  ]);

  // Fetch data initially and when dependencies change
  useEffect(() => {
    fetchData();
  }, [...dependencies]);

  return { data, loading, error, refetch: fetchData };
}

export default useSupabaseQuery;