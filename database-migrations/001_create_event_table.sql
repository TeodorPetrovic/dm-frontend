-- Migration: Create event tracking table
-- Description: This table stores user events for analytics and ML recommendations
-- Date: 2025-11-20

CREATE TABLE IF NOT EXISTS `event` (
    `event_id` INT PRIMARY KEY AUTO_INCREMENT,
    `event_type` VARCHAR(50) NOT NULL COMMENT 'Type of event: view, add_to_cart, purchase, etc.',
    `product_id` INT NOT NULL COMMENT 'ID of the product associated with the event',
    `user_session` VARCHAR(255) COMMENT 'Session identifier for tracking users across requests',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'When the event occurred'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create indexes for better query performance
CREATE INDEX idx_product_id ON `event`(`product_id`);
CREATE INDEX idx_user_session ON `event`(`user_session`);
CREATE INDEX idx_event_type ON `event`(`event_type`);
CREATE INDEX idx_created_at ON `event`(`created_at`);

-- Example queries:
-- Get all product views: SELECT * FROM event WHERE event_type = 'view';
-- Get events for a specific product: SELECT * FROM event WHERE product_id = 123;
-- Get user session history: SELECT * FROM event WHERE user_session = 'session_xyz';
