import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { ArrowLeft, Save } from "lucide-react";
import {
  BlogFormData,
  InputChangeEvent,
  TextareaChangeEvent,
  FormSubmitEvent,
} from "../types";
import "../styles/BlogForm.css";

export default function BlogForm(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<
    BlogFormData & {
      author_id?: number;
      status?: string;
      meta_title?: string;
      meta_description?: string;
    }
  >({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    author: "",
    author_id: undefined,
    published: false,
    status: "draft",
    tags: [],
    category: "",
    meta_title: "",
    meta_description: "",
  });

  useEffect(() => {
    if (id) {
      fetchBlog();
    }
  }, [id]);

  const fetchBlog = async (): Promise<void> => {
    if (!id) return;
    try {
      setLoading(true);
      const response = await api.get<
        BlogFormData & {
          blog_id?: number;
          id?: number;
          published?: boolean;
          status?: string;
          excerpt?: string;
          author_name?: string;
          author_id?: number;
          meta_title?: string;
          meta_description?: string;
          featured_image?: string;
          featured_image_url?: string;
        }
      >(`/admin/blogs/${id}`);
      const blog = response.data;

      // Determine published status from status field
      const isPublished =
        blog.status === "published" || blog.published === true;

      setFormData({
        title: blog.title || "",
        slug: blog.slug || "",
        excerpt: blog.excerpt || "",
        content: blog.content || "",
        author: blog.author || blog.author_name || "",
        author_id: blog.author_id,
        published: isPublished,
        status: blog.status || (isPublished ? "published" : "draft"),
        tags: Array.isArray(blog.tags) ? blog.tags : [],
        category: blog.category || "",
        meta_title: blog.meta_title || "",
        meta_description: blog.meta_description || "",
        featured_image: blog.featured_image_url ? null : undefined,
      });
    } catch (err) {
      console.error("Failed to load blog:", err);
      alert("Failed to load blog. Please try again.");
      navigate("/blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: InputChangeEvent | TextareaChangeEvent): void => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleTagsChange = (e: TextareaChangeEvent): void => {
    const tags = e.target.value
      .split(",")
      .map((tag: string) => tag.trim())
      .filter((tag: string) => tag);
    setFormData({ ...formData, tags });
  };

  const handleMetaDescriptionChange = (e: TextareaChangeEvent): void => {
    const value = e.target.value;
    // Limit to 160 characters for SEO best practices
    if (value.length <= 160) {
      setFormData({ ...formData, meta_description: value });
    }
  };

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (e: InputChangeEvent): void => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      slug: formData.slug || generateSlug(title),
    });
  };

  const handleSubmit = async (e: FormSubmitEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        const formKey = key as keyof BlogFormData;
        const value = formData[formKey];

        if (formKey === "featured_image" && value) {
          if (value instanceof File) {
            data.append(formKey, value);
          }
        } else if (formKey === "tags") {
          data.append(formKey, JSON.stringify(value || []));
        } else if (formKey === "published") {
          const status = value ? "published" : "draft";
          data.append("status", status);
        } else if (formKey === "meta_title" && value) {
          data.append("meta_title", String(value));
        } else if (formKey === "meta_description" && value) {
          data.append("meta_description", String(value));
        } else if (value !== null && value !== "" && value !== undefined) {
          if (typeof value === "string") {
            data.append(formKey, value);
          } else if (value instanceof File) {
            data.append(formKey, value);
          } else {
            data.append(formKey, String(value));
          }
        }
      });

      if (id) {
        await api.patch(`/admin/blogs/${id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/admin/blogs", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      navigate("/blogs");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      alert(error.response?.data?.error || "Failed to save blog");
    } finally {
      setLoading(false);
    }
  };

  if (loading && id) {
    return (
      <div className="blog-form-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="blog-form-container">
      <div className="blog-form-header">
        <button
          onClick={() => navigate("/blogs")}
          className="back-btn"
          type="button"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="blog-form-title">
            {id ? "Edit Blog Post" : "New Blog Post"}
          </h1>
          <p className="blog-form-subtitle">
            {id ? "Update blog post information" : "Create a new blog post"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="blog-form-card">
        <div className="form-grid">
          <div className="form-group full-width">
            <label htmlFor="title" className="form-label required">
              Title
            </label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleTitleChange}
              required
              className="form-input"
              placeholder="Enter blog title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="slug" className="form-label required">
              Slug
            </label>
            <input
              id="slug"
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="blog-post-url-slug"
            />
            <p className="help-text">URL-friendly version of the title</p>
          </div>

          <div className="form-group">
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <input
              id="category"
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g., Health, Wellness"
            />
          </div>

          <div className="form-group">
            <label htmlFor="author" className="form-label">
              Author
            </label>
            <input
              id="author"
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="form-input"
              placeholder="Author name"
            />
          </div>

          <div className="form-group">
            <div className="checkbox-group">
              <input
                id="published"
                type="checkbox"
                name="published"
                checked={formData.published}
                onChange={handleChange}
                className="checkbox-input"
              />
              <label htmlFor="published" className="checkbox-label">
                Published
              </label>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="excerpt" className="form-label">
            Excerpt
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt || ""}
            onChange={handleChange}
            rows={3}
            className="form-textarea"
            placeholder="Short description of the blog post"
          />
          <p className="help-text">
            A brief summary that appears in blog listings (optional)
          </p>
        </div>

        <div className="form-group">
          <label htmlFor="meta_title" className="form-label">
            Meta Title (SEO)
          </label>
          <input
            id="meta_title"
            type="text"
            name="meta_title"
            value={formData.meta_title || ""}
            onChange={handleChange}
            className="form-input"
            placeholder="SEO title for search engines"
          />
          <p className="help-text">
            Title for search engines (leave empty to use blog title)
          </p>
        </div>

        <div className="form-group">
          <label htmlFor="meta_description" className="form-label">
            Meta Description (SEO)
          </label>
          <textarea
            id="meta_description"
            name="meta_description"
            value={formData.meta_description || ""}
            onChange={handleMetaDescriptionChange}
            rows={2}
            className="form-textarea"
            placeholder="SEO description for search engines"
            maxLength={160}
          />
          <p className="help-text">
            Description for search engines (
            {formData.meta_description?.length || 0}/160 characters)
          </p>
        </div>

        <div className="form-group">
          <label htmlFor="content" className="form-label required">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={15}
            className="form-textarea content-textarea"
            placeholder="Write your blog post content here..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="tags" className="form-label">
            Tags (comma-separated)
          </label>
          <textarea
            id="tags"
            value={(formData.tags || []).join(", ")}
            onChange={handleTagsChange}
            rows={2}
            className="form-textarea"
            placeholder="health, wellness, nutrition"
          />
        </div>

        <div className="form-group">
          <label htmlFor="featured_image" className="form-label">
            Featured Image
          </label>
          <input
            id="featured_image"
            type="file"
            name="featured_image"
            accept="image/*"
            onChange={(e: InputChangeEvent) => {
              setFormData({
                ...formData,
                featured_image: e.target.files?.[0] || null,
              });
            }}
            className="form-input"
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate("/blogs")}
            className="cancel-btn"
          >
            Cancel
          </button>
          <button type="submit" disabled={loading} className="save-btn">
            <Save size={18} />
            {loading ? "Saving..." : "Save Blog Post"}
          </button>
        </div>
      </form>
    </div>
  );
}
