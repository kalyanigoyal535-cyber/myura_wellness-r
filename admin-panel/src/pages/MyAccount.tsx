import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import {
  User,
  Mail,
  Camera,
  Save,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  UserCircle,
} from "lucide-react";
import "../styles/MyAccount.css";

export default function MyAccount() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Profile form state - For admins, use name field
  const [profileData, setProfileData] = useState({
    name: (user as any)?.name || user?.first_name || "",
    email: user?.email || "",
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Avatar state
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const response = await api.get("/auth/user");
        const userData = response.data;
        setProfileData({
          name: (userData as any)?.name || userData?.first_name || "",
          email: userData.email || "",
        });
        // Set avatar preview if photo exists
        if ((userData as any)?.photo) {
          setAvatarPreview((userData as any).photo);
        }
      } catch (error) {
        console.error("Failed to fetch admin profile:", error);
      }
    };

    if (user) {
      setProfileData({
        name: (user as any)?.name || user?.first_name || "",
        email: user.email || "",
      });
      // Also fetch fresh data from backend
      fetchAdminProfile();
    }
  }, [user]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: "error", text: "Image size must be less than 5MB" });
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      if (profileData.name) {
        formData.append("name", profileData.name);
      }
      if (avatarFile) {
        formData.append("photo", avatarFile);
      }

      await api.patch("/admin/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage({ type: "success", text: "Profile updated successfully" });
      setAvatarFile(null);

      // Refresh user data
      const response = await api.get("/auth/user");
      if (response.data) {
        const userData = response.data;
        // Update local state with new data
        setProfileData({
          name: (userData as any)?.name || userData?.first_name || "",
          email: userData.email || "",
        });
        // Update avatar preview if photo was updated
        if ((userData as any)?.photo) {
          setAvatarPreview((userData as any).photo);
        }
        // Reload to update context and sidebar
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.response?.data?.error || "Failed to update profile",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters",
      });
      setLoading(false);
      return;
    }

    try {
      await api.post("/admin/reset-password", {
        current_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
      });

      setMessage({ type: "success", text: "Password changed successfully" });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.response?.data?.error || "Failed to change password",
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field],
    });
  };

  if (!user) {
    return (
      <div className="myaccount-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="myaccount-container">
      <div className="myaccount-header">
        <h1 className="myaccount-title">My Account</h1>
        <p className="myaccount-subtitle">
          Manage your profile and account settings
        </p>
      </div>

      {message && (
        <div className={`myaccount-message myaccount-message-${message.type}`}>
          {message.type === "success" ? (
            <CheckCircle size={20} />
          ) : (
            <XCircle size={20} />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div className="myaccount-tabs">
        <button
          className={`myaccount-tab ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          <User size={20} />
          Profile
        </button>
        <button
          className={`myaccount-tab ${
            activeTab === "password" ? "active" : ""
          }`}
          onClick={() => setActiveTab("password")}
        >
          <Lock size={20} />
          Change Password
        </button>
      </div>

      <div className="myaccount-content">
        {activeTab === "profile" && (
          <form onSubmit={handleProfileSubmit} className="myaccount-form">
            <div className="myaccount-avatar-section">
              <div className="myaccount-avatar-wrapper">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="myaccount-avatar-preview"
                  />
                ) : (user as any)?.photo ? (
                  <img
                    src={(user as any).photo}
                    alt="Avatar"
                    className="myaccount-avatar-preview"
                  />
                ) : (
                  <div className="myaccount-avatar-placeholder">
                    {(
                      (user as any)?.name?.charAt(0) ||
                      user?.first_name?.charAt(0) ||
                      user?.last_name?.charAt(0) ||
                      user?.username?.charAt(0) ||
                      user?.email?.charAt(0)
                    )?.toUpperCase()}
                  </div>
                )}
                <label className="myaccount-avatar-upload">
                  <Camera size={20} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="myaccount-avatar-input"
                  />
                </label>
              </div>
              <p className="myaccount-avatar-hint">
                Click to change avatar (Max 5MB)
              </p>
            </div>

            <div className="myaccount-form-group">
              <label htmlFor="name" className="myaccount-label">
                <UserCircle size={18} />
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                className="myaccount-input"
                required
              />
            </div>

            <div className="myaccount-form-group">
              <label htmlFor="email" className="myaccount-label">
                <Mail size={18} />
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={profileData.email}
                className="myaccount-input"
                disabled
              />
              <p className="myaccount-hint">Email cannot be changed</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="myaccount-submit-btn"
            >
              <Save size={20} />
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        )}

        {activeTab === "password" && (
          <form onSubmit={handlePasswordSubmit} className="myaccount-form">
            <div className="myaccount-form-group">
              <label htmlFor="currentPassword" className="myaccount-label">
                <Lock size={18} />
                Current Password
              </label>
              <div className="myaccount-password-wrapper">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="myaccount-input"
                  required
                />
                <button
                  type="button"
                  className="myaccount-password-toggle"
                  onClick={() => togglePasswordVisibility("current")}
                >
                  {showPasswords.current ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            <div className="myaccount-form-group">
              <label htmlFor="newPassword" className="myaccount-label">
                <Lock size={18} />
                New Password
              </label>
              <div className="myaccount-password-wrapper">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="myaccount-input"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="myaccount-password-toggle"
                  onClick={() => togglePasswordVisibility("new")}
                >
                  {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="myaccount-form-group">
              <label htmlFor="confirmPassword" className="myaccount-label">
                <Lock size={18} />
                Confirm New Password
              </label>
              <div className="myaccount-password-wrapper">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="myaccount-input"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="myaccount-password-toggle"
                  onClick={() => togglePasswordVisibility("confirm")}
                >
                  {showPasswords.confirm ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="myaccount-submit-btn"
            >
              <Lock size={20} />
              {loading ? "Changing..." : "Change Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
