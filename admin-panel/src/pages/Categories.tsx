import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { Plus, Edit, Trash2, Search, FolderTree } from "lucide-react";
import { ProductCategory, InputChangeEvent } from "../types";
import DeleteModal from "../components/DeleteModal";
import "../styles/Categories.css";

// Get API base URL from environment or use default
const getApiBaseUrl = (): string => {
  try {
    return (
      (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:8000/api"
    );
  } catch {
    return "http://localhost:8000/api";
  }
};
const API_BASE_URL = getApiBaseUrl();

export default function Categories(): React.JSX.Element {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    categoryId: number | null;
    categoryName: string;
  }>({
    isOpen: false,
    categoryId: null,
    categoryName: "",
  });
  const [deleting, setDeleting] = useState<boolean>(false);
  const [imageModal, setImageModal] = useState<{
    isOpen: boolean;
    imageUrl: string;
    title: string;
  }>({
    isOpen: false,
    imageUrl: "",
    title: "",
  });

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

  const handleDeleteClick = (category: ProductCategory): void => {
    setDeleteModal({
      isOpen: true,
      categoryId: category.id,
      categoryName: category.name,
    });
  };

  const handleDeleteConfirm = async (): Promise<void> => {
    if (!deleteModal.categoryId) return;

    try {
      setDeleting(true);
      await api.delete(`/admin/categories/${deleteModal.categoryId}`);
      setDeleteModal({ isOpen: false, categoryId: null, categoryName: "" });
      await fetchCategories();
    } catch (err) {
      alert("Failed to delete category");
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = (): void => {
    setDeleteModal({ isOpen: false, categoryId: null, categoryName: "" });
  };

  const getImageUrl = (imageUrl: string | undefined): string => {
    if (!imageUrl) return "";

    // If it's already a full URL, return as is
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return imageUrl;
    }

    // Get base URL without /api
    const baseUrl = API_BASE_URL.replace("/api", "");

    // If URL starts with /categories/, convert to /uploads/categories/
    if (imageUrl.startsWith("/categories/")) {
      return `${baseUrl}/uploads${imageUrl}`;
    }

    // If URL starts with /uploads/, use as is
    if (imageUrl.startsWith("/uploads/")) {
      return `${baseUrl}${imageUrl}`;
    }

    // If URL starts with categories/ (without leading slash), add /uploads/
    if (imageUrl.startsWith("categories/")) {
      return `${baseUrl}/uploads/${imageUrl}`;
    }

    // Otherwise, assume it's a filename and add /uploads/categories/
    return `${baseUrl}/uploads/categories/${imageUrl}`;
  };

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.headline?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="categories-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <>
      <div className="categories-container">
        <div className="categories-header">
          <div>
            <h1 className="categories-title">Categories</h1>
            <p className="categories-subtitle">
              Manage product categories ({filteredCategories.length} total)
            </p>
          </div>
          <Link to="/categories/new" className="add-category-btn">
            <Plus size={20} />
            Add Category
          </Link>
        </div>

        <div className="categories-search-container">
          <div className="search-wrapper">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search categories by name or headline..."
              value={searchTerm}
              onChange={(e: InputChangeEvent) => setSearchTerm(e.target.value)}
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

        {filteredCategories.length === 0 ? (
          <div className="empty-state-categories">
            <FolderTree className="empty-state-icon-categories" size={64} />
            <p className="empty-state-text-categories">
              {searchTerm
                ? "No categories match your search"
                : "No categories found"}
            </p>
            {categories.length === 0 && !searchTerm && (
              <Link
                to="/categories/new"
                className="empty-state-action-categories"
              >
                <Plus size={20} />
                Create your first category
              </Link>
            )}
          </div>
        ) : (
          <div className="categories-table-wrapper">
            <table className="categories-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Slug</th>
                  <th>Headline</th>
                  <th>Accent Gradient</th>
                  <th>Hero Tagline</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((category) => {
                  const imageUrl = getImageUrl(category.image_url);
                  return (
                    <tr key={category.id}>
                      <td>
                        <div className="table-category-cell">
                          {imageUrl && (
                            <img
                              src={imageUrl}
                              alt={category.name}
                              className="table-category-thumbnail"
                              onClick={() =>
                                setImageModal({
                                  isOpen: true,
                                  imageUrl: imageUrl,
                                  title: category.name,
                                })
                              }
                              style={{ cursor: "pointer" }}
                            />
                          )}
                          <div className="table-category-content">
                            <h4
                              className="table-category-name"
                              title={category.name}
                            >
                              {category.name}
                            </h4>
                            {category.description && (
                              <p
                                className="table-category-description"
                                title={category.description}
                              >
                                {category.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          className="table-category-id"
                          title={category.slug}
                        >
                          {category.slug}
                        </span>
                      </td>
                      <td>
                        {category.headline ? (
                          <span
                            className="table-category-headline"
                            title={category.headline}
                          >
                            {category.headline}
                          </span>
                        ) : (
                          <span className="table-no-headline">—</span>
                        )}
                      </td>
                      <td>
                        {category.accent_gradient ? (
                          <span
                            className="table-category-gradient"
                            title={category.accent_gradient}
                          >
                            {category.accent_gradient}
                          </span>
                        ) : (
                          <span className="table-no-headline">—</span>
                        )}
                      </td>
                      <td>
                        {category.hero_tagline ? (
                          <span
                            className="table-category-tagline"
                            title={category.hero_tagline}
                          >
                            {category.hero_tagline}
                          </span>
                        ) : (
                          <span className="table-no-headline">—</span>
                        )}
                      </td>
                      <td>
                        <div className="table-category-actions">
                          <Link
                            to={`/categories/${category.id}/edit`}
                            className="action-btn edit-btn"
                            title="Edit Category"
                          >
                            <Edit size={18} />
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(category)}
                            className="action-btn delete-btn"
                            title="Delete Category"
                            type="button"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Category"
        message="Are you sure you want to delete this category?"
        itemName={deleteModal.categoryName}
        isLoading={deleting}
      />

      {/* Image Modal */}
      {imageModal.isOpen && (
        <div
          className="image-modal-overlay-categories"
          onClick={() =>
            setImageModal({ isOpen: false, imageUrl: "", title: "" })
          }
        >
          <div
            className="image-modal-content-categories"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="image-modal-close-categories"
              onClick={() =>
                setImageModal({ isOpen: false, imageUrl: "", title: "" })
              }
            >
              ×
            </button>
            <img
              src={imageModal.imageUrl}
              alt={imageModal.title}
              className="image-modal-img-categories"
            />
            <p className="image-modal-title-categories">{imageModal.title}</p>
          </div>
        </div>
      )}
    </>
  );
}
