import pool from "../config/database.js";
import { sendSuccess, sendError, sendNotFound } from "../utils/response.js";
import { getImageUrl } from "../utils/imageUrl.js";

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const [categories] = await pool.execute(
      `SELECT 
        c.*,
        COUNT(p.product_id) as products_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      GROUP BY c.id
      ORDER BY c.name`
    );

    const formattedCategories = categories.map((cat) => ({
      id: parseInt(cat.id), // Ensure it's an integer
      slug: cat.slug,
      name: cat.name,
      headline: cat.headline,
      description: cat.description,
      accent_gradient: cat.accent_gradient,
      hero_tagline: cat.hero_tagline,
      image: cat.image_url, // Use image_url as image for backward compatibility
      image_url: getImageUrl(req, cat.image_url),
      products_count: parseInt(cat.products_count),
      created_at: cat.created_at,
    }));

    return sendSuccess(res, {
      count: formattedCategories.length,
      results: formattedCategories,
    });
  } catch (error) {
    console.error("Get categories error:", error);
    return sendError(res, "Failed to fetch categories", 500);
  }
};

// Get single category by ID or slug
export const getCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const isNumeric = /^\d+$/.test(categoryId);

    let query, params;
    if (isNumeric) {
      query = "SELECT * FROM categories WHERE id = ?";
      params = [parseInt(categoryId)];
    } else {
      query = "SELECT * FROM categories WHERE slug = ?";
      params = [categoryId];
    }

    const [categories] = await pool.execute(query, params);

    if (categories.length === 0) {
      return sendNotFound(res, "Category");
    }

    const cat = categories[0];

    // Get products count
    const [countResult] = await pool.execute(
      "SELECT COUNT(*) as count FROM products WHERE category_id = ?",
      [cat.id]
    );

    return sendSuccess(res, {
      id: parseInt(cat.id), // Ensure it's an integer
      slug: cat.slug,
      name: cat.name,
      headline: cat.headline,
      description: cat.description,
      accent_gradient: cat.accent_gradient,
      hero_tagline: cat.hero_tagline,
      image: cat.image_url, // Use image_url as image for backward compatibility
      image_url: getImageUrl(req, cat.image_url),
      products_count: parseInt(countResult[0].count),
      created_at: cat.created_at,
    });
  } catch (error) {
    console.error("Get category error:", error);
    return sendError(res, "Failed to fetch category", 500);
  }
};
