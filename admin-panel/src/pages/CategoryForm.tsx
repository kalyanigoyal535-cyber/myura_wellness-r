import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Save } from 'lucide-react';
import { CategoryFormData, ProductCategory, InputChangeEvent, TextareaChangeEvent, FormSubmitEvent } from '../types';
import '../styles/CategoryForm.css';

export default function CategoryForm(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<CategoryFormData>({
    id: '',
    name: '',
    headline: '',
    description: '',
    accent_gradient: '',
    hero_tagline: '',
    image: null,
  });

  useEffect(() => {
    if (id) {
      fetchCategory();
    }
  }, [id]);

  const fetchCategory = async (): Promise<void> => {
    if (!id) return;
    try {
      setLoading(true);
      const response = await api.get<ProductCategory>(`/admin/categories/${id}`);
      const category = response.data;
      setFormData({
        id: category.id || '',
        name: category.name || '',
        headline: category.headline || '',
        description: category.description || '',
        accent_gradient: category.accent_gradient || '',
        hero_tagline: category.hero_tagline || '',
        image: null,
      });
    } catch (err) {
      alert('Failed to load category');
      navigate('/categories');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: InputChangeEvent | TextareaChangeEvent): void => {
    const { name, value } = e.target;
    const target = e.target as HTMLInputElement;
    const files = target.files;

    if (files && files.length > 0) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: FormSubmitEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        const formKey = key as keyof CategoryFormData;
        const value = formData[formKey];
        
        if (formKey === 'image' && value) {
          data.append(formKey, value);
        } else if (value !== null && value !== '' && value !== undefined) {
          data.append(formKey, value.toString());
        }
      });

      if (id) {
        await api.patch(`/admin/categories/${id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/admin/categories', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      navigate('/categories');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      alert(error.response?.data?.error || 'Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  if (loading && id) {
    return (
      <div className="category-form-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="category-form-container">
      <div className="category-form-header">
        <button
          onClick={() => navigate('/categories')}
          className="back-btn"
          type="button"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="category-form-title">
            {id ? 'Edit Category' : 'New Category'}
          </h1>
          <p className="category-form-subtitle">
            {id ? 'Update category information' : 'Create a new category'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="category-form-card">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="id" className="form-label required">
              Category ID (Slug)
            </label>
            <input
              id="id"
              type="text"
              name="id"
              value={formData.id}
              onChange={handleChange}
              required
              disabled={!!id}
              className="form-input"
              placeholder="e.g., dia-care"
            />
            {!id && (
              <p className="help-text">
                This will be used as the URL slug (lowercase, hyphens)
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="name" className="form-label required">
              Category Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="headline" className="form-label">
              Headline
            </label>
            <input
              id="headline"
              type="text"
              name="headline"
              value={formData.headline}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="accent_gradient" className="form-label">
              Accent Gradient
            </label>
            <input
              id="accent_gradient"
              type="text"
              name="accent_gradient"
              value={formData.accent_gradient}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g., from-green-500 to-emerald-600"
            />
          </div>

          <div className="form-group">
            <label htmlFor="hero_tagline" className="form-label">
              Hero Tagline
            </label>
            <input
              id="hero_tagline"
              type="text"
              name="hero_tagline"
              value={formData.hero_tagline}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            className="form-textarea"
          />
        </div>

        <div className="form-group">
          <label htmlFor="image" className="form-label">
            Category Image
          </label>
          <input
            id="image"
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/categories')}
            className="cancel-btn"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="save-btn"
          >
            <Save size={18} />
            {loading ? 'Saving...' : 'Save Category'}
          </button>
        </div>
      </form>
    </div>
  );
}

