import { Router } from 'express';
import { syncService } from '../../lib/sync';
import { catchAsync } from '../../utils/catch-async';
import { auth } from '../../middlewares/auth';

const router = Router();

// Get sync status
router.get('/status', catchAsync(async (req, res) => {
  const status = await syncService.getSyncStatus();
  res.json({
    success: true,
    data: status,
  });
}));

// Trigger manual sync
router.post('/trigger', auth, catchAsync(async (req, res) => {
  const result = await syncService.triggerManualSync();
  res.json({
    success: result.success,
    data: result,
  });
}));

// Get pending count
router.get('/pending', catchAsync(async (req, res) => {
  const count = await syncService.getPendingCount();
  res.json({
    success: true,
    data: { pending: count },
  });
}));

// Webhook endpoint for remote sync (for peer-to-peer sync)
router.post('/webhook', catchAsync(async (req, res) => {
  const { operation, tableName, recordId, data } = req.body;

  // This would handle incoming sync from another instance
  // For now, just acknowledge
  console.log(`Received sync: ${operation} on ${tableName}/${recordId}`);

  res.json({
    success: true,
    message: 'Sync received',
  });
}));

export default router;
