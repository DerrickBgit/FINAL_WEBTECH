-- Step 1: Add user_id columns as nullable first (only if they don't exist)
SET @dbname = DATABASE();

-- Add user_id to categories if it doesn't exist
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'categories' AND COLUMN_NAME = 'user_id'
  ) > 0,
  'SELECT 1',
  'ALTER TABLE `categories` ADD COLUMN `user_id` INTEGER NULL'
));
PREPARE stmt FROM @preparedStatement;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add user_id to items if it doesn't exist
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'items' AND COLUMN_NAME = 'user_id'
  ) > 0,
  'SELECT 1',
  'ALTER TABLE `items` ADD COLUMN `user_id` INTEGER NULL'
));
PREPARE stmt FROM @preparedStatement;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add user_id to sales if it doesn't exist
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'sales' AND COLUMN_NAME = 'user_id'
  ) > 0,
  'SELECT 1',
  'ALTER TABLE `sales` ADD COLUMN `user_id` INTEGER NULL'
));
PREPARE stmt FROM @preparedStatement;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Step 2: Assign existing data to admin user (or first user if admin doesn't exist)
UPDATE `categories` SET `user_id` = COALESCE(
  (SELECT id FROM `users` WHERE email = 'admin@inventory.com' LIMIT 1),
  (SELECT id FROM `users` ORDER BY id LIMIT 1)
) WHERE `user_id` IS NULL;

UPDATE `items` SET `user_id` = COALESCE(
  (SELECT id FROM `users` WHERE email = 'admin@inventory.com' LIMIT 1),
  (SELECT id FROM `users` ORDER BY id LIMIT 1)
) WHERE `user_id` IS NULL;

UPDATE `sales` SET `user_id` = COALESCE(
  (SELECT id FROM `users` WHERE email = 'admin@inventory.com' LIMIT 1),
  (SELECT id FROM `users` ORDER BY id LIMIT 1)
) WHERE `user_id` IS NULL;

-- Step 3: Make user_id required
ALTER TABLE `categories` MODIFY COLUMN `user_id` INTEGER NOT NULL;
ALTER TABLE `items` MODIFY COLUMN `user_id` INTEGER NOT NULL;
ALTER TABLE `sales` MODIFY COLUMN `user_id` INTEGER NOT NULL;

-- Step 4: Remove old unique constraints (only if they exist)
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
    WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'categories' AND INDEX_NAME = 'categories_name_key'
  ) > 0,
  'ALTER TABLE `categories` DROP INDEX `categories_name_key`',
  'SELECT 1'
));
PREPARE stmt FROM @preparedStatement;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
    WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'items' AND INDEX_NAME = 'items_sku_key'
  ) > 0,
  'ALTER TABLE `items` DROP INDEX `items_sku_key`',
  'SELECT 1'
));
PREPARE stmt FROM @preparedStatement;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Step 5: Add foreign keys (only if they don't exist)
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
    WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'categories' AND CONSTRAINT_NAME = 'categories_user_id_fkey'
  ) > 0,
  'SELECT 1',
  'ALTER TABLE `categories` ADD CONSTRAINT `categories_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE'
));
PREPARE stmt FROM @preparedStatement;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
    WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'items' AND CONSTRAINT_NAME = 'items_user_id_fkey'
  ) > 0,
  'SELECT 1',
  'ALTER TABLE `items` ADD CONSTRAINT `items_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE'
));
PREPARE stmt FROM @preparedStatement;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
    WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'sales' AND CONSTRAINT_NAME = 'sales_user_id_fkey'
  ) > 0,
  'SELECT 1',
  'ALTER TABLE `sales` ADD CONSTRAINT `sales_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE'
));
PREPARE stmt FROM @preparedStatement;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Step 6: Add new composite unique constraints (only if they don't exist)
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
    WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'categories' AND INDEX_NAME = 'categories_user_id_name_key'
  ) > 0,
  'SELECT 1',
  'CREATE UNIQUE INDEX `categories_user_id_name_key` ON `categories`(`user_id`, `name`)'
));
PREPARE stmt FROM @preparedStatement;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
    WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'items' AND INDEX_NAME = 'items_user_id_sku_key'
  ) > 0,
  'SELECT 1',
  'CREATE UNIQUE INDEX `items_user_id_sku_key` ON `items`(`user_id`, `sku`)'
));
PREPARE stmt FROM @preparedStatement;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
