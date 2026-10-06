import cron from 'node-cron';
import { syncIgdbReferenceData } from '../services/igdbSyncService.js';

export function initIgdbCron() {

  cron.schedule('0 3 1 * *', async () => {
    console.log('[CRON] Running monthly IGDB sync...');
    try {
      await syncIgdbReferenceData();
      console.log('[CRON] IGDB sync complete.');
    } catch (err) {
      console.error('[CRON] IGDB sync failed:', err);
    }
  });
}