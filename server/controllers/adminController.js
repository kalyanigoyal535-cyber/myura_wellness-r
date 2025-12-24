import pool from '../config/database.js';
import bcrypt from 'bcryptjs';
import { sendSuccess, sendError, sendNotFound, sendBadRequest } from '../utils/response.js';
import { buildUpdateQuery, executeQuery } from '../utils/query.js';
import { processImage, deleteImage } from '../utils/imageProcessor.js';

// Dashboard Stats
export const getDashboardStats = async (req, res) => {
  try {
    // Overview stats
    const [userCount] = await pool.execute(
      'SELECT COUNT(*) as count FROM user'
    );
    const [productCount] = await pool.execute('SELECT COUNT(*) as count FROM products');
    const [orderCount] = await pool.execute('SELECT COUNT(*) as count FROM orders');
    const [revenueResult] = await pool.execute(
      "SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE payment_status = 'paid'"
    );

    // Monthly stats
    const [monthlyOrders] = await pool.execute(
      "SELECT COUNT(*) as count FROM orders WHERE MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE())"
    );
    const [lastMonthOrders] = await pool.execute(
      "SELECT COUNT(*) as count FROM orders WHERE MONTH(created_at) = MONTH(DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH)) AND YEAR(created_at) = YEAR(DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH))"
    );
    const [monthlyRevenue] = await pool.execute(
      "SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE payment_status = 'paid' AND MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE())"
    );
    const [lastMonthRevenue] = await pool.execute(
      "SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE payment_status = 'paid' AND MONTH(created_at) = MONTH(DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH)) AND YEAR(created_at) = YEAR(DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH))"
    );

    // Recent orders
    const [recentOrders] = await pool.execute(
      `SELECT o.*, u.email as user_email 
       FROM orders o 
       LEFT JOIN user u ON o.user_id = u.id 
       ORDER BY o.created_at DESC 
       LIMIT 10`
    );

    // Pending contacts
    const [pendingContacts] = await pool.execute(
      "SELECT COUNT(*) as count FROM contact_submissions WHERE is_read = 0"
    );

    const ordersGrowth = monthlyOrders[0].count - lastMonthOrders[0].count;
    const revenueGrowth = parseFloat(monthlyRevenue[0].total) - parseFloat(lastMonthRevenue[0].total);

    return sendSuccess(res, {
      overview: {
        total_users: userCount[0].count,
        total_products: productCount[0].count,
        total_orders: orderCount[0].count,
        total_revenue: parseFloat(revenueResult[0].total),
      },
      monthly: {
        orders: monthlyOrders[0].count,
        orders_growth: ordersGrowth,
        revenue: parseFloat(monthlyRevenue[0].total),
        revenue_growth: revenueGrowth,
      },
      recent_orders: recentOrders.map(order => ({
        order_id: order.order_id,
        id: order.order_id, // Keep for compatibility
        order_number: order.order_number,
        user_email: order.user_email,
        total_amount: parseFloat(order.total_amount),
        order_status: order.order_status,
        status: order.order_status, // Keep for compatibility
        payment_status: order.payment_status,
        created_at: order.created_at,
      })),
      pending_contacts: pendingContacts[0].count,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return sendError(res, 'Failed to fetch dashboard stats', 500);
  }
};

// Products
export const getProducts = async (req, res) => {
  try {
    const [products] = await pool.execute(
      `SELECT p.*, c.name as category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       ORDER BY p.created_at DESC`
    );

    return sendSuccess(res, {
      count: products.length,
      results: products.map(p => ({
        ...p,
        id: p.product_id,
        price: parseFloat(p.price),
        original_price: p.original_price ? parseFloat(p.original_price) : null,
        rating: parseFloat(p.rating),
        notes: JSON.parse(p.notes || '[]'),
        benefits: JSON.parse(p.benefits || '[]'),
      })),
    });
  } catch (error) {
    console.error('Get admin products error:', error);
    return sendError(res, 'Failed to fetch products', 500);
  }
};

export const getProduct = async (req, res) => {
  try {
    const [products] = await pool.execute(
      'SELECT * FROM products WHERE product_id = ?',
      [req.params.id]
    );

    if (products.length === 0) {
      return sendNotFound(res, 'Product');
    }

    const product = products[0];
    
    // Get category info
    const [categories] = await pool.execute(
      'SELECT * FROM categories WHERE id = ?',
      [product.category_id]
    );

    return sendSuccess(res, {
      ...product,
      product_id: product.product_id,
      id: product.product_id, // Keep for compatibility
      price: parseFloat(product.price),
      original_price: product.original_price ? parseFloat(product.original_price) : null,
      rating: parseFloat(product.rating),
      notes: JSON.parse(product.notes || '[]'),
      benefits: JSON.parse(product.benefits || '[]'),
      image_url: product.image ? `${req.protocol}://${req.get('host')}/uploads/${product.image}` : null,
      category: categories.length > 0 ? categories[0] : null,
    });
  } catch (error) {
    console.error('Get admin product error:', error);
    return sendError(res, 'Failed to fetch product', 500);
  }
};

export const createProduct = async (req, res) => {
  try {
    const {
      category, slug, name, headline, price, original_price, rating, reviews_count,
      in_stock, accent_gradient, summary, description, key_ingredients,
      suitable_for, how_to_use, faqs, hero_tagline, notes, benefits
    } = req.body;

    let imageName = null;
    if (req.file) {
      imageName = await processImage(req.file.buffer, 'products', {
        maxWidth: 1920,
        maxHeight: 1920,
        quality: 85,
        format: 'jpeg'
      });
    }

    // Generate slug from name if not provided
    let productSlug = slug;
    if (!productSlug && name) {
      productSlug = name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    const [result] = await pool.execute(
      `INSERT INTO products (
        category_id, slug, name, headline, price, original_price, rating, reviews_count,
        in_stock, accent_gradient, summary, description, key_ingredients,
        suitable_for, how_to_use, faqs, hero_tagline, notes, benefits, image
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        category, productSlug || null, name, headline, price, original_price || null, rating || 0, reviews_count || 0,
        in_stock !== undefined ? in_stock : 1, accent_gradient || '', summary, description,
        key_ingredients, suitable_for, how_to_use, faqs, hero_tagline || '',
        JSON.stringify(notes ? (Array.isArray(notes) ? notes : notes.split('\n').filter(n => n.trim())) : []),
        JSON.stringify(benefits ? (Array.isArray(benefits) ? benefits : benefits.split('\n').filter(b => b.trim())) : []),
        imageName
      ]
    );

    return sendSuccess(res, { product_id: result.insertId }, 'Product created successfully', 201);
  } catch (error) {
    console.error('Create product error:', error);
    return sendError(res, 'Failed to create product', 500);
  }
};

export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const allowedFields = [
      'category', 'slug', 'name', 'headline', 'price', 'original_price', 'rating', 'reviews_count',
      'in_stock', 'accent_gradient', 'summary', 'description', 'key_ingredients',
      'suitable_for', 'how_to_use', 'faqs', 'hero_tagline', 'notes', 'benefits'
    ];

    // Get old image path before update
    const [oldProducts] = await pool.execute(
      'SELECT image FROM products WHERE product_id = ?',
      [productId]
    );
    const oldImagePath = oldProducts.length > 0 ? oldProducts[0].image : null;

    const { updateFields, values } = await buildUpdateQuery(allowedFields, req.body, req.file, 'products');

    if (updateFields.length === 0) {
      return sendBadRequest(res, 'No fields to update');
    }

    values.push(productId);

    await pool.execute(
      `UPDATE products SET ${updateFields.join(', ')} WHERE product_id = ?`,
      values
    );

    // Delete old image if new image was uploaded
    if (req.file && oldImagePath) {
      await deleteImage(oldImagePath);
    }

    return sendSuccess(res, {}, 'Product updated successfully');
  } catch (error) {
    console.error('Update product error:', error);
    return sendError(res, 'Failed to update product', 500);
  }
};

export const deleteProduct = async (req, res) => {
  try {
    // Get image path before deletion
    const [products] = await pool.execute(
      'SELECT image FROM products WHERE product_id = ?',
      [req.params.id]
    );
    const imagePath = products.length > 0 ? products[0].image : null;

    await pool.execute('DELETE FROM products WHERE product_id = ?', [req.params.id]);

    // Delete associated image
    if (imagePath) {
      await deleteImage(imagePath);
    }

    return sendSuccess(res, {}, 'Product deleted successfully');
  } catch (error) {
    console.error('Delete product error:', error);
    return sendError(res, 'Failed to delete product', 500);
  }
};

// Categories
export const getCategories = async (req, res) => {
  try {
    const [categories] = await pool.execute(
      'SELECT c.*, COUNT(p.product_id) as products_count FROM categories c LEFT JOIN products p ON c.id = p.category_id GROUP BY c.id ORDER BY c.name'
    );

    return sendSuccess(res, {
      count: categories.length,
      results: categories.map(c => ({
        ...c,
        products_count: parseInt(c.products_count),
      })),
    });
  } catch (error) {
    console.error('Get admin categories error:', error);
    return sendError(res, 'Failed to fetch categories', 500);
  }
};

export const getCategory = async (req, res) => {
  try {
    const [categories] = await pool.execute(
      'SELECT * FROM categories WHERE id = ?',
      [req.params.id]
    );

    if (categories.length === 0) {
      return sendNotFound(res, 'Category');
    }

    return sendSuccess(res, categories[0]);
  } catch (error) {
    console.error('Get admin category error:', error);
    return sendError(res, 'Failed to fetch category', 500);
  }
};

export const createCategory = async (req, res) => {
  try {
    const { id, name, headline, description, accent_gradient, hero_tagline } = req.body;
    
    let imageName = null;
    if (req.file) {
      imageName = await processImage(req.file.buffer, 'categories', {
        maxWidth: 1920,
        maxHeight: 1920,
        quality: 85,
        format: 'jpeg'
      });
    }

    await pool.execute(
      'INSERT INTO categories (id, name, headline, description, accent_gradient, hero_tagline, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, name, headline || '', description || '', accent_gradient || '', hero_tagline || '', imageName]
    );

    return sendSuccess(res, {}, 'Category created successfully', 201);
  } catch (error) {
    console.error('Create category error:', error);
    return sendError(res, 'Failed to create category', 500);
  }
};

export const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const allowedFields = ['name', 'headline', 'description', 'accent_gradient', 'hero_tagline'];
    
    // Get old image path before update
    const [oldCategories] = await pool.execute(
      'SELECT image_url FROM categories WHERE id = ?',
      [categoryId]
    );
    const oldImagePath = oldCategories.length > 0 ? oldCategories[0].image_url : null;

    const { updateFields, values } = await buildUpdateQuery(allowedFields, req.body, req.file, 'categories');

    if (updateFields.length === 0) {
      return sendBadRequest(res, 'No fields to update');
    }

    values.push(categoryId);

    await pool.execute(
      `UPDATE categories SET ${updateFields.join(', ')} WHERE id = ?`,
      values
    );

    // Delete old image if new image was uploaded
    if (req.file && oldImagePath) {
      await deleteImage(oldImagePath);
    }

    return sendSuccess(res, {}, 'Category updated successfully');
  } catch (error) {
    console.error('Update category error:', error);
    return sendError(res, 'Failed to update category', 500);
  }
};

export const deleteCategory = async (req, res) => {
  try {
    // Get image path before deletion
    const [categories] = await pool.execute(
      'SELECT image_url FROM categories WHERE id = ?',
      [req.params.id]
    );
    const imagePath = categories.length > 0 ? categories[0].image_url : null;

    await pool.execute('DELETE FROM categories WHERE id = ?', [req.params.id]);

    // Delete associated image
    if (imagePath) {
      await deleteImage(imagePath);
    }

    return sendSuccess(res, {}, 'Category deleted successfully');
  } catch (error) {
    console.error('Delete category error:', error);
    return sendError(res, 'Failed to delete category', 500);
  }
};

// Orders
export const getOrders = async (req, res) => {
  try {
    const [orders] = await pool.execute(
      `SELECT o.*, u.email as user_email 
       FROM orders o 
       LEFT JOIN user u ON o.user_id = u.id 
       ORDER BY o.created_at DESC`
    );

    return sendSuccess(res, {
      count: orders.length,
      results: orders.map(o => ({
        ...o,
        id: o.order_id,
        status: o.order_status,
        total_amount: parseFloat(o.total_amount),
        shipping_address: JSON.parse(o.shipping_address || '{}'),
      })),
    });
  } catch (error) {
    console.error('Get admin orders error:', error);
    return sendError(res, 'Failed to fetch orders', 500);
  }
};

export const getOrder = async (req, res) => {
  try {
    const [orders] = await pool.execute(
      `SELECT o.*, u.email as user_email 
       FROM orders o 
       LEFT JOIN user u ON o.user_id = u.id 
       WHERE o.order_id = ?`,
      [req.params.id]
    );

    if (orders.length === 0) {
      return sendNotFound(res, 'Order');
    }

    const order = orders[0];

    // Get order items
    const [items] = await pool.execute(
      `SELECT oi.*, p.name as product_name 
       FROM order_items oi 
       LEFT JOIN products p ON oi.product_id = p.product_id 
       WHERE oi.order_id = ?`,
      [req.params.id]
    );

    return sendSuccess(res, {
      ...order,
      id: order.order_id,
      status: order.order_status,
      total_amount: parseFloat(order.total_amount),
      shipping_address: JSON.parse(order.shipping_address || '{}'),
      items: items.map(item => ({
        ...item,
        id: item.order_item_id,
        price: parseFloat(item.price),
      })),
    });
  } catch (error) {
    console.error('Get admin order error:', error);
    return sendError(res, 'Failed to fetch order', 500);
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status, order_status, payment_status } = req.body;
    const updateFields = [];
    const values = [];

    // Accept both 'status' and 'order_status' for compatibility
    const orderStatus = order_status || status;
    
    if (orderStatus) {
      updateFields.push('order_status = ?');
      values.push(orderStatus);
    }

    if (payment_status) {
      updateFields.push('payment_status = ?');
      values.push(payment_status);
    }

    if (updateFields.length === 0) {
      return sendBadRequest(res, 'No status to update');
    }

    values.push(req.params.id);

    await pool.execute(
      `UPDATE orders SET ${updateFields.join(', ')} WHERE order_id = ?`,
      values
    );

    return sendSuccess(res, {}, 'Order status updated successfully');
  } catch (error) {
    console.error('Update order status error:', error);
    return sendError(res, 'Failed to update order status', 500);
  }
};

// Users
export const getUsers = async (req, res) => {
  try {
    const [users] = await pool.execute(
      'SELECT id, email, username, first_name, last_name, phone, phone_number, is_verified, status, created_at, date_joined FROM user ORDER BY created_at DESC'
    );

    return sendSuccess(res, {
      count: users.length,
      results: users.map(user => ({
        ...user,
        date_joined: user.date_joined || user.created_at,
      })),
    });
  } catch (error) {
    console.error('Get admin users error:', error);
    return sendError(res, 'Failed to fetch users', 500);
  }
};

// Contacts
export const getContacts = async (req, res) => {
  try {
    const [contacts] = await pool.execute(
      'SELECT * FROM contact_submissions ORDER BY created_at DESC'
    );

    return sendSuccess(res, {
      count: contacts.length,
      results: contacts,
    });
  } catch (error) {
    console.error('Get admin contacts error:', error);
    return sendError(res, 'Failed to fetch contacts', 500);
  }
};

export const markContactRead = async (req, res) => {
  try {
    await pool.execute(
      'UPDATE contact_submissions SET is_read = 1 WHERE id = ?',
      [req.params.id]
    );

    return sendSuccess(res, {}, 'Contact marked as read');
  } catch (error) {
    console.error('Mark contact read error:', error);
    return sendError(res, 'Failed to mark contact as read', 500);
  }
};

// Blogs
export const getBlogs = async (req, res) => {
  try {
    const [blogs] = await pool.execute(
      `SELECT b.*, a.name as author_name 
       FROM blogs b 
       LEFT JOIN admins a ON b.author_id = a.id 
       ORDER BY b.created_at DESC`
    );

    return sendSuccess(res, {
      count: blogs.length,
      results: blogs.map(blog => ({
        ...blog,
        id: blog.blog_id,
        blog_id: blog.blog_id,
        published: blog.status === 'published',
        published_at: blog.status === 'published' ? blog.created_at : null,
        tags: JSON.parse(blog.tags || '[]'),
        content_blocks: blog.content_blocks ? JSON.parse(blog.content_blocks) : null,
        views: blog.view_count,
        view_count: blog.view_count,
        author: blog.author || blog.author_name,
        author_name: blog.author_name,
        excerpt: blog.excerpt || blog.content?.substring(0, 200),
        date: blog.date || blog.created_at,
        featured_image_url: blog.featured_image 
          ? `${req.protocol}://${req.get('host')}/uploads/${blog.featured_image}` 
          : null,
        thumbnail_url: blog.thumbnail 
          ? `${req.protocol}://${req.get('host')}/uploads/${blog.thumbnail}` 
          : (blog.featured_image ? `${req.protocol}://${req.get('host')}/uploads/${blog.featured_image}` : null),
      })),
    });
  } catch (error) {
    console.error('Get admin blogs error:', error);
    return sendError(res, 'Failed to fetch blogs', 500);
  }
};

