-- =====================================================
-- MIGRATION: Add Missing Columns Based on Schema Comparison
-- =====================================================
-- This file contains ALTER TABLE statements to add missing columns
-- Execute these queries in phpMyAdmin to update your database schema
-- =====================================================
-- =====================================================
-- 1. PRODUCTS TABLE - Add slug column
-- =====================================================
ALTER TABLE `products`
ADD COLUMN `slug` VARCHAR(255) UNIQUE NULL AFTER `product_id`;

-- Update existing products to generate slugs from names (optional)
-- UPDATE `products` SET `slug` = LOWER(REPLACE(REPLACE(REPLACE(`name`, ' ', '-'), '(', ''), ')', '')) WHERE `slug` IS NULL;
-- =====================================================
-- 2. USER TABLE - Add missing user fields and remove name
-- =====================================================
-- Step 1: Add new columns
ALTER TABLE `user`
ADD COLUMN `username` VARCHAR(100) UNIQUE NULL AFTER `email`,
ADD COLUMN `first_name` VARCHAR(100) NULL AFTER `name`,
ADD COLUMN `last_name` VARCHAR(100) NULL AFTER `first_name`,
ADD COLUMN `phone_number` VARCHAR(20) NULL AFTER `phone`,
ADD COLUMN `date_joined` TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER `created_at`;

-- Step 2: Migrate existing data
UPDATE `user`
SET
    `phone_number` = `phone`
WHERE
    `phone_number` IS NULL
    AND `phone` IS NOT NULL;

UPDATE `user`
SET
    `date_joined` = `created_at`
WHERE
    `date_joined` IS NULL;

UPDATE `user`
SET
    `first_name` = SUBSTRING_INDEX (`name`, ' ', 1)
WHERE
    `first_name` IS NULL
    AND `name` IS NOT NULL;

UPDATE `user`
SET
    `last_name` = SUBSTRING_INDEX (`name`, ' ', -1)
WHERE
    `last_name` IS NULL
    AND `name` IS NOT NULL
    AND `name` LIKE '% %';

-- Step 3: Remove name column (after data migration)
ALTER TABLE `user`
DROP COLUMN `name`;

-- =====================================================
-- 3. BLOGS TABLE - Add missing blog fields
-- =====================================================
ALTER TABLE `blogs`
ADD COLUMN `subtitle` VARCHAR(255) NULL AFTER `title`,
ADD COLUMN `excerpt` TEXT NULL AFTER `subtitle`,
ADD COLUMN `author` VARCHAR(100) NULL AFTER `author_id`,
ADD COLUMN `thumbnail` VARCHAR(500) NULL AFTER `featured_image`,
ADD COLUMN `content_blocks` JSON NULL AFTER `content`,
ADD COLUMN `date` DATE NULL AFTER `created_at`;

-- Copy existing data to new columns (optional)
-- UPDATE `blogs` SET `thumbnail` = `featured_image` WHERE `thumbnail` IS NULL AND `featured_image` IS NOT NULL;
-- UPDATE `blogs` SET `date` = DATE(`created_at`) WHERE `date` IS NULL;
-- UPDATE `blogs` b
-- INNER JOIN `admins` a ON b.author_id = a.id
-- SET b.author = a.name
-- WHERE b.author IS NULL;
-- =====================================================
-- NOTES:
-- =====================================================
-- 1. After running these ALTER TABLE statements, update your controllers
--    to handle the new fields in create/update operations.
-- 
-- 2. The UPDATE statements (commented out) are optional and help migrate
--    existing data to new columns. Uncomment and run them if needed.
--
-- 3. For `user.phone_number`: You can keep both `phone` and `phone_number`
--    or migrate all data to `phone_number` and drop `phone` later.
--
-- 4. For `blogs.author`: This can be populated by joining with `admins` table
--    in your API, or you can store it directly. The UPDATE statement above
--    populates it from the admins table.
--
-- 5. For `blogs.content_blocks`: If you want to store structured content,
--    use this JSON field. Otherwise, keep using the `content` TEXT field.
--
-- 6. All new columns are nullable to avoid breaking existing data.
--    You can add NOT NULL constraints later after data migration.
-- =====================================================