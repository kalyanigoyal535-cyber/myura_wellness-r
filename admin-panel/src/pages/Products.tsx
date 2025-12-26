import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { Plus, Edit, Trash2, Search, Package } from "lucide-react";
import { Product } from "../types";
import "../styles/Products.css";

export default function Products(): React.JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await api.get<
        { results: Product[]; count?: number } | Product[]
      >("/admin/products");
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];
      setProducts(data);
      setError(null);
    } catch (err) {
      setError("Failed to load products");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number): Promise<void> => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await api.delete(`/admin/products/${id}`);
      await fetchProducts();
    } catch (err) {
      alert("Failed to delete product");
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="products-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="products-container">
      <div className="products-header">
        <div>
          <h1 className="products-title">Products</h1>
          <p className="products-subtitle">Manage your product catalog</p>
        </div>
        <Link to="/products/new" className="add-product-btn">
          <Plus size={20} />
          Add Product
        </Link>
      </div>

      <div className="products-search-container">
        <div className="search-wrapper">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search products by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="search-clear-btn"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p className="error-text">{error}</p>
        </div>
      )}

      {filteredProducts.length === 0 ? (
        <div className="empty-state-products">
          <Package className="empty-state-icon-products" size={64} />
          <p className="empty-state-text-products">
            {searchTerm ? "No products match your search" : "No products found"}
          </p>
          {products.length === 0 && !searchTerm && (
            <Link to="/products/new" className="empty-state-action-products">
              <Plus size={20} />
              Create your first product
            </Link>
          )}
        </div>
      ) : (
        <div className="products-table-container">
          <div className="table-wrapper">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Rating</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.product_id}>
                    <td>
                      <div className="product-info">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="product-image"
                          />
                        ) : (
                          <div className="product-image-placeholder">
                            <Package size={20} />
                          </div>
                        )}
                        <div className="product-details">
                          <p className="product-name">{product.name}</p>
                          {product.headline && (
                            <p className="product-headline">
                              {product.headline}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="category-name">
                        {product.category?.name || "N/A"}
                      </span>
                    </td>
                    <td>
                      <div className="price-info">
                        <span className="current-price">
                          ₹{Number(product.price).toLocaleString("en-IN")}
                        </span>
                        {product.original_price &&
                          Number(product.original_price) >
                            Number(product.price) && (
                            <span className="original-price">
                              ₹
                              {Number(product.original_price).toLocaleString(
                                "en-IN"
                              )}
                            </span>
                          )}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`stock-badge ${
                          product.in_stock ? "in-stock" : "out-of-stock"
                        }`}
                      >
                        {product.in_stock ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                    <td>
                      <div className="rating-info">
                        <span className="rating-value">
                          {Number(product.rating).toFixed(1)}
                        </span>
                        <span className="rating-count">
                          ({product.reviews_count || 0})
                        </span>
                      </div>
                    </td>
                    <td className="text-right">
                      <div className="action-buttons">
                        <Link
                          to={`/products/${product.product_id}/edit`}
                          className="action-btn edit-btn"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.product_id)}
                          className="action-btn delete-btn"
                          title="Delete"
                          type="button"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
