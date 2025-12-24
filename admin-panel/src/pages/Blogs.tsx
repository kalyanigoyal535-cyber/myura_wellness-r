import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  FileText,
  Eye,
  EyeOff,
  Calendar,
  User,
  TrendingUp,
} from "lucide-react";
import { Blog } from "../types";
import DeleteModal from "../components/DeleteModal";
import "../styles/Blogs.css";

export default function Blogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    blogId: number | null;
    blogTitle: string;
  }>({
    isOpen: false,
    blogId: null,
    blogTitle: "",
  });
  const [deleting, setDeleting] = useState<boolean>(false);
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await api.get<
        { results: Blog[]; count?: number } | Blog[]
      >("/admin/blogs");
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];
      setBlogs(data);
      setError(null);
    } catch (err) {
      setError("Failed to load blogs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (blog: Blog): void => {
    setDeleteModal({
      isOpen: true,
      blogId: blog.blog_id,
      blogTitle: blog.title,
    });
  };

  const handleDeleteConfirm = async (): Promise<void> => {
    if (!deleteModal.blogId) return;

    try {
      setDeleting(true);
      await api.delete(`/admin/blogs/${deleteModal.blogId}`);
      setDeleteModal({ isOpen: false, blogId: null, blogTitle: "" });
      await fetchBlogs();
    } catch (err) {
      alert("Failed to delete blog");
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = (): void => {
    setDeleteModal({ isOpen: false, blogId: null, blogTitle: "" });
  };

  const handleTogglePublish = async (
    id: number,
    currentStatus: string
  ): Promise<void> => {
    try {
      setUpdatingStatus(id);
      // Map published boolean to status enum
      const newStatus = currentStatus === "published" ? "draft" : "published";
      await api.patch(`/admin/blogs/${id}`, {
        status: newStatus,
      });
      await fetchBlogs();
    } catch (err) {
      alert("Failed to update blog status");
      console.error(err);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.tags?.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <span className="badge published">PUBLISHED</span>;
      case "draft":
        return <span className="badge draft">DRAFT</span>;
      case "archived":
        return <span className="badge archived">ARCHIVED</span>;
      default:
        return <span className="badge draft">DRAFT</span>;
    }
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="blogs-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <>
      <div className="blogs-container">
        <div className="blogs-header">
          <div>
            <h1 className="blogs-title">Blogs</h1>
            <p className="blogs-subtitle">
              Manage blog posts and articles ({filteredBlogs.length} total)
            </p>
          </div>
          <Link to="/blogs/new" className="add-blog-btn">
            <Plus size={20} />
            New Blog Post
          </Link>
        </div>

        <div className="blogs-search-container">
          <div className="search-wrapper">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search blogs by title, category, tags, or content..."
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

        <div className="blogs-grid">
          {filteredBlogs.length === 0 ? (
            <div className="empty-state-blogs">
              <FileText className="empty-state-icon-blogs" size={64} />
              <p className="empty-state-text-blogs">
                {searchTerm ? "No blogs match your search" : "No blogs found"}
              </p>
              {blogs.length === 0 && !searchTerm && (
                <Link to="/blogs/new" className="empty-state-action-blogs">
                  <Plus size={20} />
                  Create your first blog post
                </Link>
              )}
            </div>
          ) : (
            filteredBlogs.map((blog) => {
              const isPublished = blog.status === "published";
              const isUpdating = updatingStatus === blog.blog_id;

              return (
                <div key={blog.blog_id} className="blog-card">
                  {blog.featured_image_url && (
                    <div className="blog-image-wrapper">
                      <img
                        src={blog.featured_image_url}
                        alt={blog.title}
                        className="blog-image"
                      />
                      <div className="blog-image-overlay">
                        {getStatusBadge(blog.status || "draft")}
                      </div>
                    </div>
                  )}
                  <div className="blog-content">
                    <div className="blog-header">
                      <h3 className="blog-title" title={blog.title}>
                        {blog.title}
                      </h3>
                      {!blog.featured_image_url && (
                        <div className="blog-badges">
                          {getStatusBadge(blog.status || "draft")}
                          {blog.category && (
                            <span className="badge category">
                              {blog.category}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {blog.excerpt && (
                      <p className="blog-excerpt" title={blog.excerpt}>
                        {blog.excerpt}
                      </p>
                    )}

                    <div className="blog-meta">
                      {blog.author_name && (
                        <span className="blog-meta-item">
                          <User size={14} />
                          {blog.author_name}
                        </span>
                      )}
                      {blog.created_at && (
                        <span className="blog-meta-item">
                          <Calendar size={14} />
                          {formatDate(blog.created_at)}
                        </span>
                      )}
                      {(blog.view_count !== undefined ||
                        blog.views !== undefined) && (
                        <span className="blog-meta-item">
                          <TrendingUp size={14} />
                          {blog.view_count || blog.views || 0} views
                        </span>
                      )}
                    </div>

                    {blog.tags && blog.tags.length > 0 && (
                      <div className="blog-tags">
                        {blog.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="tag">
                            {tag}
                          </span>
                        ))}
                        {blog.tags.length > 3 && (
                          <span className="tag tag-more">
                            +{blog.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="blog-actions">
                      <button
                        onClick={() =>
                          handleTogglePublish(
                            blog.blog_id,
                            blog.status || "draft"
                          )
                        }
                        className={`action-btn ${
                          isPublished ? "unpublish" : "publish"
                        }`}
                        title={isPublished ? "Unpublish" : "Publish"}
                        type="button"
                        disabled={isUpdating}
                      >
                        {isUpdating ? (
                          <div className="action-btn-spinner"></div>
                        ) : isPublished ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                      <Link
                        to={`/blogs/${blog.blog_id}/edit`}
                        className="action-btn edit-btn"
                        title="Edit Blog"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(blog)}
                        className="action-btn delete-btn"
                        title="Delete Blog"
                        type="button"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Blog Post"
        message="Are you sure you want to delete this blog post?"
        itemName={deleteModal.blogTitle}
        isLoading={deleting}
      />
    </>
  );
}
