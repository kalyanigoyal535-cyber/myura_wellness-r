import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Save } from 'lucide-react';
import { ProductFormData, ProductCategory, Product, InputChangeEvent, TextareaChangeEvent, SelectChangeEvent, FormSubmitEvent } from '../types';
import '../styles/ProductForm.css';

export default function ProductForm(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [formData, setFormData] = useState<ProductFormData>({
    category: '',
    name: '',
    headline: '',
    price: '',
    original_price: '',
    rating: '0',
    reviews_count: '0',
    in_stock: true,
    accent_gradient: '',
    summary: '',
    description: '',
    key_ingredients: '',
    suitable_for: '',
    how_to_use: '',
    faqs: '',
    hero_tagline: '',
    notes: [],
    benefits: [],
    image: null,
  });

  useEffect(() => {
    fetchCategories();
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchCategories = async (): Promise<void> => {
    try {
      const response = await api.get<{ results: ProductCategory[] } | ProductCategory[]>('/categories');
      const data = Array.isArray(response.data) ? response.data : response.data.results || [];
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  const fetchProduct = async (): Promise<void> => {
    if (!id) return;
    try {
      setLoading(true);
      const response = await api.get<Product>(`/admin/products/${id}`);
      const product = response.data;
      setFormData({
        category: product.category_id || '',
        name: product.name || '',
        headline: product.headline || '',
        price: product.price?.toString() || '',
        original_price: product.original_price?.toString() || '',
        rating: product.rating?.toString() || '0',
        reviews_count: product.reviews_count?.toString() || '0',
        in_stock: product.in_stock !== undefined ? product.in_stock : true,
        accent_gradient: product.accent_gradient || '',
        summary: product.summary || '',
        description: product.description || '',
        key_ingredients: product.key_ingredients || '',
        suitable_for: product.suitable_for || '',
        how_to_use: product.how_to_use || '',
        faqs: product.faqs || '',
        hero_tagline: product.hero_tagline || '',
        notes: Array.isArray(product.notes) ? product.notes : [],
        benefits: Array.isArray(product.benefits) ? product.benefits : [],
        image: null,
      });
    } catch (err) {
      alert('Failed to load product');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: InputChangeEvent | TextareaChangeEvent | SelectChangeEvent): void => {
    const { name, value, type } = e.target;
    const target = e.target as HTMLInputElement;
    const checked = target.checked;
    const files = target.files;

    if (type === 'file' && files && files.length > 0) {
      setFormData({ ...formData, [name]: files[0] });
    } else if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleArrayChange = (field: 'notes' | 'benefits', value: string): void => {
    const items = value.split('\n').filter((item: string) => item.trim());
    setFormData({ ...formData, [field]: items });
  };

  const handleSubmit = async (e: FormSubmitEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        const formKey = key as keyof ProductFormData;
        const value = formData[formKey];
        
        if (formKey === 'image' && value) {
          if (value instanceof File) {
            data.append(formKey, value);
          }
        } else if (formKey === 'notes' || formKey === 'benefits') {
          if (Array.isArray(value)) {
            value.forEach((item: string) => data.append(formKey, item));
          }
        } else if (value !== null && value !== '' && value !== undefined) {
          data.append(formKey, value.toString());
        }
      });

      if (id) {
        await api.patch(`/admin/products/${id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/admin/products', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      navigate('/products');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      alert(error.response?.data?.error || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  if (loading && id) {
    return (
      <div className="product-form-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="product-form-container">
      <div className="product-form-header">
        <button
          onClick={() => navigate('/products')}
          className="back-btn"
          type="button"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="product-form-title">
            {id ? 'Edit Product' : 'New Product'}
          </h1>
          <p className="product-form-subtitle">
            {id ? 'Update product information' : 'Create a new product'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="product-form-card">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="category" className="form-label required">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="form-select"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="name" className="form-label required">
              Product Name
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
            <label htmlFor="price" className="form-label required">
              Price (₹)
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="original_price" className="form-label">
              Original Price (₹)
            </label>
            <input
              id="original_price"
              type="number"
              step="0.01"
              name="original_price"
              value={formData.original_price}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="rating" className="form-label">
              Rating
            </label>
            <input
              id="rating"
              type="number"
              step="0.1"
              min="0"
              max="5"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="reviews_count" className="form-label">
              Reviews Count
            </label>
            <input
              id="reviews_count"
              type="number"
              name="reviews_count"
              value={formData.reviews_count}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <div className="checkbox-group">
              <input
                id="in_stock"
                type="checkbox"
                name="in_stock"
                checked={formData.in_stock}
                onChange={handleChange}
                className="checkbox-input"
              />
              <label htmlFor="in_stock" className="checkbox-label">
                In Stock
              </label>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="summary" className="form-label required">
            Summary
          </label>
          <textarea
            id="summary"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            required
            rows={3}
            className="form-textarea"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label required">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={5}
            className="form-textarea"
          />
        </div>

        <div className="form-group">
          <label htmlFor="key_ingredients" className="form-label required">
            Key Ingredients
          </label>
          <textarea
            id="key_ingredients"
            name="key_ingredients"
            value={formData.key_ingredients}
            onChange={handleChange}
            required
            rows={4}
            className="form-textarea"
          />
        </div>

        <div className="form-group">
          <label htmlFor="suitable_for" className="form-label required">
            Suitable For
          </label>
          <textarea
            id="suitable_for"
            name="suitable_for"
            value={formData.suitable_for}
            onChange={handleChange}
            required
            rows={3}
            className="form-textarea"
          />
        </div>

        <div className="form-group">
          <label htmlFor="how_to_use" className="form-label required">
            How to Use
          </label>
          <textarea
            id="how_to_use"
            name="how_to_use"
            value={formData.how_to_use}
            onChange={handleChange}
            required
            rows={4}
            className="form-textarea"
          />
        </div>

        <div className="form-group">
          <label htmlFor="faqs" className="form-label required">
            FAQs
          </label>
          <textarea
            id="faqs"
            name="faqs"
            value={formData.faqs}
            onChange={handleChange}
            required
            rows={5}
            className="form-textarea"
          />
        </div>

        <div className="form-group">
          <label htmlFor="benefits" className="form-label">
            Benefits (one per line)
          </label>
          <textarea
            id="benefits"
            value={formData.benefits.join('\n')}
            onChange={(e: TextareaChangeEvent) => handleArrayChange('benefits', e.target.value)}
            rows={4}
            className="form-textarea"
            placeholder="Enter benefits, one per line"
          />
        </div>

        <div className="form-group">
          <label htmlFor="notes" className="form-label">
            Notes (one per line)
          </label>
          <textarea
            id="notes"
            value={formData.notes.join('\n')}
            onChange={(e: TextareaChangeEvent) => handleArrayChange('notes', e.target.value)}
            rows={3}
            className="form-textarea"
            placeholder="Enter notes, one per line"
          />
        </div>

        <div className="form-group">
          <label htmlFor="image" className="form-label">
            Product Image
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
            onClick={() => navigate('/products')}
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
            {loading ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  );
}

