-- Step 1: Add user_id columns as nullable first
ALTER TABLE `categories` ADD COLUMN `user_id` INTEGER NULL;
ALTER TABLE `items` ADD COLUMN `user_id` INTEGER NULL;
ALTER TABLE `sales` ADD COLUMN `user_id` INTEGER NULL;

-- Step 2: Assign existing data to admin user (assuming admin is user ID 1)
-- If admin doesn't exist or has different ID, this will need adjustment
UPDATE `categories` SET `user_id` = (SELECT id FROM `users` WHERE email = 'admin@inventory.com' LIMIT 1) WHERE `user_id` IS NULL;
UPDATE `items` SET `user_id` = (SELECT id FROM `users` WHERE email = 'admin@inventory.com' LIMIT 1) WHERE `user_id` IS NULL;
UPDATE `sales` SET `user_id` = (SELECT id FROM `users` WHERE email = 'admin@inventory.com' LIMIT 1) WHERE `user_id` IS NULL;
 
-- Step 3: If no admin exists, assign to first user
UPDATE `categories` SET `user_id` = (SELECT id FROM `users` ORDER BY id LIMIT 1) WHERE `user_id` IS NULL;
UPDATE `items` SET `user_id` = (SELECT id FROM `users` ORDER BY id LIMIT 1) WHERE `user_id` IS NULL;
UPDATE `sales` SET `user_id` = (SELECT id FROM `users` ORDER BY id LIMIT 1) WHERE `user_id` IS NULL;

-- Step 4: Make user_id required
ALTER TABLE `categories` MODIFY COLUMN `user_id` INTEGER NOT NULL;
ALTER TABLE `items` MODIFY COLUMN `user_id` INTEGER NOT NULL;
ALTER TABLE `sales` MODIFY COLUMN `user_id` INTEGER NOT NULL;

-- Step 5: Remove old unique constraints
ALTER TABLE `categories` DROP INDEX `categories_name_key`;
ALTER TABLE `items` DROP INDEX `items_sku_key`;

-- Step 6: Add foreign keys
ALTER TABLE `categories` ADD CONSTRAINT `categories_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `items` ADD CONSTRAINT `items_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `sales` ADD CONSTRAINT `sales_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- Step 7: Add new composite unique constraints
CREATE UNIQUE INDEX `categories_user_id_name_key` ON `categories`(`user_id`, `name`);
CREATE UNIQUE INDEX `items_user_id_sku_key` ON `items`(`user_id`, `sku`);

