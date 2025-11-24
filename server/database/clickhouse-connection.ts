import { createClient } from '@clickhouse/client';

// Create ClickHouse client for event tracking
export const clickhouseClient = createClient({
  host: process.env.CLICKHOUSE_HOST || 'http://localhost:8123',
  username: process.env.CLICKHOUSE_USER || 'default',
  password: process.env.CLICKHOUSE_PASSWORD || '',
  database: process.env.CLICKHOUSE_DATABASE || 'default',
});

// Initialize the events table
// Note: This function is called automatically on server startup.
// For production deployments, use the migration file instead:
// database-migrations/002_create_clickhouse_events_table.sql
export async function initializeEventTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS events (
      event_id UUID DEFAULT generateUUIDv4(),
      event_type String,
      product_id Int32,
      user_session String,
      event_metadata String DEFAULT '{}',
      created_at DateTime DEFAULT now(),
      INDEX idx_product_id product_id TYPE minmax GRANULARITY 4,
      INDEX idx_event_type event_type TYPE set(0) GRANULARITY 4,
      INDEX idx_user_session user_session TYPE bloom_filter(0.01) GRANULARITY 1
    ) ENGINE = MergeTree()
    ORDER BY (created_at, event_type)
    PARTITION BY toYYYYMM(created_at)
    TTL created_at + INTERVAL 1 YEAR
    SETTINGS index_granularity = 8192;
  `;

  try {
    await clickhouseClient.command({ query });
    console.log('ClickHouse events table initialized successfully');
  } catch (error) {
    console.error('Error initializing ClickHouse table:', error);
  }
}

// Event type definition
export interface Event {
  event_id?: string;
  event_type: string;
  product_id: number;
  user_session: string;
  event_metadata?: Record<string, any>; // Structured/semi-structured data
  created_at?: Date;
}

// Insert event into ClickHouse
export async function insertEvent(event: Event) {
  await clickhouseClient.insert({
    table: 'events',
    values: [
      {
        event_type: event.event_type,
        product_id: event.product_id,
        user_session: event.user_session,
        event_metadata: JSON.stringify(event.event_metadata || {}),
        created_at: event.created_at || new Date(),
      },
    ],
    format: 'JSONEachRow',
  });
}

// Query events
export async function queryEvents(conditions?: { 
  event_type?: string; 
  product_id?: number; 
  user_session?: string;
  limit?: number;
}) {
  let query = 'SELECT * FROM events WHERE 1=1';
  const params: any = {};

  if (conditions?.event_type) {
    query += ' AND event_type = {event_type:String}';
    params.event_type = conditions.event_type;
  }

  if (conditions?.product_id) {
    query += ' AND product_id = {product_id:Int32}';
    params.product_id = conditions.product_id;
  }

  if (conditions?.user_session) {
    query += ' AND user_session = {user_session:String}';
    params.user_session = conditions.user_session;
  }

  query += ' ORDER BY created_at DESC';

  if (conditions?.limit) {
    query += ' LIMIT {limit:Int32}';
    params.limit = conditions.limit;
  }

  const resultSet = await clickhouseClient.query({
    query,
    query_params: params,
    format: 'JSONEachRow',
  });

  return await resultSet.json();
}
