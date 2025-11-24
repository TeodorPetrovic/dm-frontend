import { insertEvent } from "~~/server/database/clickhouse-connection";

export default defineEventHandler(async (event_handler) => {
  const body = await readBody(event_handler);
  
  if (!body.event_type || !body.product_id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields: event_type and product_id'
    });
  }

  try {
    await insertEvent({
      event_type: body.event_type,
      product_id: body.product_id,
      user_session: body.user_session || `anonymous_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      event_metadata: body.event_metadata || {},
      created_at: new Date(),
    });

    return { success: true };
  } catch (error) {
    console.error('Error tracking event:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to track event'
    });
  }
});
