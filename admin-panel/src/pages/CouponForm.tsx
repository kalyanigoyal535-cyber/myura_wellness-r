import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { ArrowLeft, Save } from "lucide-react";
import "../styles/CouponForm.css";

interface CouponFormData {
  code: string;
  name: string;
  description: string;
  discount_type: "percentage" | "fixed";
  discount_value: string;
  min_order_amount: string;
  max_discount: string;
  usage_limit: string;
  valid_from: string;
  valid_to: string;
  status: "active" | "inactive";
}

export default function CouponForm(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<CouponFormData>({
    code: "",
    name: "",
    description: "",
    discount_type: "percentage",
    discount_value: "",
    min_order_amount: "0",
    max_discount: "",
    usage_limit: "",
    valid_from: "",
    valid_to: "",
    status: "active",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (id) {
      fetchCoupon();
    }
  }, [id]);

  const fetchCoupon = async (): Promise<void> => {
    if (!id) return;
    try {
      setLoading(true);
      const response = await api.get(`/coupons/${id}`);
      const coupon = response.data;
      setFormData({
        code: coupon.code || "",
        name: coupon.name || "",
        description: coupon.description || "",
        discount_type: coupon.discount_type || "percentage",
        discount_value: coupon.discount_value?.toString() || "",
        min_order_amount: coupon.min_order_amount?.toString() || "0",
        max_discount: coupon.max_discount?.toString() || "",
        usage_limit: coupon.usage_limit?.toString() || "",
        valid_from: coupon.valid_from || "",
        valid_to: coupon.valid_to || "",
        status: coupon.status || "active",
      });
    } catch (err) {
      alert("Failed to load coupon");
      navigate("/coupons");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ): void => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.code.trim()) {
      newErrors.code = "Coupon code is required";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Coupon name is required";
    }

    if (!formData.discount_value || parseFloat(formData.discount_value) <= 0) {
      newErrors.discount_value = "Discount value must be greater than 0";
    }

    if (
      formData.discount_type === "percentage" &&
      parseFloat(formData.discount_value) > 100
    ) {
      newErrors.discount_value = "Percentage discount cannot exceed 100%";
    }

    if (!formData.valid_from) {
      newErrors.valid_from = "Valid from date is required";
    }

    if (!formData.valid_to) {
      newErrors.valid_to = "Valid to date is required";
    }

    if (formData.valid_from && formData.valid_to) {
      if (new Date(formData.valid_from) > new Date(formData.valid_to)) {
        newErrors.valid_to = "Valid to date must be after valid from date";
      }
    }

    if (formData.max_discount && parseFloat(formData.max_discount) < 0) {
      newErrors.max_discount = "Max discount cannot be negative";
    }

    if (formData.usage_limit && parseInt(formData.usage_limit) < 1) {
      newErrors.usage_limit = "Usage limit must be at least 1";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const payload: any = {
        code: formData.code.trim().toUpperCase(),
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        discount_type: formData.discount_type,
        discount_value: parseFloat(formData.discount_value),
        min_order_amount: parseFloat(formData.min_order_amount) || 0,
        max_discount: formData.max_discount
          ? parseFloat(formData.max_discount)
          : null,
        usage_limit: formData.usage_limit
          ? parseInt(formData.usage_limit)
          : null,
        valid_from: formData.valid_from,
        valid_to: formData.valid_to,
        status: formData.status,
      };

      if (id) {
        await api.put(`/coupons/${id}`, payload);
        alert("Coupon updated successfully");
      } else {
        await api.post("/coupons", payload);
        alert("Coupon created successfully");
      }

      navigate("/coupons");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error || err.message || "Failed to save coupon";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="coupon-form-container">
      <div className="coupon-form-header">
        <button
          onClick={() => navigate("/coupons")}
          className="back-btn"
          type="button"
        >
          <ArrowLeft size={20} />
          Back to Coupons
        </button>
        <h1 className="form-title">
          {id ? "Edit Coupon" : "Create New Coupon"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="coupon-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="code" className="form-label">
              Coupon Code <span className="required">*</span>
            </label>
            <input
              type="text"
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              className={`form-input ${errors.code ? "error" : ""}`}
              placeholder="MYURA30"
              required
              disabled={!!id} // Don't allow editing code for existing coupons
            />
            {errors.code && (
              <span className="error-message">{errors.code}</span>
            )}
            {!id && (
              <span className="form-help">
                Code will be automatically converted to uppercase
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Coupon Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`form-input ${errors.name ? "error" : ""}`}
              placeholder="Flat 30% OFF"
              required
            />
            {errors.name && (
              <span className="error-message">{errors.name}</span>
            )}
          </div>

          <div className="form-group full-width">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-textarea"
              placeholder="Valid on all products above ₹999"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="discount_type" className="form-label">
              Discount Type <span className="required">*</span>
            </label>
            <select
              id="discount_type"
              name="discount_type"
              value={formData.discount_type}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount (₹)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="discount_value" className="form-label">
              Discount Value <span className="required">*</span>
            </label>
            <input
              type="number"
              id="discount_value"
              name="discount_value"
              value={formData.discount_value}
              onChange={handleChange}
              className={`form-input ${errors.discount_value ? "error" : ""}`}
              placeholder={
                formData.discount_type === "percentage" ? "30" : "100"
              }
              min="0.01"
              step="0.01"
              required
            />
            {errors.discount_value && (
              <span className="error-message">{errors.discount_value}</span>
            )}
            <span className="form-help">
              {formData.discount_type === "percentage"
                ? "Enter percentage (e.g., 30 for 30%)"
                : "Enter fixed amount in ₹"}
            </span>
          </div>

          {formData.discount_type === "percentage" && (
            <div className="form-group">
              <label htmlFor="max_discount" className="form-label">
                Max Discount (₹)
              </label>
              <input
                type="number"
                id="max_discount"
                name="max_discount"
                value={formData.max_discount}
                onChange={handleChange}
                className={`form-input ${errors.max_discount ? "error" : ""}`}
                placeholder="500"
                min="0"
                step="0.01"
              />
              {errors.max_discount && (
                <span className="error-message">{errors.max_discount}</span>
              )}
              <span className="form-help">
                Maximum discount amount (leave empty for no limit)
              </span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="min_order_amount" className="form-label">
              Minimum Order Amount (₹)
            </label>
            <input
              type="number"
              id="min_order_amount"
              name="min_order_amount"
              value={formData.min_order_amount}
              onChange={handleChange}
              className="form-input"
              placeholder="0"
              min="0"
              step="0.01"
            />
            <span className="form-help">
              Minimum order amount required to use this coupon
            </span>
          </div>

          <div className="form-group">
            <label htmlFor="usage_limit" className="form-label">
              Usage Limit
            </label>
            <input
              type="number"
              id="usage_limit"
              name="usage_limit"
              value={formData.usage_limit}
              onChange={handleChange}
              className={`form-input ${errors.usage_limit ? "error" : ""}`}
              placeholder="100"
              min="1"
            />
            {errors.usage_limit && (
              <span className="error-message">{errors.usage_limit}</span>
            )}
            <span className="form-help">
              Maximum number of times this coupon can be used (leave empty for
              unlimited)
            </span>
          </div>

          <div className="form-group">
            <label htmlFor="valid_from" className="form-label">
              Valid From <span className="required">*</span>
            </label>
            <input
              type="date"
              id="valid_from"
              name="valid_from"
              value={formData.valid_from}
              onChange={handleChange}
              className={`form-input ${errors.valid_from ? "error" : ""}`}
              required
            />
            {errors.valid_from && (
              <span className="error-message">{errors.valid_from}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="valid_to" className="form-label">
              Valid To <span className="required">*</span>
            </label>
            <input
              type="date"
              id="valid_to"
              name="valid_to"
              value={formData.valid_to}
              onChange={handleChange}
              className={`form-input ${errors.valid_to ? "error" : ""}`}
              required
            />
            {errors.valid_to && (
              <span className="error-message">{errors.valid_to}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="status" className="form-label">
              Status <span className="required">*</span>
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate("/coupons")}
            className="cancel-btn"
            disabled={loading}
          >
            Cancel
          </button>
          <button type="submit" className="submit-btn" disabled={loading}>
            <Save size={20} />
            {loading ? "Saving..." : id ? "Update Coupon" : "Create Coupon"}
          </button>
        </div>
      </form>
    </div>
  );
}
