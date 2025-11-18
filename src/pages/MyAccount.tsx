import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Lock, MessageCircle } from 'lucide-react';

const MyAccount: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle registration logic here
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 py-20">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">MY ACCOUNT</h1>
          <p className="text-xl text-slate-200">
            Wellness you can feel, results you can see.
          </p>
        </div>
      </section>

      {/* Login/Register Section */}
      <section className="py-20 bg-stone-50">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Login Form */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-3xl font-bold text-slate-900 mb-8">Login</h2>
              
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label htmlFor="login-username" className="block text-sm font-medium text-slate-700 mb-2">
                    Username or email address *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="login-username"
                      name="username"
                      className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      placeholder="Enter your username or email"
                      required
                    />
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label htmlFor="login-password" className="block text-sm font-medium text-slate-700 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="login-password"
                      name="password"
                      className="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      placeholder="Enter your password"
                      required
                    />
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-slate-600 focus:ring-slate-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-slate-700">Remember me</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-600 text-white py-3 px-6 rounded-lg hover:bg-slate-700 transition-colors font-semibold"
                >
                  Log in
                </button>

                <div className="text-center">
                  <Link to="/contact" className="text-sm text-slate-600 hover:text-slate-700 underline">
                    Lost your password?
                  </Link>
                </div>
              </form>
            </div>

            {/* Register Form */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-3xl font-bold text-slate-900 mb-8">Register</h2>
              
              <form onSubmit={handleRegister} className="space-y-6">
                <div>
                  <label htmlFor="register-email" className="block text-sm font-medium text-slate-700 mb-2">
                    Email address *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="register-email"
                      name="email"
                      className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      placeholder="Enter your email address"
                      required
                    />
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-sm text-slate-600">
                    A link to set a new password will be sent to your email address.
                  </p>
                  <p className="text-sm text-slate-600">
                    Your personal data will be used to support your experience throughout this website, 
                    to manage access to your account, and for other purposes described in our privacy policy.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-600 text-white py-3 px-6 rounded-lg hover:bg-slate-700 transition-colors font-semibold"
                >
                  Register
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Account Features */}
      <section className="py-20 bg-white">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Account Benefits</h2>
            <p className="text-lg text-slate-700">
              Create an account to enjoy these exclusive benefits
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="h-8 w-8 text-slate-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Personal Dashboard</h3>
              <p className="text-slate-700">
                Track your orders, manage your profile, and view your wellness journey all in one place.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="h-8 w-8 text-slate-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Exclusive Offers</h3>
              <p className="text-slate-700">
                Get access to special discounts, early product launches, and personalized recommendations.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="h-8 w-8 text-slate-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">24/7 Support</h3>
              <p className="text-slate-700">
                Get personalized wellness advice and support from our team of health experts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Chat Button */}
      <div className="fixed bottom-8 right-8 z-40">
        <div className="flex flex-col items-end space-y-4">
          <div className="relative">
            <button className="w-12 h-12 bg-slate-600 text-white rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors shadow-lg">
              <MessageCircle className="h-6 w-6" />
            </button>
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              1
            </span>
          </div>
          <button className="bg-stone-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-stone-300 transition-colors">
            Contact us
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;

