import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { Plus, Edit, Trash2, Search, FolderTree } from "lucide-react";
import { ProductCategory, InputChangeEvent } from "../types";
import "../styles/Categories.css";

export default function Categories(): React.JSX.Element {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await api.get<
        { results: ProductCategory[] } | ProductCategory[]
      >("/admin/categories");
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];
      setCategories(data);
    } catch (err) {
      console.error("Failed to load categories", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;

    try {
      await api.delete(`/admin/categories/${id}`);
      await fetchCategories();
    } catch (err) {
      alert("Failed to delete category");
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="categories-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="categories-container">
      <div className="categories-header">
        <div>
          <h1 className="categories-title">Categories</h1>
          <p className="categories-subtitle">Manage product categories</p>
        </div>
        <Link to="/categories/new" className="add-category-btn">
          <Plus size={20} />
          Add Category
        </Link>
      </div>

      <div className="search-container">
        <div className="search-wrapper">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e: InputChangeEvent) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="categories-grid">
        {filteredCategories.length === 0 ? (
          <div className="empty-state">
            <FolderTree className="empty-state-icon" size={48} />
            <p className="empty-state-text">No categories found</p>
          </div>
        ) : (
          filteredCategories.map((category) => (
            <div key={category.id} className="category-card">
              {category.image_url && (
                <img
                  src={category.image_url}
                  alt={category.name}
                  className="category-image"
                />
              )}
              <h3 className="category-name">{category.name}</h3>
              {category.headline && (
                <p className="category-headline">{category.headline}</p>
              )}
              <div className="category-footer">
                <span className="category-count">
                  {category.products_count || 0} products
                </span>
                <div className="category-actions">
                  <Link
                    to={`/categories/${category.id}/edit`}
                    className="action-btn edit"
                  >
                    <Edit size={18} />
                  </Link>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="action-btn delete"
                    type="button"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
