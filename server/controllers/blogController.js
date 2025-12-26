import pool from "../config/database.js";
import { sendSuccess, sendError, sendNotFound } from "../utils/response.js";
import { getImageUrl } from "../utils/imageUrl.js";

// Get all blogs
export const getBlogs = async (req, res) => {
  try {
    const { published, category, search, page = 1, page_size = 20 } = req.query;

    let query =
      "SELECT blog_id as id, title, slug, subtitle, excerpt, content, featured_image, thumbnail, author_id, status, meta_title, meta_description, tags, view_count as views, date, created_at, updated_at FROM blogs WHERE 1=1";
    const params = [];

    if (published !== undefined) {
      query += " AND status = ?";
      params.push(published === "true" ? "published" : "draft");
    } else {
      query += " AND status = 'published'";
    }

    if (category) {
      query += " AND category = ?";
      params.push(category);
    }

    if (search) {
      query += " AND (title LIKE ? OR excerpt LIKE ? OR content LIKE ?)";
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    query += " ORDER BY created_at DESC";

    const offset = (parseInt(page) - 1) * parseInt(page_size);
    query += " LIMIT ? OFFSET ?";
    params.push(parseInt(page_size), offset);

    const [blogs] = await pool.execute(query, params);

    // Get total count
    let countQuery = "SELECT COUNT(*) as total FROM blogs WHERE 1=1";
    const countParams = [];

    if (published !== undefined) {
      countQuery += " AND status = ?";
      countParams.push(published === "true" ? "published" : "draft");
    } else {
      countQuery += " AND status = 'published'";
    }
    if (category) {
      countQuery += " AND category = ?";
      countParams.push(category);
    }
    if (search) {
      countQuery += " AND (title LIKE ? OR excerpt LIKE ? OR content LIKE ?)";
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }

    const [countResult] = await pool.execute(countQuery, countParams);
    const total = countResult[0].total;

    // Get author names for all blogs
    const authorIds = [...new Set(blogs.map((b) => b.author_id))];
    const authorMap = new Map();
    if (authorIds.length > 0) {
      const placeholders = authorIds.map(() => "?").join(",");
      const [authors] = await pool.execute(
        `SELECT id, name FROM admins WHERE id IN (${placeholders})`,
        authorIds
      );
      authors.forEach((a) => authorMap.set(a.id, a.name));
    }

    const formattedBlogsPromises = blogs.map(async (blog) => {
      const authorName = authorMap.get(blog.author_id) || null;

      // Parse content blocks if available
      let contentBlocks = null;
      try {
        const [blogWithBlocks] = await pool.execute(
          "SELECT content_blocks FROM blogs WHERE blog_id = ?",
          [blog.id]
        );
        if (blogWithBlocks.length > 0 && blogWithBlocks[0].content_blocks) {
          contentBlocks = JSON.parse(blogWithBlocks[0].content_blocks);
          // Update image paths in content blocks
          if (contentBlocks && Array.isArray(contentBlocks)) {
            contentBlocks = contentBlocks.map((block) => {
              if (block.type === "image" && block.src) {
                return {
                  ...block,
                  src: block.src.startsWith("http")
                    ? block.src
                    : `${req.protocol}://${req.get("host")}/uploads/blogs/${
                        block.src
                      }`,
                };
              }
              return block;
            });
          }
        }
      } catch (e) {
        // Ignore parsing errors
      }

      // Fix image paths - handle both with and without folder prefix
      let featuredImagePath = blog.featured_image;
      if (featuredImagePath && !featuredImagePath.startsWith("blogs/")) {
        featuredImagePath = `blogs/${featuredImagePath}`;
      }

      let thumbnailPath = blog.thumbnail || blog.featured_image;
      if (thumbnailPath && !thumbnailPath.startsWith("blogs/")) {
        thumbnailPath = `blogs/${thumbnailPath}`;
      }

      return {
        id: blog.id,
        title: blog.title,
        slug: blog.slug,
        subtitle: blog.subtitle || null,
        excerpt: blog.excerpt || null,
        content: blog.content,
        content_blocks: contentBlocks,
        featured_image: blog.featured_image,
        featured_image_url: blog.featured_image
          ? getImageUrl(req, featuredImagePath)
          : null,
        thumbnail: blog.thumbnail || blog.featured_image,
        thumbnail_url:
          blog.thumbnail || blog.featured_image
            ? getImageUrl(req, thumbnailPath)
            : null,
        author_id: blog.author_id,
        author: authorName,
        author_name: authorName,
        published: blog.status === "published",
        published_at: blog.status === "published" ? blog.created_at : null,
        tags: JSON.parse(blog.tags || "[]"),
        views: blog.views || 0,
        view_count: blog.views || 0,
        date: blog.date || blog.created_at,
        created_at: blog.created_at,
        updated_at: blog.updated_at,
      };
    });

    const formattedBlogs = await Promise.all(formattedBlogsPromises);

    return sendSuccess(res, {
      count: formattedBlogs.length,
      total,
      page: parseInt(page),
      page_size: parseInt(page_size),
      results: formattedBlogs,
    });
  } catch (error) {
    console.error("Get blogs error:", error);
    return sendError(res, "Failed to fetch blogs", 500);
  }
};

// Get single blog
export const getBlog = async (req, res) => {
  try {
    const [blogs] = await pool.execute(
      "SELECT blog_id as id, title, slug, content, featured_image, thumbnail, author_id, status, meta_title, meta_description, tags, view_count as views, created_at, updated_at FROM blogs WHERE slug = ?",
      [req.params.slug]
    );

    if (blogs.length === 0) {
      return sendNotFound(res, "Blog");
    }

    const blog = blogs[0];

    // Increment views
    await pool.execute(
      "UPDATE blogs SET view_count = view_count + 1 WHERE blog_id = ?",
      [blog.id]
    );

    // Get author name
    const [admins] = await pool.execute(
      "SELECT name FROM admins WHERE id = ?",
      [blog.author_id]
    );
    const authorName = admins.length > 0 ? admins[0].name : null;

    // Parse content blocks and update image URLs
    let contentBlocks = null;
    try {
      const [blogWithBlocks] = await pool.execute(
        "SELECT content_blocks, subtitle, excerpt, date, author FROM blogs WHERE blog_id = ?",
        [blog.id]
      );
      if (blogWithBlocks.length > 0) {
        contentBlocks = blogWithBlocks[0].content_blocks
          ? JSON.parse(blogWithBlocks[0].content_blocks)
          : null;
        // Update image paths in content blocks
        if (contentBlocks && Array.isArray(contentBlocks)) {
          contentBlocks = contentBlocks.map((block) => {
            if (block.type === "image" && block.src) {
              return {
                ...block,
                src: block.src.startsWith("http")
                  ? block.src
                  : `${req.protocol}://${req.get("host")}/uploads/blogs/${
                      block.src
                    }`,
              };
            }
            return block;
          });
        }
      }
    } catch (e) {
      console.error("Error parsing content blocks:", e);
    }

    return sendSuccess(res, {
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      subtitle: blog.subtitle || null,
      excerpt: blog.excerpt || null,
      content: blog.content,
      content_blocks: contentBlocks,
      featured_image: blog.featured_image,
      featured_image_url: blog.featured_image
        ? getImageUrl(req, blog.featured_image.startsWith('blogs/') ? blog.featured_image : `blogs/${blog.featured_image}`)
        : null,
      thumbnail: blog.thumbnail || blog.featured_image,
      thumbnail_url: (blog.thumbnail || blog.featured_image)
        ? getImageUrl(req, (blog.thumbnail || blog.featured_image).startsWith('blogs/') ? (blog.thumbnail || blog.featured_image) : `blogs/${blog.thumbnail || blog.featured_image}`)
        : null,
      author_id: blog.author_id,
      author: authorName || (blogWithBlocks.length > 0 ? blogWithBlocks[0].author : null),
      author_name: authorName || (blogWithBlocks.length > 0 ? blogWithBlocks[0].author : null),
      published: blog.status === "published",
      published_at: blog.status === "published" ? blog.created_at : null,
      tags: JSON.parse(blog.tags || "[]"),
      views: (blog.views || 0) + 1,
      view_count: (blog.views || 0) + 1,
      date: blog.date || blog.created_at,
      created_at: blog.created_at,
      updated_at: blog.updated_at,
    });
  } catch (error) {
    console.error("Get blog error:", error);
    return sendError(res, "Failed to fetch blog", 500);
  }
};
