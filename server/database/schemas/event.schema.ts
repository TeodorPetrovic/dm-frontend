import { int, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";

export const event = mysqlTable("event", {
    event_id: int("event_id").primaryKey().autoincrement(),
    event_type: varchar("event_type", { length: 50 }).notNull(), // 'view', 'add_to_cart', 'purchase', etc.
    product_id: int("product_id").notNull(),
    user_session: varchar("user_session", { length: 255 }), // Session identifier for tracking
    created_at: timestamp("created_at").defaultNow(),
});

export type Event = typeof event.$inferSelect;
export type NewEvent = typeof event.$inferInsert;
