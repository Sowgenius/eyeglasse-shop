import { useEffect, useState } from 'react';

interface NetworkStatus {
  isOnline: boolean;
  wasOffline: boolean;
}

export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>({
    isOnline: true,
    wasOffline: false,
  });

  useEffect(() => {
    // Set initial status
    setStatus({
      isOnline: navigator.onLine,
      wasOffline: !navigator.onLine,
    });

    const handleOnline = () => {
      setStatus({ isOnline: true, wasOffline: true });
    };

    const handleOffline = () => {
      setStatus({ isOnline: false, wasOffline: true });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return status;
}

export function useServiceWorker() {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          setRegistration(reg);
          
          // Check for updates
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setUpdateAvailable(true);
                }
              });
            }
          });
        })
        .catch((err) => {
          console.error('Service worker registration failed:', err);
        });
    }
  }, []);

  const update = () => {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  };

  return { registration, updateAvailable, update };
}

export function useSyncStatus() {
  const [syncStatus, setSyncStatus] = useState({
    pending: 0,
    synced: 0,
    failed: 0,
    isOnline: true,
    lastSynced: null as Date | null,
  });

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/sync/status');
      const data = await response.json();
      if (data.success) {
        setSyncStatus(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch sync status:', error);
    }
  };

  useEffect(() => {
    fetchStatus();
    
    // Poll every 30 seconds when online
    const interval = setInterval(fetchStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const triggerSync = async () => {
    try {
      await fetch('/api/sync/trigger', { method: 'POST' });
      fetchStatus();
    } catch (error) {
      console.error('Failed to trigger sync:', error);
    }
  };

  return { ...syncStatus, triggerSync, refetch: fetchStatus };
}
