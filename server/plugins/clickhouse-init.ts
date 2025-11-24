import { initializeEventTable } from '../database/clickhouse-connection';

export default defineNitroPlugin(async (nitroApp) => {
  // Initialize ClickHouse events table on server startup
  // This ensures the table exists before any events are tracked
  try {
    await initializeEventTable();
  } catch (error) {
    console.error('Failed to initialize ClickHouse events table:', error);
    // Don't throw - allow the server to start even if ClickHouse is not available
  }
});
