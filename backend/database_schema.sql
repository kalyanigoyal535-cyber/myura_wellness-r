-- =====================================================
-- Table: api_user (Custom User Model)
-- =====================================================
CREATE TABLE
    IF NOT EXISTS `api_user` (
        `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
        `password` VARCHAR(128) NOT NULL,
        `last_login` DATETIME (6) NULL,
        `is_superuser` TINYINT (1) NOT NULL DEFAULT 0,
        `username` VARCHAR(150) NOT NULL,
        `first_name` VARCHAR(150) NOT NULL DEFAULT '',
        `last_name` VARCHAR(150) NOT NULL DEFAULT '',
        `is_staff` TINYINT (1) NOT NULL DEFAULT 0,
        `is_active` TINYINT (1) NOT NULL DEFAULT 1,
        `date_joined` DATETIME (6) NOT NULL,
        `email` VARCHAR(255) NOT NULL UNIQUE,
        `phone_number` VARCHAR(15) NULL,
        `created_at` DATETIME (6) NOT NULL,
        `updated_at` DATETIME (6) NOT NULL,
        INDEX `idx_email` (`email`),
        INDEX `idx_username` (`username`)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================================
-- Table: api_productcategory
-- =====================================================
CREATE TABLE
    IF NOT EXISTS `api_productcategory` (
        `id` VARCHAR(200) PRIMARY KEY,
        `name` VARCHAR(200) NOT NULL,
        `headline` VARCHAR(300) NOT NULL DEFAULT '',
        `description` TEXT NOT NULL,
        `accent_gradient` VARCHAR(200) NOT NULL DEFAULT '',
        `hero_tagline` VARCHAR(200) NOT NULL DEFAULT '',
        `image` VARCHAR(100) NULL,
        `created_at` DATETIME (6) NOT NULL,
        INDEX `idx_name` (`name`)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================================
-- Table: api_product
-- =====================================================
CREATE TABLE
    IF NOT EXISTS `api_product` (
        `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
        `category_id` VARCHAR(200) NOT NULL,
        `name` VARCHAR(200) NOT NULL,
        `headline` VARCHAR(300) NOT NULL DEFAULT '',
        `price` DECIMAL(10, 2) NOT NULL,
        `original_price` DECIMAL(10, 2) NULL,
        `rating` DECIMAL(3, 2) NOT NULL DEFAULT 0.00,
        `reviews_count` INT NOT NULL DEFAULT 0,
        `in_stock` TINYINT (1) NOT NULL DEFAULT 1,
        `accent_gradient` VARCHAR(200) NOT NULL DEFAULT '',
        `notes` JSON NULL,
        `summary` TEXT NOT NULL,
        `description` TEXT NOT NULL,
        `benefits` JSON NULL,
        `key_ingredients` TEXT NOT NULL,
        `suitable_for` TEXT NOT NULL,
        `how_to_use` TEXT NOT NULL,
        `faqs` TEXT NOT NULL,
        `hero_tagline` VARCHAR(300) NOT NULL DEFAULT '',
        `image` VARCHAR(100) NULL,
        `created_at` DATETIME (6) NOT NULL,
        `updated_at` DATETIME (6) NOT NULL,
        FOREIGN KEY (`category_id`) REFERENCES `api_productcategory` (`id`) ON DELETE CASCADE,
        INDEX `idx_category` (`category_id`),
        INDEX `idx_name` (`name`),
        INDEX `idx_created_at` (`created_at`),
        INDEX `idx_in_stock` (`in_stock`),
        CHECK (`price` >= 0),
        CHECK (
            `original_price` IS NULL
            OR `original_price` >= 0
        ),
        CHECK (
            `rating` >= 0
            AND `rating` <= 5
        )
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================================
-- Table: api_productimage
-- =====================================================
CREATE TABLE
    IF NOT EXISTS `api_productimage` (
        `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
        `product_id` BIGINT NOT NULL,
        `image` VARCHAR(100) NOT NULL,
        `alt_text` VARCHAR(200) NOT NULL DEFAULT '',
        `order` INT NOT NULL DEFAULT 0,
        `created_at` DATETIME (6) NOT NULL,
        FOREIGN KEY (`product_id`) REFERENCES `api_product` (`id`) ON DELETE CASCADE,
        INDEX `idx_product` (`product_id`),
        INDEX `idx_order` (`order`, `created_at`)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================================
-- Table: api_cart
-- =====================================================
CREATE TABLE
    IF NOT EXISTS `api_cart` (
        `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
        `user_id` BIGINT NULL,
        `session_key` VARCHAR(40) NULL,
        `created_at` DATETIME (6) NOT NULL,
        `updated_at` DATETIME (6) NOT NULL,
        FOREIGN KEY (`user_id`) REFERENCES `api_user` (`id`) ON DELETE CASCADE,
        UNIQUE KEY `unique_user_session` (`user_id`, `session_key`),
        INDEX `idx_user` (`user_id`),
        INDEX `idx_session` (`session_key`),
        INDEX `idx_updated_at` (`updated_at`)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================================
-- Table: api_cartitem
-- =====================================================
CREATE TABLE
    IF NOT EXISTS `api_cartitem` (
        `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
        `cart_id` BIGINT NOT NULL,
        `product_id` BIGINT NOT NULL,
        `quantity` INT NOT NULL DEFAULT 1,
        `created_at` DATETIME (6) NOT NULL,
        FOREIGN KEY (`cart_id`) REFERENCES `api_cart` (`id`) ON DELETE CASCADE,
        FOREIGN KEY (`product_id`) REFERENCES `api_product` (`id`) ON DELETE CASCADE,
        UNIQUE KEY `unique_cart_product` (`cart_id`, `product_id`),
        INDEX `idx_cart` (`cart_id`),
        INDEX `idx_product` (`product_id`),
        INDEX `idx_created_at` (`created_at`),
        CHECK (
            `quantity` >= 1
            AND `quantity` <= 99
        )
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================================
-- Table: api_address
-- =====================================================
CREATE TABLE
    IF NOT EXISTS `api_address` (
        `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
        `user_id` BIGINT NOT NULL,
        `address_type` VARCHAR(10) NOT NULL DEFAULT 'home',
        `full_name` VARCHAR(200) NOT NULL,
        `phone_number` VARCHAR(15) NOT NULL,
        `address_line_1` VARCHAR(300) NOT NULL,
        `address_line_2` VARCHAR(300) NOT NULL DEFAULT '',
        `city` VARCHAR(100) NOT NULL,
        `state` VARCHAR(100) NOT NULL,
        `postal_code` VARCHAR(20) NOT NULL,
        `country` VARCHAR(100) NOT NULL DEFAULT 'India',
        `is_default` TINYINT (1) NOT NULL DEFAULT 0,
        `created_at` DATETIME (6) NOT NULL,
        FOREIGN KEY (`user_id`) REFERENCES `api_user` (`id`) ON DELETE CASCADE,
        INDEX `idx_user` (`user_id`),
        INDEX `idx_is_default` (`is_default`, `created_at`),
        CHECK (`address_type` IN ('home', 'work', 'other'))
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================================
-- Table: api_order
-- =====================================================
CREATE TABLE
    IF NOT EXISTS `api_order` (
        `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
        `user_id` BIGINT NULL,
        `order_number` VARCHAR(50) NOT NULL UNIQUE,
        `status` VARCHAR(20) NOT NULL DEFAULT 'pending',
        `total_amount` DECIMAL(10, 2) NOT NULL,
        `shipping_address` JSON NOT NULL,
        `payment_status` VARCHAR(20) NOT NULL DEFAULT 'pending',
        `payment_method` VARCHAR(50) NOT NULL DEFAULT '',
        `payment_id` VARCHAR(200) NOT NULL DEFAULT '',
        `created_at` DATETIME (6) NOT NULL,
        `updated_at` DATETIME (6) NOT NULL,
        FOREIGN KEY (`user_id`) REFERENCES `api_user` (`id`) ON DELETE SET NULL,
        INDEX `idx_user` (`user_id`),
        INDEX `idx_order_number` (`order_number`),
        INDEX `idx_status` (`status`),
        INDEX `idx_payment_status` (`payment_status`),
        INDEX `idx_created_at` (`created_at`),
        CHECK (
            `status` IN (
                'pending',
                'processing',
                'shipped',
                'delivered',
                'cancelled'
            )
        ),
        CHECK (
            `payment_status` IN ('pending', 'paid', 'failed', 'refunded')
        )
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================================
-- Table: api_orderitem
-- =====================================================
CREATE TABLE
    IF NOT EXISTS `api_orderitem` (
        `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
        `order_id` BIGINT NOT NULL,
        `product_id` BIGINT NOT NULL,
        `quantity` INT NOT NULL,
        `price` DECIMAL(10, 2) NOT NULL,
        `created_at` DATETIME (6) NOT NULL,
        FOREIGN KEY (`order_id`) REFERENCES `api_order` (`id`) ON DELETE CASCADE,
        FOREIGN KEY (`product_id`) REFERENCES `api_product` (`id`) ON DELETE CASCADE,
        INDEX `idx_order` (`order_id`),
        INDEX `idx_product` (`product_id`)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================================
-- Table: api_contactsubmission
-- =====================================================
CREATE TABLE
    IF NOT EXISTS `api_contactsubmission` (
        `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
        `name` VARCHAR(200) NOT NULL,
        `email` VARCHAR(255) NOT NULL,
        `phone_number` VARCHAR(15) NOT NULL DEFAULT '',
        `subject` VARCHAR(200) NOT NULL,
        `message` TEXT NOT NULL,
        `is_read` TINYINT (1) NOT NULL DEFAULT 0,
        `created_at` DATETIME (6) NOT NULL,
        INDEX `idx_email` (`email`),
        INDEX `idx_is_read` (`is_read`),
        INDEX `idx_created_at` (`created_at`)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
