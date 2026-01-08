CREATE TABLE
  IF NOT EXISTS `newsletter_subscribers` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `consent` BOOLEAN NOT NULL DEFAULT TRUE,
    `subscribed_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================================
-- Table: admins
-- =====================================================
CREATE TABLE
  IF NOT EXISTS `admins` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `photo` VARCHAR(255) DEFAULT NULL,
    `reset_token` VARCHAR(255) DEFAULT NULL,
    `reset_token_expiry` TIMESTAMP NULL,
    `is_verified` BOOLEAN DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================================
-- Table: user
-- =====================================================
CREATE TABLE
  IF NOT EXISTS `user` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `username` VARCHAR(100) UNIQUE NULL,
    `password` VARCHAR(255) NOT NULL,
    `photo` VARCHAR(255) UNIQUE,
    `first_name` VARCHAR(100) NULL,
    `last_name` VARCHAR(100) NULL,
    `dob` DATE DEFAULT NULL,
    `phone` VARCHAR(20) DEFAULT NULL,
    `phone_number` VARCHAR(20) DEFAULT NULL,
    `anniversary` DATE DEFAULT NULL,
    `address` LONGTEXT CHARACTER
    SET
      utf8mb4 COLLATE utf8mb4_bin,
      `is_verified` TINYINT (1) DEFAULT 0,
      `status` ENUM ('Active', 'Inactive', 'Blocked') DEFAULT 'Active',
      `reset_token` VARCHAR(255) DEFAULT NULL,
      `reset_token_expiry` TIMESTAMP NULL,
      `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      `date_joined` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT `address_check` CHECK (json_valid (`address`))
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================================
-- Table: addresses
-- =====================================================
CREATE TABLE
  IF NOT EXISTS `addresses` (
    `address_id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `address_type` ENUM ('home', 'work', 'other') DEFAULT 'home',
    `full_name` VARCHAR(100) NOT NULL,
    `phone_number` VARCHAR(20) NOT NULL,
    `address_line_1` VARCHAR(255) NOT NULL,
    `address_line_2` VARCHAR(255) DEFAULT NULL,
    `city` VARCHAR(100) NOT NULL,
    `state` VARCHAR(100) NOT NULL,
    `postal_code` VARCHAR(20) NOT NULL,
    `country` VARCHAR(100) DEFAULT 'India',
    `is_default` BOOLEAN DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================================
-- Table: social_logins
-- =====================================================
CREATE TABLE
  IF NOT EXISTS `social_logins` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT DEFAULT NULL,
    `provider` ENUM ('google', 'facebook') DEFAULT NULL,
    `provider_id` VARCHAR(255) DEFAULT NULL,
    FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================================
-- Table: categories
-- =====================================================
CREATE TABLE
  IF NOT EXISTS `categories` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(200) NOT NULL,
    `slug` VARCHAR(200) UNIQUE NOT NULL,
    `headline` VARCHAR(300) DEFAULT NULL,
    `description` TEXT,
    `accent_gradient` VARCHAR(200) DEFAULT NULL,
    `hero_tagline` VARCHAR(200) DEFAULT NULL,
    `image_url` VARCHAR(255) DEFAULT NULL,
    `status` ENUM ('active', 'inactive') DEFAULT 'active',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================================
-- Table: products
-- =====================================================
CREATE TABLE
  IF NOT EXISTS `products` (
    `product_id` INT AUTO_INCREMENT PRIMARY KEY,
    `slug` VARCHAR(255) UNIQUE NULL,
    `category_id` INT NOT NULL,
    `name` VARCHAR(200) NOT NULL,
    `headline` VARCHAR(300) DEFAULT NULL,
    `price` DECIMAL(10, 2) NOT NULL CHECK (`price` >= 0),
    `original_price` DECIMAL(10, 2) DEFAULT NULL CHECK (`original_price` >= 0),
    `rating` DECIMAL(3, 2) DEFAULT 0.00 CHECK (
      `rating` >= 0
      AND `rating` <= 5
    ),
    `reviews_count` INT DEFAULT 0,
    `in_stock` BOOLEAN DEFAULT TRUE,
    `accent_gradient` VARCHAR(200) DEFAULT NULL,
    `notes` JSON DEFAULT NULL,
    `summary` TEXT NOT NULL,
    `description` TEXT NOT NULL,
    `benefits` JSON DEFAULT NULL,
    `key_ingredients` TEXT NOT NULL,
    `suitable_for` TEXT NOT NULL,
    `how_to_use` TEXT NOT NULL,
    `faqs` TEXT DEFAULT NULL,
    `hero_tagline` VARCHAR(300) DEFAULT NULL,
    `image` VARCHAR(100) DEFAULT NULL,
    `status` ENUM ('active', 'inactive') DEFAULT 'active',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================================
-- Table: product_images
-- =====================================================
CREATE TABLE
  IF NOT EXISTS `product_images` (
    `image_id` INT AUTO_INCREMENT PRIMARY KEY,
    `product_id` INT NOT NULL,
    `image_url` VARCHAR(500) NOT NULL,
    `alt_text` VARCHAR(200) DEFAULT NULL,
    `order` INT DEFAULT 0,
    `is_default` BOOLEAN DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================================
-- Table: offers
-- =====================================================
CREATE TABLE
  IF NOT EXISTS `offers` (
    `offer_id` INT AUTO_INCREMENT PRIMARY KEY,
    `offer_title` VARCHAR(255) DEFAULT NULL,
    `offer_description` TEXT,
    `discount_percent` INT DEFAULT 0,
    `valid_from` DATE DEFAULT NULL,
    `valid_to` DATE DEFAULT NULL,
    `status` ENUM ('active', 'inactive') DEFAULT 'active',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================================
-- Table: cart
-- =====================================================
CREATE TABLE
  IF NOT EXISTS `cart` (
    `cart_id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT DEFAULT NULL,
    `session_key` VARCHAR(40) DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
    UNIQUE KEY `unique_user_session` (`user_id`, `session_key`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================================
-- Table: cart_items
-- =====================================================
CREATE TABLE
  IF NOT EXISTS `cart_items` (
    `cart_item_id` INT AUTO_INCREMENT PRIMARY KEY,
    `cart_id` INT NOT NULL,
    `product_id` INT NOT NULL,
    `quantity` INT NOT NULL DEFAULT 1 CHECK (
      `quantity` >= 1
      AND `quantity` <= 99
    ),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`cart_id`) REFERENCES `cart` (`cart_id`) ON DELETE CASCADE,
    FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
    UNIQUE KEY `unique_cart_product` (`cart_id`, `product_id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================================
-- Table: wishlist
-- =====================================================
CREATE TABLE
  IF NOT EXISTS `wishlist` (
    `wishlist_id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `product_id` INT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
    UNIQUE KEY `unique_wishlist_item` (`user_id`, `product_id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================================
-- Table: orders
-- =====================================================
CREATE TABLE
  IF NOT EXISTS `orders` (
    `order_id` INT AUTO_INCREMENT PRIMARY KEY,
    `order_number` VARCHAR(50) UNIQUE NOT NULL,
    `user_id` INT DEFAULT NULL,
    `order_status` ENUM (
      'pending',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
      'returned'
    ) DEFAULT 'pending',
    `payment_status` ENUM ('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    `payment_id` VARCHAR(255) DEFAULT NULL,
    `payment_method` VARCHAR(50) DEFAULT NULL,
    `shipping_address` JSON DEFAULT NULL,
    `billing_address` JSON DEFAULT NULL,
    `discount_amount` DECIMAL(10, 2) DEFAULT 0,
    `shipping_fee` DECIMAL(10, 2) DEFAULT 0,
    `cod_fee` DECIMAL(10, 2) DEFAULT 0,
    `total_amount` DECIMAL(10, 2) NOT NULL,
    `applied_coupon` JSON DEFAULT NULL,
    `tracking_number` VARCHAR(100) DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE SET NULL
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================================
-- Table: order_items
-- =====================================================
CREATE TABLE
  IF NOT EXISTS `order_items` (
    `order_item_id` INT AUTO_INCREMENT PRIMARY KEY,
    `order_id` INT NOT NULL,
    `product_id` INT NOT NULL,
    `quantity` INT NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
    FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================================
-- Table: order_tracking
-- =====================================================
CREATE TABLE
  IF NOT EXISTS `order_tracking` (
    `tracking_id` INT AUTO_INCREMENT PRIMARY KEY,
    `order_id` INT NOT NULL,
    `status` ENUM (
      'pending',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
      'returned'
    ) NOT NULL,
    `description` TEXT,
    `location` VARCHAR(255) DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================================
-- Table: coupons
-- =====================================================
CREATE TABLE
  IF NOT EXISTS `coupons` (
    `coupon_id` INT AUTO_INCREMENT PRIMARY KEY,
    `code` VARCHAR(50) UNIQUE NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT,
    `discount_type` ENUM ('percentage', 'fixed') NOT NULL,
    `discount_value` DECIMAL(10, 2) NOT NULL,
    `min_order_amount` DECIMAL(10, 2) DEFAULT 0,
    `max_discount` DECIMAL(10, 2) DEFAULT NULL,
    `usage_limit` INT DEFAULT 1,
    `used_count` INT DEFAULT 0,
    `valid_from` DATE NOT NULL,
    `valid_to` DATE NOT NULL,
    `status` ENUM ('active', 'inactive') DEFAULT 'active',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================================
-- Table: coupon_usage
-- =====================================================
CREATE TABLE
  IF NOT EXISTS `coupon_usage` (
    `usage_id` INT AUTO_INCREMENT PRIMARY KEY,
    `coupon_id` INT NOT NULL,
    `user_id` INT DEFAULT NULL,
    `order_id` INT NOT NULL,
    `discount_amount` DECIMAL(10, 2) NOT NULL,
    `used_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`coupon_id`) ON DELETE CASCADE,
    FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE SET NULL,
    FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================================
-- Table: product_reviews
-- =====================================================
CREATE TABLE
  IF NOT EXISTS `product_reviews` (
    `review_id` INT AUTO_INCREMENT PRIMARY KEY,
    `product_id` INT NOT NULL,
    `user_id` INT NOT NULL,
    `rating` INT NOT NULL CHECK (
      `rating` >= 1
      AND `rating` <= 5
    ),
    `review_text` TEXT,
    `review_image` VARCHAR(500) DEFAULT NULL,
    `status` ENUM ('pending', 'approved', 'rejected') DEFAULT 'approved',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
    FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
    UNIQUE KEY `unique_user_product_review` (`user_id`, `product_id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================================
-- Table: review_likes
-- =====================================================
CREATE TABLE
  IF NOT EXISTS `review_likes` (
    `like_id` INT AUTO_INCREMENT PRIMARY KEY,
    `review_id` INT NOT NULL,
    `user_id` INT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`review_id`) REFERENCES `product_reviews` (`review_id`) ON DELETE CASCADE,
    FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
    UNIQUE KEY `unique_user_review_like` (`user_id`, `review_id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================================
-- Table: contact_submissions
-- =====================================================
CREATE TABLE
  IF NOT EXISTS `contact_submissions` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(200) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone_number` VARCHAR(15) DEFAULT '',
    `subject` VARCHAR(200) NOT NULL,
    `message` TEXT NOT NULL,
    `is_read` TINYINT (1) DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================================
-- Table: blogs
-- =====================================================
CREATE TABLE
  IF NOT EXISTS `blogs` (
    `blog_id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) UNIQUE NOT NULL,
    `subtitle` VARCHAR(255) DEFAULT NULL,
    `excerpt` TEXT DEFAULT NULL,
    `content` TEXT NOT NULL,
    `content_blocks` JSON DEFAULT NULL,
    `featured_image` VARCHAR(500) DEFAULT NULL,
    `thumbnail` VARCHAR(500) DEFAULT NULL,
    `author_id` INT NOT NULL,
    `author` VARCHAR(100) DEFAULT NULL,
    `status` ENUM ('draft', 'published', 'archived') DEFAULT 'draft',
    `meta_title` VARCHAR(255) DEFAULT NULL,
    `meta_description` TEXT,
    `tags` JSON DEFAULT NULL,
    `view_count` INT DEFAULT 0,
    `date` DATE DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`author_id`) REFERENCES `admins` (`id`) ON DELETE CASCADE
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================================
-- Table: notifications
-- =====================================================
CREATE TABLE
  IF NOT EXISTS `notifications` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `type` ENUM (
      'user_registered',
      'order_placed',
      'order_updated',
      'contact_submission',
      'system'
    ) NOT NULL DEFAULT 'system',
    `title` VARCHAR(255) NOT NULL,
    `message` TEXT NOT NULL,
    `related_id` INT DEFAULT NULL COMMENT 'ID of related entity (user_id, order_id, etc.)',
    `related_type` VARCHAR(50) DEFAULT NULL COMMENT 'Type of related entity (user, order, etc.)',
    `is_read` TINYINT (1) DEFAULT 0,
    `read_at` TIMESTAMP NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_type` (`type`),
    INDEX `idx_is_read` (`is_read`),
    INDEX `idx_created_at` (`created_at`),
    INDEX `idx_related` (`related_type`, `related_id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================================
-- Table: analytics_sessions
-- =====================================================
CREATE TABLE
  IF NOT EXISTS `analytics_sessions` (
    `id` VARCHAR(255) PRIMARY KEY,
    `user_id` INT NULL,
    `guest_email` VARCHAR(255) NULL,
    `guest_name` VARCHAR(255) NULL,
    `guest_phone` VARCHAR(20) NULL,
    `device_type` ENUM ('mobile', 'desktop', 'tablet', 'other') DEFAULT 'desktop',
    `browser` VARCHAR(100),
    `os` VARCHAR(100),
    `location_country` VARCHAR(100),
    `location_state` VARCHAR(100),
    `location_city` VARCHAR(100),
    `referrer_url` TEXT,
    `referrer_source` VARCHAR(100), -- Direct, Social, Search
    `utm_source` VARCHAR(100),
    `utm_medium` VARCHAR(100),
    `utm_campaign` VARCHAR(100),
    `landing_page` VARCHAR(255),
    `ip_address` VARCHAR(45),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_created_at` (`created_at`),
    INDEX `idx_utm` (`utm_source`, `utm_medium`),
    FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE SET NULL
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================================
-- Table: analytics_events
-- =====================================================
CREATE TABLE
  IF NOT EXISTS `analytics_events` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `session_id` VARCHAR(255),
    `event_type` ENUM (
      'page_view',
      'add_to_cart',
      'reached_checkout',
      'purchase'
    ),
    `page_path` VARCHAR(255),
    `product_id` INT NULL,
    `order_id` INT NULL,
    `metadata` JSON, -- Store additional info
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_session_id` (`session_id`),
    INDEX `idx_event_type` (`event_type`),
    INDEX `idx_created_at` (`created_at`),
    FOREIGN KEY (`session_id`) REFERENCES `analytics_sessions` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE SET NULL,
    FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE SET NULL
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;