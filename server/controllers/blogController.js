import pool from '../config/database.js';
import { sendSuccess, sendError, sendNotFound } from '../utils/response.js';
import { getImageUrl } from '../utils/imageUrl.js';

// Get all blogs
export const getBlogs = async (req, res) => {
  try {
    const { published, category, search, page = 1, page_size = 20 } = req.query;
    
    let query = 'SELECT blog_id as id, title, slug, content as excerpt, content, featured_image, author_id, status, meta_title, meta_description, tags, view_count as views, created_at, updated_at FROM blogs WHERE 1=1';
    const params = [];

    if (published !== undefined) {
      query += ' AND status = ?';
      params.push(published === 'true' ? 'published' : 'draft');
    } else {
      query += " AND status = 'published'";
    }

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (title LIKE ? OR excerpt LIKE ? OR content LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    query += ' ORDER BY created_at DESC';

    const offset = (parseInt(page) - 1) * parseInt(page_size);
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(page_size), offset);

    const [blogs] = await pool.execute(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM blogs WHERE 1=1';
    const countParams = [];
    
    if (published !== undefined) {
      countQuery += ' AND status = ?';
      countParams.push(published === 'true' ? 'published' : 'draft');
    } else {
      countQuery += " AND status = 'published'";
    }
    if (category) {
      countQuery += ' AND category = ?';
      countParams.push(category);
    }
    if (search) {
      countQuery += ' AND (title LIKE ? OR excerpt LIKE ? OR content LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }

    const [countResult] = await pool.execute(countQuery, countParams);
    const total = countResult[0].total;

    const formattedBlogs = blogs.map(blog => ({
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      featured_image: blog.featured_image,
      featured_image_url: blog.featured_image 
        ? `${req.protocol}://${req.get('host')}/uploads/blogs/${blog.featured_image}`
        : null,
      author_id: blog.author_id,
      published: blog.status === 'published',
      published_at: blog.status === 'published' ? blog.created_at : null,
      tags: JSON.parse(blog.tags || '[]'),
      views: blog.views || 0,
      created_at: blog.created_at,
      updated_at: blog.updated_at,
    }));

    return sendSuccess(res, {
      count: formattedBlogs.length,
      total,
      page: parseInt(page),
      page_size: parseInt(page_size),
      results: formattedBlogs,
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    return sendError(res, 'Failed to fetch blogs', 500);
  }
};

// Get single blog
export const getBlog = async (req, res) => {
  try {
    const [blogs] = await pool.execute(
      'SELECT blog_id as id, title, slug, content, featured_image, author_id, status, meta_title, meta_description, tags, view_count as views, created_at, updated_at FROM blogs WHERE slug = ?',
      [req.params.slug]
    );

    if (blogs.length === 0) {
      return sendNotFound(res, 'Blog');
    }

    const blog = blogs[0];

    // Increment views
    await pool.execute(
      'UPDATE blogs SET view_count = view_count + 1 WHERE blog_id = ?',
      [blog.id]
    );

    return sendSuccess(res, {
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      featured_image: blog.featured_image,
      featured_image_url: blog.featured_image 
        ? `${req.protocol}://${req.get('host')}/uploads/blogs/${blog.featured_image}`
        : null,
      author_id: blog.author_id,
      published: blog.status === 'published',
      published_at: blog.status === 'published' ? blog.created_at : null,
      tags: JSON.parse(blog.tags || '[]'),
      views: (blog.views || 0) + 1,
      created_at: blog.created_at,
      updated_at: blog.updated_at,
    });
  } catch (error) {
    console.error('Get blog error:', error);
    return sendError(res, 'Failed to fetch blog', 500);
  }
};

