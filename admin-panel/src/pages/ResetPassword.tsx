import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Lock, ArrowLeft, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import '../styles/ResetPassword.css';

export default function ResetPassword() {
  const { uid, token } = useParams<{ uid: string; token: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    new_password: '',
    new_password2: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isValidating, setIsValidating] = useState<boolean>(true);

  useEffect(() => {
    // Validate that uid and token are present
    if (!uid || !token) {
      setMessage({
        type: 'error',
        text: 'Invalid reset link. Please request a new password reset.',
      });
      setIsValidating(false);
    } else {
      setIsValidating(false);
    }
  }, [uid, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear message when user starts typing
    if (message) {
      setMessage(null);
    }
  };

  const togglePasswordVisibility = (field: 'new' | 'confirm') => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!uid || !token) {
      setMessage({
        type: 'error',
        text: 'Invalid reset link. Please request a new password reset.',
      });
      return;
    }

    if (formData.new_password !== formData.new_password2) {
      setMessage({
        type: 'error',
        text: 'Passwords do not match',
      });
      return;
    }

    if (formData.new_password.length < 8) {
      setMessage({
        type: 'error',
        text: 'Password must be at least 8 characters long',
      });
      return;
    }

    setMessage(null);
    setLoading(true);

    try {
      const response = await api.post<{ message: string }>('/auth/password/reset/confirm/', {
        uid,
        token,
        new_password: formData.new_password,
        new_password2: formData.new_password2,
      });

      setMessage({
        type: 'success',
        text: response.data.message || 'Password has been reset successfully',
      });

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.error || error.response?.data?.message || 'Failed to reset password. The link may have expired. Please request a new one.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (isValidating) {
    return (
      <div className="reset-password-container">
        <div className="reset-password-card">
          <div className="reset-password-loading">
            <Loader2 className="reset-password-spinner" size={32} />
            <p>Validating reset link...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <div className="reset-password-header">
          <div className="reset-password-icon-wrapper">
            <Lock className="reset-password-icon" size={32} />
          </div>
          <h1 className="reset-password-title">Reset Password</h1>
          <p className="reset-password-subtitle">
            Enter your new password below
          </p>
        </div>

        {message && (
          <div className={`reset-password-message ${message.type}`}>
            {message.type === 'success' && (
              <CheckCircle2 className="reset-password-success-icon" size={20} />
            )}
            <p className="reset-password-message-text">{message.text}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="reset-password-form">
          <div className="form-group">
            <label htmlFor="new_password" className="form-label">
              New Password
            </label>
            <div className="password-input-wrapper">
              <input
                id="new_password"
                name="new_password"
                type={showPasswords.new ? 'text' : 'password'}
                value={formData.new_password}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Enter new password (min 8 characters)"
                disabled={loading}
                minLength={8}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => togglePasswordVisibility('new')}
                aria-label={showPasswords.new ? 'Hide password' : 'Show password'}
              >
                {showPasswords.new ? (
                  <EyeOff size={20} className="password-toggle-icon" />
                ) : (
                  <Eye size={20} className="password-toggle-icon" />
                )}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="new_password2" className="form-label">
              Confirm New Password
            </label>
            <div className="password-input-wrapper">
              <input
                id="new_password2"
                name="new_password2"
                type={showPasswords.confirm ? 'text' : 'password'}
                value={formData.new_password2}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Confirm new password"
                disabled={loading}
                minLength={8}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => togglePasswordVisibility('confirm')}
                aria-label={showPasswords.confirm ? 'Hide password' : 'Show password'}
              >
                {showPasswords.confirm ? (
                  <EyeOff size={20} className="password-toggle-icon" />
                ) : (
                  <Eye size={20} className="password-toggle-icon" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || message?.type === 'success'}
            className="reset-password-submit-btn"
          >
            {loading ? (
              <>
                <Loader2 className="reset-password-loader" size={20} />
                Resetting...
              </>
            ) : message?.type === 'success' ? (
              <>
                <CheckCircle2 size={20} />
                Password Reset Successful
              </>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>

        <div className="reset-password-footer">
          <Link to="/login" className="reset-password-back-link">
            <ArrowLeft size={16} />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