export const getBlog = async (req, res) => {
  try {
    const [blogs] = await pool.execute(
      `SELECT b.*, a.name as author_name 
       FROM blogs b 
       LEFT JOIN admins a ON b.author_id = a.id 
       WHERE b.blog_id = ?`,
      [req.params.id]
    );

    if (blogs.length === 0) {
      return sendNotFound(res, 'Blog');
    }

    const blog = blogs[0];
    return sendSuccess(res, {
      ...blog,
      id: blog.blog_id,
      blog_id: blog.blog_id,
      published: blog.status === 'published',
      published_at: blog.status === 'published' ? blog.created_at : null,
      tags: JSON.parse(blog.tags || '[]'),
      content_blocks: blog.content_blocks ? JSON.parse(blog.content_blocks) : null,
      views: blog.view_count,
      view_count: blog.view_count,
      author: blog.author || blog.author_name,
      author_name: blog.author_name,
      excerpt: blog.excerpt || (blog.content ? blog.content.substring(0, 200) : null),
      date: blog.date || blog.created_at,
      featured_image_url: blog.featured_image 
        ? `${req.protocol}://${req.get('host')}/uploads/${blog.featured_image}` 
        : null,
      thumbnail_url: blog.thumbnail 
        ? `${req.protocol}://${req.get('host')}/uploads/${blog.thumbnail}` 
        : (blog.featured_image ? `${req.protocol}://${req.get('host')}/uploads/${blog.featured_image}` : null),
    });
  } catch (error) {
    console.error('Get admin blog error:', error);
    return sendError(res, 'Failed to fetch blog', 500);
  }
};

