import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Lock, MessageCircle, LogOut, CheckCircle, XCircle, Phone, Settings, Package, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { User as UserType } from '../services/types';

const MyAccount: React.FC = () => {
  const { user, isAuthenticated, login, register, logout } = useAuth();
  const { clear: clearCart, syncCart } = useCart();
  const navigate = useNavigate();
  
  // Form states
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    email: '',
    username: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
    phone_number: '',
  });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const validateLogin = (): boolean => {
    if (!loginData.email || !loginData.password) {
      setError('Please fill in all required fields');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(loginData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const validateRegister = (): boolean => {
    if (!registerData.email || !registerData.username || !registerData.password || !registerData.password2) {
      setError('Please fill in all required fields');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(registerData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (registerData.username.length < 3) {
      setError('Username must be at least 3 characters');
      return false;
    }
    if (registerData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    if (registerData.password !== registerData.password2) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateLogin()) return;

    setIsSubmitting(true);
    try {
      await login({
        email: loginData.email,
        password: loginData.password,
      });
      
      // Sync cart after login
      try {
        await syncCart();
      } catch (cartError) {
        console.error('Cart sync error:', cartError);
      }

      setSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please check your credentials and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateRegister()) return;

    setIsSubmitting(true);
    try {
      await register({
        email: registerData.email,
        username: registerData.username,
        password: registerData.password,
        password2: registerData.password2,
        first_name: registerData.first_name || undefined,
        last_name: registerData.last_name || undefined,
        phone_number: registerData.phone_number || undefined,
      });

      // Sync cart after registration
      try {
        await syncCart();
      } catch (cartError) {
        console.error('Cart sync error:', cartError);
      }

      setSuccess('Registration successful! Redirecting...');
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setError('');
    try {
      // Clear cart before logout
      try {
        await clearCart();
      } catch (cartError) {
        console.error('Cart clear error:', cartError);
      }
      
      await logout();
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Get user initials for avatar
  const getUserInitials = (userData: UserType | null) => {
    if (!userData) return 'U';
    if (userData.first_name && userData.last_name) {
      return `${userData.first_name.charAt(0)}${userData.last_name.charAt(0)}`.toUpperCase();
    } else if (userData.first_name) {
      return userData.first_name.charAt(0).toUpperCase();
    } else if (userData.email) {
      return userData.email.charAt(0).toUpperCase();
    } else if (userData.username) {
      return userData.username.charAt(0).toUpperCase();
    }
    return 'U';
  };

  // If user is authenticated, show profile
  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20">
          <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl font-bold text-white mb-4">MY ACCOUNT</h1>
            <p className="text-xl text-slate-200">
              Welcome back, {user.first_name || user.username || 'User'}!
            </p>
          </div>
        </section>

        {/* Profile Section */}
        <section className="py-20">
          <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Card */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-100">
                  <div className="text-center mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-slate-600 to-slate-800 rounded-full flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4 shadow-lg ring-4 ring-white">
                      {getUserInitials(user)}
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-1">
                      {user.first_name && user.last_name
                        ? `${user.first_name} ${user.last_name}`
                        : user.username || user.email}
                    </h2>
                    <p className="text-slate-600">{user.email}</p>
                    {user.phone_number && (
                      <p className="text-slate-600 mt-1">{user.phone_number}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Link
                      to="/cart"
                      className="flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors text-slate-700"
                    >
                      <Package className="h-5 w-5" />
                      <span className="font-medium">My Cart</span>
                    </Link>
                    <Link
                      to="/order-history"
                      className="flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors text-slate-700"
                    >
                      <Heart className="h-5 w-5" />
                      <span className="font-medium">Order History</span>
                    </Link>
                    <Link
                      to="/contact"
                      className="flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors text-slate-700"
                    >
                      <MessageCircle className="h-5 w-5" />
                      <span className="font-medium">Support</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors font-medium disabled:opacity-50"
                    >
                      <LogOut className="h-5 w-5" />
                      {isLoggingOut ? 'Logging out...' : 'Logout'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Account Details */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-100">
                  <div className="flex items-center gap-3 mb-6">
                    <Settings className="h-6 w-6 text-slate-700" />
                    <h3 className="text-2xl font-bold text-slate-900">Account Details</h3>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          First Name
                        </label>
                        <div className="px-4 py-3 bg-slate-50 rounded-xl border border-slate-200">
                          <p className="text-slate-900">{user.first_name || 'Not set'}</p>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Last Name
                        </label>
                        <div className="px-4 py-3 bg-slate-50 rounded-xl border border-slate-200">
                          <p className="text-slate-900">{user.last_name || 'Not set'}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Email Address
                      </label>
                      <div className="px-4 py-3 bg-slate-50 rounded-xl border border-slate-200">
                        <p className="text-slate-900">{user.email}</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Username
                      </label>
                      <div className="px-4 py-3 bg-slate-50 rounded-xl border border-slate-200">
                        <p className="text-slate-900">{user.username}</p>
                      </div>
                    </div>

                    {user.phone_number && (
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Phone Number
                        </label>
                        <div className="px-4 py-3 bg-slate-50 rounded-xl border border-slate-200">
                          <p className="text-slate-900">{user.phone_number}</p>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Member Since
                      </label>
                      <div className="px-4 py-3 bg-slate-50 rounded-xl border border-slate-200">
                        <p className="text-slate-900">
                          {new Date(user.date_joined).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Not authenticated - show login/register forms
  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">MY ACCOUNT</h1>
          <p className="text-xl text-slate-200">
            Wellness you can feel, results you can see.
          </p>
        </div>
      </section>

      {/* Login/Register Section */}
      <section className="py-20">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Toggle Buttons */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-xl p-1 shadow-lg inline-flex">
              <button
                onClick={() => {
                  setIsLoginMode(true);
                  setError('');
                  setSuccess('');
                }}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  isLoginMode
                    ? 'bg-slate-800 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => {
                  setIsLoginMode(false);
                  setError('');
                  setSuccess('');
                }}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  !isLoginMode
                    ? 'bg-slate-800 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Register
              </button>
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div className="max-w-md mx-auto mb-6 p-4 bg-red-50 border-2 border-red-200 text-red-800 rounded-xl flex items-start gap-3">
              <XCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="max-w-md mx-auto mb-6 p-4 bg-green-50 border-2 border-green-200 text-green-800 rounded-xl flex items-start gap-3">
              <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{success}</p>
            </div>
          )}

          <div className="max-w-md mx-auto">
            {isLoginMode ? (
              /* Login Form */
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-100">
                <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Login</h2>
                
                <form onSubmit={handleLogin} className="space-y-6">
                  <div>
                    <label htmlFor="login-email" className="block text-sm font-semibold text-slate-900 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type="email"
                        id="login-email"
                        name="email"
                        value={loginData.email}
                        onChange={handleLoginChange}
                        className="w-full px-4 py-3 pl-12 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all bg-slate-50 hover:bg-white"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="login-password" className="block text-sm font-semibold text-slate-900 mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        id="login-password"
                        name="password"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        className="w-full px-4 py-3 pl-12 pr-12 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all bg-slate-50 hover:bg-white"
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-slate-800 to-slate-700 text-white py-3 px-6 rounded-xl hover:from-slate-700 hover:to-slate-600 transition-all font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    {isSubmitting ? 'Logging in...' : 'Log In'}
                  </button>

                  <div className="text-center">
                    <Link to="/contact" className="text-sm text-slate-600 hover:text-slate-900 underline">
                      Lost your password?
                    </Link>
                  </div>
                </form>
              </div>
            ) : (
              /* Register Form */
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-100">
                <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Create Account</h2>
                
                <form onSubmit={handleRegister} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="register-first-name" className="block text-sm font-semibold text-slate-900 mb-2">
                        First Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                          type="text"
                          id="register-first-name"
                          name="first_name"
                          value={registerData.first_name}
                          onChange={handleRegisterChange}
                          className="w-full px-4 py-3 pl-12 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all bg-slate-50 hover:bg-white"
                          placeholder="First name"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="register-last-name" className="block text-sm font-semibold text-slate-900 mb-2">
                        Last Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                          type="text"
                          id="register-last-name"
                          name="last_name"
                          value={registerData.last_name}
                          onChange={handleRegisterChange}
                          className="w-full px-4 py-3 pl-12 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all bg-slate-50 hover:bg-white"
                          placeholder="Last name"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="register-email" className="block text-sm font-semibold text-slate-900 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type="email"
                        id="register-email"
                        name="email"
                        value={registerData.email}
                        onChange={handleRegisterChange}
                        className="w-full px-4 py-3 pl-12 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all bg-slate-50 hover:bg-white"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="register-username" className="block text-sm font-semibold text-slate-900 mb-2">
                      Username <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type="text"
                        id="register-username"
                        name="username"
                        value={registerData.username}
                        onChange={handleRegisterChange}
                        className="w-full px-4 py-3 pl-12 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all bg-slate-50 hover:bg-white"
                        placeholder="Choose a username"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="register-phone" className="block text-sm font-semibold text-slate-900 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type="tel"
                        id="register-phone"
                        name="phone_number"
                        value={registerData.phone_number}
                        onChange={handleRegisterChange}
                        className="w-full px-4 py-3 pl-12 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all bg-slate-50 hover:bg-white"
                        placeholder="Phone number (optional)"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="register-password" className="block text-sm font-semibold text-slate-900 mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        id="register-password"
                        name="password"
                        value={registerData.password}
                        onChange={handleRegisterChange}
                        className="w-full px-4 py-3 pl-12 pr-12 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all bg-slate-50 hover:bg-white"
                        placeholder="Create a password (min. 8 characters)"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="register-password2" className="block text-sm font-semibold text-slate-900 mb-2">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="register-password2"
                        name="password2"
                        value={registerData.password2}
                        onChange={handleRegisterChange}
                        className="w-full px-4 py-3 pl-12 pr-12 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all bg-slate-50 hover:bg-white"
                        placeholder="Confirm your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-slate-800 to-slate-700 text-white py-3 px-6 rounded-xl hover:from-slate-700 hover:to-slate-600 transition-all font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    {isSubmitting ? 'Creating Account...' : 'Create Account'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MyAccount;
