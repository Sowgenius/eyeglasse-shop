import { PrismaClient, SyncOperation, SyncStatus } from '@prisma/client';
import { prisma } from '../lib/prisma';

const SYNC_TABLES = [
  'users',
  'customers',
  'products',
  'quotes',
  'quote_items',
  'invoices',
  'invoice_items',
  'payments',
  'prescriptions',
  'eye_exams',
  'stock_movements',
  'installment_plans',
  'installment_payments',
];

export interface SyncRecord {
  operation: SyncOperation;
  tableName: string;
  recordId: string;
  data?: Record<string, unknown>;
}

export interface SyncResult {
  success: boolean;
  synced: number;
  failed: number;
  errors: string[];
}

class SyncService {
  private isEnabled: boolean;
  private remoteUrl: string;
  private syncInProgress: boolean = false;

  constructor() {
    this.isEnabled = process.env.SYNC_ENABLED === 'true';
    this.remoteUrl = process.env.REMOTE_DATABASE_URL || '';
  }

  /**
   * Add an operation to the sync queue
   */
  async queueOperation(record: SyncRecord): Promise<void> {
    if (!this.isEnabled) return;

    try {
      await prisma.syncQueue.create({
        data: {
          operation: record.operation,
          tableName: record.tableName,
          recordId: record.recordId,
          data: record.data ? JSON.stringify(record.data) : null,
          status: SyncStatus.PENDING,
          retryCount: 0,
        },
      });
    } catch (error) {
      console.error('Failed to queue sync operation:', error);
    }
  }

  /**
   * Get pending sync operations count
   */
  async getPendingCount(): Promise<number> {
    return await prisma.syncQueue.count({
      where: { status: SyncStatus.PENDING },
    });
  }

  /**
   * Get sync status for UI
   */
  async getSyncStatus(): Promise<{
    pending: number;
    synced: number;
    failed: number;
    lastSynced: Date | null;
    isOnline: boolean;
  }> {
    const pending = await prisma.syncQueue.count({
      where: { status: SyncStatus.PENDING },
    });

    const synced = await prisma.syncQueue.count({
      where: { status: SyncStatus.SYNCED },
    });

    const failed = await prisma.syncQueue.count({
      where: { status: SyncStatus.FAILED },
    });

    const lastSynced = await prisma.syncQueue.findFirst({
      where: { status: SyncStatus.SYNCED },
      orderBy: { syncedAt: 'desc' },
    });

    return {
      pending,
      synced,
      failed,
      lastSynced: lastSynced?.syncedAt || null,
      isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    };
  }

  /**
   * Process pending sync operations
   */
  async syncPending(): Promise<SyncResult> {
    if (!this.isEnabled || !this.remoteUrl || this.syncInProgress) {
      return { success: true, synced: 0, failed: 0, errors: [] };
    }

    this.syncInProgress = true;
    const result: SyncResult = {
      success: true,
      synced: 0,
      failed: 0,
      errors: [],
    };

    try {
      const pending = await prisma.syncQueue.findMany({
        where: {
          status: SyncStatus.PENDING,
          retryCount: { lt: 5 }, // Max 5 retries
        },
        orderBy: { createdAt: 'asc' },
        take: 50, // Process in batches
      });

      for (const item of pending) {
        try {
          // Mark as syncing
          await prisma.syncQueue.update({
            where: { id: item.id },
            data: { status: SyncStatus.SYNCING },
          });

          // Sync to remote
          await this.syncRecord(item);

          // Mark as synced
          await prisma.syncQueue.update({
            where: { id: item.id },
            data: {
              status: SyncStatus.SYNCED,
              syncedAt: new Date(),
            },
          });

          result.synced++;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          
          await prisma.syncQueue.update({
            where: { id: item.id },
            data: {
              status: SyncStatus.FAILED,
              retryCount: { increment: 1 },
              error: errorMessage,
            },
          });

          result.failed++;
          result.errors.push(`Failed to sync ${item.tableName}/${item.recordId}: ${errorMessage}`);
        }
      }
    } finally {
      this.syncInProgress = false;
    }

    result.success = result.failed === 0;
    return result;
  }

  /**
   * Sync a single record to remote
   */
  private async syncRecord(record: {
    operation: SyncOperation;
    tableName: string;
    recordId: string;
    data: string | null;
  }): Promise<void> {
    const endpoint = `${this.remoteUrl}/api/sync`;
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        operation: record.operation,
        tableName: record.tableName,
        recordId: record.recordId,
        data: record.data ? JSON.parse(record.data) : null,
      }),
    });

    if (!response.ok) {
      throw new Error(`Remote sync failed: ${response.statusText}`);
    }
  }

  /**
   * Clean up old synced records (keep last 7 days)
   */
  async cleanup(): Promise<number> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const result = await prisma.syncQueue.deleteMany({
      where: {
        status: SyncStatus.SYNCED,
        syncedAt: { lt: sevenDaysAgo },
      },
    });

    return result.count;
  }

  /**
   * Manual sync trigger - for UI button
   */
  async triggerManualSync(): Promise<SyncResult> {
    return await this.syncPending();
  }
}

// Export singleton instance
export const syncService = new SyncService();