export const createBlog = async (req, res) => {
  try {
    const {
      title, slug, subtitle, excerpt, content, content_blocks, author_id, published, status, tags, meta_title, meta_description, date
    } = req.body;

    let imageName = null;
    if (req.file) {
      imageName = await processImage(req.file.buffer, 'blogs', {
        maxWidth: 1920,
        maxHeight: 1920,
        quality: 85,
        format: 'jpeg'
      });
    }
    const authorId = author_id || req.user?.id || 1;
    const blogStatus = status || (published === 'true' || published === true ? 'published' : 'draft');
    
    // Get author name from admins table
    const [admins] = await pool.execute(
      'SELECT name FROM admins WHERE id = ?',
      [authorId]
    );
    const authorName = admins.length > 0 ? admins[0].name : null;

    // Use featured_image for thumbnail if thumbnail not provided separately
    let thumbnailName = imageName;
    if (req.files && req.files.thumbnail) {
      thumbnailName = await processImage(req.files.thumbnail[0].buffer, 'blogs', {
        maxWidth: 1920,
        maxHeight: 1920,
        quality: 85,
        format: 'jpeg'
      });
    }

    const [result] = await pool.execute(
      `INSERT INTO blogs (title, slug, subtitle, excerpt, content, content_blocks, featured_image, thumbnail, author_id, author, status, tags, meta_title, meta_description, date) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title, slug, subtitle || null, excerpt || null, content,
        content_blocks ? JSON.stringify(content_blocks) : null,
        imageName, thumbnailName, authorId, authorName,
        blogStatus,
        JSON.stringify(tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : []),
        meta_title || null,
        meta_description || null,
        date || null
      ]
    );

    return sendSuccess(res, { blog_id: result.insertId }, 'Blog created successfully', 201);
  } catch (error) {
    console.error('Create blog error:', error);
    return sendError(res, 'Failed to create blog', 500);
  }
};

export const updateBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const updateFields = [];
    const values = [];

    const allowedFields = ['title', 'slug', 'subtitle', 'excerpt', 'content', 'content_blocks', 'tags', 'meta_title', 'meta_description', 'date'];
    
    // Get old image paths before update
    const [oldBlogs] = await pool.execute(
      'SELECT featured_image, thumbnail FROM blogs WHERE blog_id = ?',
      [blogId]
    );
    const oldImagePath = oldBlogs.length > 0 ? oldBlogs[0].featured_image : null;
    const oldThumbnailPath = oldBlogs.length > 0 ? oldBlogs[0].thumbnail : null;
    
    // Handle status separately to avoid conflicts and ensure single value
    if (req.body.status !== undefined) {
      updateFields.push('status = ?');
      // Ensure status is a string, not an array
      const statusValue = Array.isArray(req.body.status) ? req.body.status[0] : req.body.status;
      values.push(statusValue);
    } else if (req.body.published !== undefined) {
      // Fallback to published checkbox if status not provided
      updateFields.push('status = ?');
      const published = req.body.published === 'true' || req.body.published === true || req.body.published === '1';
      values.push(published ? 'published' : 'draft');
    }
    
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        if (field === 'tags') {
          updateFields.push('tags = ?');
          const data = req.body[field];
          let tagsValue = null;
          
          // Handle different input formats
          if (Array.isArray(data)) {
            tagsValue = JSON.stringify(data);
          } else if (typeof data === 'string') {
            const trimmed = data.trim();
            // If it's already a valid JSON string, use it directly
            if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
              try {
                // Validate it's valid JSON
                JSON.parse(trimmed);
                tagsValue = trimmed; // Use as-is if valid JSON
              } catch (e) {
                // If JSON parse fails, treat as comma-separated string
                const tagsArray = trimmed.split(',').map(t => t.trim()).filter(t => t);
                tagsValue = JSON.stringify(tagsArray);
              }
            } else if (trimmed === '') {
              tagsValue = JSON.stringify([]);
            } else {
              // Comma-separated string
              const tagsArray = trimmed.split(',').map(t => t.trim()).filter(t => t);
              tagsValue = JSON.stringify(tagsArray);
            }
          } else {
            tagsValue = JSON.stringify([]);
          }
          
          values.push(tagsValue);
        } else if (field === 'content_blocks') {
          updateFields.push('content_blocks = ?');
          const data = req.body[field];
          if (typeof data === 'string' && (data.trim().startsWith('[') || data.trim().startsWith('{'))) {
            try {
              // Validate it's valid JSON before using as-is
              JSON.parse(data);
              values.push(data);
            } catch (e) {
              // If JSON parse fails, stringify it
              values.push(JSON.stringify(data));
            }
          } else {
            values.push(JSON.stringify(data));
          }
        } else {
          updateFields.push(`${field} = ?`);
          values.push(req.body[field]);
        }
      }
    }

    if (req.file) {
      const imageName = await processImage(req.file.buffer, 'blogs', {
        maxWidth: 1920,
        maxHeight: 1920,
        quality: 85,
        format: 'jpeg'
      });
      updateFields.push('featured_image = ?');
      values.push(imageName);
    }

    if (updateFields.length === 0) {
      return sendBadRequest(res, 'No fields to update');
    }

    values.push(blogId);

    const query = `UPDATE blogs SET ${updateFields.join(', ')} WHERE blog_id = ?`;

    await pool.execute(query, values);

    // Delete old image if new image was uploaded
    if (req.file && oldImagePath) {
      await deleteImage(oldImagePath);
    }

    return sendSuccess(res, {}, 'Blog updated successfully');
  } catch (error) {
    console.error('Update blog error:', error);
    return sendError(res, 'Failed to update blog', 500);
  }
};

export const deleteBlog = async (req, res) => {
  try {
    // Get image path before deletion
    const [blogs] = await pool.execute(
      'SELECT featured_image FROM blogs WHERE blog_id = ?',
      [req.params.id]
    );
    const imagePath = blogs.length > 0 ? blogs[0].featured_image : null;

    await pool.execute('DELETE FROM blogs WHERE blog_id = ?', [req.params.id]);

    // Delete associated image
    if (imagePath) {
      await deleteImage(imagePath);
    }

    return sendSuccess(res, {}, 'Blog deleted successfully');
  } catch (error) {
    console.error('Delete blog error:', error);
    return sendError(res, 'Failed to delete blog', 500);
  }
};

// Update Admin Profile
export const updateProfile = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { name } = req.body;
    let photoPath = null;

    // Process avatar image if provided
    if (req.file) {
      // Get old photo path
      const [admins] = await pool.execute(
        'SELECT photo FROM admins WHERE id = ?',
        [adminId]
      );
      const oldPhoto = admins.length > 0 ? admins[0].photo : null;

      // Process new image
      photoPath = await processImage(req.file, 'admins');

      // Delete old image if exists
      if (oldPhoto) {
        await deleteImage(oldPhoto);
      }
    }

    // Build update query
    const updateFields = [];
    const values = [];
    
    if (name) {
      updateFields.push('name = ?');
      values.push(name);
    }
    if (photoPath) {
      updateFields.push('photo = ?');
      values.push(photoPath);
    }

    if (updateFields.length === 0) {
      return sendBadRequest(res, 'No fields to update');
    }

    values.push(adminId);
    const query = `UPDATE admins SET ${updateFields.join(', ')} WHERE id = ?`;
    await pool.execute(query, values);

    // Get updated admin
    const [updated] = await pool.execute(
      'SELECT id, name, email, photo, is_verified FROM admins WHERE id = ?',
      [adminId]
    );

    return sendSuccess(res, {
      id: updated[0].id,
      name: updated[0].name,
      email: updated[0].email,
      photo: updated[0].photo,
      is_verified: updated[0].is_verified,
      is_staff: true,
      is_superuser: true,
    }, 'Profile updated successfully');
  } catch (error) {
    console.error('Update profile error:', error);
    return sendError(res, 'Failed to update profile', 500);
  }
};

// Reset Admin Password
export const resetPassword = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      return sendBadRequest(res, 'Current password and new password are required');
    }

    if (new_password.length < 6) {
      return sendBadRequest(res, 'New password must be at least 6 characters');
    }

    // Get current password hash
    const [admins] = await pool.execute(
      'SELECT password FROM admins WHERE id = ?',
      [adminId]
    );

    if (admins.length === 0) {
      return sendNotFound(res, 'Admin not found');
    }

    // Verify current password
    const isValid = await bcrypt.compare(current_password, admins[0].password);
    if (!isValid) {
      return sendError(res, 'Current password is incorrect', 401);
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(new_password, 10);

    // Update password
    await pool.execute(
      'UPDATE admins SET password = ? WHERE id = ?',
      [hashedPassword, adminId]
    );

    return sendSuccess(res, {}, 'Password changed successfully');
  } catch (error) {
    console.error('Reset password error:', error);
    return sendError(res, 'Failed to reset password', 500);
  }
};

