-- =====================================================
-- VERIFICATION QUERIES - Run these in phpMyAdmin to verify changes
-- =====================================================

-- 1. Check Products table - Should have slug column
DESCRIBE `products`;

-- 2. Check User table - Should NOT have name, should have first_name, last_name, etc.
DESCRIBE `user`;

-- 3. Check Blogs table - Should have new columns
DESCRIBE `blogs`;

-- 4. Verify name column is removed from user table
SELECT COLUMN_NAME 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'myura_wellness' 
  AND TABLE_NAME = 'user' 
  AND COLUMN_NAME = 'name';
-- Should return 0 rows (name column should not exist)

-- 5. Verify new columns exist in user table
SELECT COLUMN_NAME 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'myura_wellness' 
  AND TABLE_NAME = 'user' 
  AND COLUMN_NAME IN ('username', 'first_name', 'last_name', 'phone_number', 'date_joined');
-- Should return 5 rows

-- 6. Verify new columns exist in products table
SELECT COLUMN_NAME 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'myura_wellness' 
  AND TABLE_NAME = 'products' 
  AND COLUMN_NAME = 'slug';
-- Should return 1 row

-- 7. Verify new columns exist in blogs table
SELECT COLUMN_NAME 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'myura_wellness' 
  AND TABLE_NAME = 'blogs' 
  AND COLUMN_NAME IN ('subtitle', 'excerpt', 'author', 'thumbnail', 'content_blocks', 'date');
-- Should return 6 rows

-- 8. Check sample data migration (if any users exist)
SELECT id, email, first_name, last_name, username, phone_number, date_joined 
FROM `user` 
LIMIT 5;

-- 9. Check sample blog data migration (if any blogs exist)
SELECT blog_id, title, subtitle, excerpt, author, thumbnail, date 
FROM `blogs` 
LIMIT 5;

