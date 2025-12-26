import pool from "../config/database.js";
import { sendSuccess, sendError, sendNotFound } from "../utils/response.js";
import { getImageUrl } from "../utils/imageUrl.js";

// Get all products with filters
export const getProducts = async (req, res) => {
  try {
    const {
      category,
      categories,
      min_price,
      max_price,
      min_rating,
      max_rating,
      search,
      ordering,
    } = req.query;

    let query = `
      SELECT 
        p.*,
        p.slug as product_slug,
        c.id as category_id,
        c.name as category_name,
        c.headline as category_headline,
        c.description as category_description,
        c.accent_gradient as category_accent_gradient,
        c.hero_tagline as category_hero_tagline,
        c.image_url as category_image,
        CASE 
          WHEN p.original_price > p.price THEN 
            ROUND(((p.original_price - p.price) / p.original_price) * 100)
          ELSE 0
        END as discount_percent
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (category) {
      // Support both numeric ID and slug
      const isNumeric = /^\d+$/.test(category);
      if (isNumeric) {
        query += " AND p.category_id = ?";
        params.push(parseInt(category));
      } else {
        query +=
          " AND p.category_id = (SELECT id FROM categories WHERE slug = ?)";
        params.push(category);
      }
    }

    if (categories) {
      const categoryList = categories.split(",").map((c) => c.trim());
      const numericIds = categoryList
        .filter((c) => /^\d+$/.test(c))
        .map((c) => parseInt(c));
      const slugs = categoryList.filter((c) => !/^\d+$/.test(c));

      if (numericIds.length > 0 && slugs.length > 0) {
        query +=
          " AND (p.category_id IN (" +
          numericIds.map(() => "?").join(",") +
          ") OR p.category_id IN (SELECT id FROM categories WHERE slug IN (" +
          slugs.map(() => "?").join(",") +
          ")))";
        params.push(...numericIds, ...slugs);
      } else if (numericIds.length > 0) {
        query +=
          " AND p.category_id IN (" + numericIds.map(() => "?").join(",") + ")";
        params.push(...numericIds);
      } else if (slugs.length > 0) {
        query +=
          " AND p.category_id IN (SELECT id FROM categories WHERE slug IN (" +
          slugs.map(() => "?").join(",") +
          "))";
        params.push(...slugs);
      }
    }

    if (min_price) {
      query += " AND p.price >= ?";
      params.push(parseFloat(min_price));
    }

    if (max_price) {
      query += " AND p.price <= ?";
      params.push(parseFloat(max_price));
    }

    if (min_rating) {
      query += " AND p.rating >= ?";
      params.push(parseFloat(min_rating));
    }

    if (max_rating) {
      query += " AND p.rating <= ?";
      params.push(parseFloat(max_rating));
    }

    if (search) {
      query +=
        " AND (p.name LIKE ? OR p.headline LIKE ? OR p.description LIKE ? OR p.summary LIKE ? OR c.name LIKE ?)";
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
    }

    // Ordering
    const orderBy = ordering || "-created_at";
    const orderField = orderBy.replace("-", "");
    const orderDir = orderBy.startsWith("-") ? "DESC" : "ASC";
    query += ` ORDER BY p.${orderField} ${orderDir}`;

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.page_size) || 20;
    const offset = (page - 1) * pageSize;
    query += " LIMIT ? OFFSET ?";
    params.push(pageSize, offset);

    const [products] = await pool.execute(query, params);

    // Get total count
    let countQuery = "SELECT COUNT(*) as total FROM products p WHERE 1=1";
    const countParams = [];

    if (category) {
      countQuery += " AND p.category_id = ?";
      countParams.push(category);
    }
    if (categories) {
      const categoryList = categories.split(",").map((c) => c.trim());
      countQuery +=
        " AND p.category_id IN (" + categoryList.map(() => "?").join(",") + ")";
      countParams.push(...categoryList);
    }
    if (min_price)
      (countQuery += " AND p.price >= ?"),
        countParams.push(parseFloat(min_price));
    if (max_price)
      (countQuery += " AND p.price <= ?"),
        countParams.push(parseFloat(max_price));
    if (search) {
      countQuery +=
        " AND (p.name LIKE ? OR p.headline LIKE ? OR p.description LIKE ? OR p.summary LIKE ?)";
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    const [countResult] = await pool.execute(countQuery, countParams);
    const total = countResult[0].total;

    // Format products
    const formattedProducts = products.map((p) => ({
      id: p.product_id,
      slug: p.product_slug || p.slug,
      name: p.name,
      headline: p.headline,
      price: parseFloat(p.price),
      original_price: p.original_price ? parseFloat(p.original_price) : null,
      originalPrice: p.original_price ? parseFloat(p.original_price) : null,
      discount_percent: p.discount_percent,
      rating: parseFloat(p.rating),
      reviews_count: p.reviews_count,
      reviews: p.reviews_count,
      in_stock: Boolean(p.in_stock),
      inStock: Boolean(p.in_stock),
      accent_gradient: p.accent_gradient,
      accentGradient: p.accent_gradient,
      notes: JSON.parse(p.notes || "[]"),
      summary: p.summary,
      description: p.description,
      benefits: JSON.parse(p.benefits || "[]"),
      key_ingredients: p.key_ingredients,
      suitable_for: p.suitable_for,
      how_to_use: p.how_to_use,
      faqs: p.faqs,
      hero_tagline: p.hero_tagline,
      heroTagline: p.hero_tagline,
      image: p.image,
      image_url: getImageUrl(req, p.image),
      category: {
        id: parseInt(p.category_id), // Ensure it's an integer
        slug: p.category_slug || null, // Add slug if available
        name: p.category_name,
        headline: p.category_headline,
        description: p.category_description,
        accent_gradient: p.category_accent_gradient,
        hero_tagline: p.category_hero_tagline,
        image: p.category_image,
        image_url: getImageUrl(req, p.category_image),
      },
      created_at: p.created_at,
    }));

    return sendSuccess(res, {
      count: formattedProducts.length,
      total,
      page,
      page_size: pageSize,
      results: formattedProducts,
    });
  } catch (error) {
    console.error("Get products error:", error);
    return sendError(res, "Failed to fetch products", 500);
  }
};

// Get single product
export const getProduct = async (req, res) => {
  try {
    const [products] = await pool.execute(
      `SELECT 
        p.*,
        c.id as category_id,
        c.slug as category_slug,
        c.name as category_name,
        c.headline as category_headline,
        c.description as category_description,
        c.accent_gradient as category_accent_gradient,
        c.hero_tagline as category_hero_tagline,
        c.image_url as category_image,
        CASE 
          WHEN p.original_price > p.price THEN 
            ROUND(((p.original_price - p.price) / p.original_price) * 100)
          ELSE 0
        END as discount_percent
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.product_id = ?`,
      [req.params.id]
    );

    if (products.length === 0) {
      return sendNotFound(res, "Product");
    }

    const p = products[0];

    // Get gallery images
    const [galleryImages] = await pool.execute(
      "SELECT image_id, image_url, alt_text, `order` FROM product_images WHERE product_id = ? ORDER BY `order`, created_at",
      [req.params.id]
    );

    const product = {
      id: p.product_id,
      slug: p.slug,
      name: p.name,
      headline: p.headline,
      price: parseFloat(p.price),
      original_price: p.original_price ? parseFloat(p.original_price) : null,
      originalPrice: p.original_price ? parseFloat(p.original_price) : null,
      discount_percent: p.discount_percent,
      rating: parseFloat(p.rating),
      reviews_count: p.reviews_count,
      reviews: p.reviews_count,
      in_stock: Boolean(p.in_stock),
      inStock: Boolean(p.in_stock),
      accent_gradient: p.accent_gradient,
      accentGradient: p.accent_gradient,
      notes: JSON.parse(p.notes || "[]"),
      summary: p.summary,
      description: p.description,
      benefits: JSON.parse(p.benefits || "[]"),
      key_ingredients: p.key_ingredients,
      keyIngredients: p.key_ingredients,
      suitable_for: p.suitable_for,
      suitableFor: p.suitable_for,
      how_to_use: p.how_to_use,
      howToUse: p.how_to_use,
      faqs: p.faqs,
      hero_tagline: p.hero_tagline,
      heroTagline: p.hero_tagline,
      image: p.image,
      image_url: getImageUrl(req, p.image),
      gallery_images: galleryImages.map((img) => ({
        id: img.image_id,
        image: img.image_url,
        image_url: getImageUrl(req, img.image_url),
        alt_text: img.alt_text,
        order: img.order,
      })),
      gallery: galleryImages.map((img) => ({
        id: img.image_id,
        image: img.image_url,
        image_url: getImageUrl(req, img.image_url),
        alt_text: img.alt_text,
        order: img.order,
      })),
      category: {
        id: parseInt(p.category_id), // Ensure it's an integer
        slug: p.category_slug || null, // Add slug if available
        name: p.category_name,
        headline: p.category_headline,
        description: p.category_description,
        accent_gradient: p.category_accent_gradient,
        hero_tagline: p.category_hero_tagline,
        image: p.category_image,
        image_url: getImageUrl(req, p.category_image),
      },
      created_at: p.created_at,
      updated_at: p.updated_at,
    };

    return sendSuccess(res, product);
  } catch (error) {
    console.error("Get product error:", error);
    return sendError(res, "Failed to fetch product", 500);
  }
};
