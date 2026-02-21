import { useNetworkStatus, useSyncStatus } from '@/hooks/use-offline';
import { Wifi, WifiOff, Cloud, CloudOff, RefreshCw, AlertCircle } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';

export function SyncStatusIndicator() {
  const { isOnline, wasOffline } = useNetworkStatus();
  const { pending, failed, lastSynced, triggerSync } = useSyncStatus();
  const { t } = useTranslation('common');
  const [isSyncing, setIsSyncing] = useState(false);

  // Handle online/offline transitions
  useEffect(() => {
    if (isOnline && wasOffline) {
      // Just came back online - trigger sync
      triggerSync();
    }
  }, [isOnline, wasOffline, triggerSync]);

  const handleManualSync = async () => {
    setIsSyncing(true);
    await triggerSync();
    setIsSyncing(false);
  };

  // Don't show if never went offline
  if (!wasOffline) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-background border rounded-lg shadow-lg p-4 min-w-[200px]">
        {/* Connection Status */}
        <div className="flex items-center gap-2 mb-3">
          {isOnline ? (
            <Wifi className="h-4 w-4 text-green-500" />
          ) : (
            <WifiOff className="h-4 w-4 text-red-500" />
          )}
          <span className="text-sm font-medium">
            {isOnline ? t('sync.online') : t('sync.offline')}
          </span>
        </div>

        {/* Sync Status */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              {pending > 0 ? (
                <CloudOff className="h-4 w-4 text-yellow-500" />
              ) : (
                <Cloud className="h-4 w-4 text-green-500" />
              )}
              <span className="text-muted-foreground">
                {pending > 0 ? t('sync.pending', { count: pending }) : t('sync.synced')}
              </span>
            </div>
          </div>

          {failed > 0 && (
            <div className="flex items-center gap-2 text-sm text-red-500">
              <AlertCircle className="h-4 w-4" />
              <span>{t('sync.failed', { count: failed })}</span>
            </div>
          )}

          {lastSynced && (
            <p className="text-xs text-muted-foreground">
              {t('sync.lastSynced', { date: new Date(lastSynced).toLocaleString() })}
            </p>
          )}
        </div>

        {/* Sync Button */}
        {isOnline && pending > 0 && (
          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {t('sync.syncNow')}
          </button>
        )}

        {/* Offline Notice */}
        {!isOnline && (
          <p className="text-xs text-muted-foreground text-center">
            {t('sync.offlineNotice')}
          </p>
        )}
      </div>
    </div>
  );
}
