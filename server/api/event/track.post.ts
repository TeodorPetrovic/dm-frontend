import { db } from "~~/server/database/connection";
import { event } from "~~/server/database/schemas/event.schema";

export default defineEventHandler(async (event_handler) => {
  const body = await readBody(event_handler);
  
  if (!body.event_type || !body.product_id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields: event_type and product_id'
    });
  }

  const newEvent = await db.insert(event).values({
    event_type: body.event_type,
    product_id: body.product_id,
    user_session: body.user_session || null,
  });

  return { success: true, event_id: newEvent[0].insertId };
});
