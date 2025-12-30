import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import ProductForm from "./pages/ProductForm";
import Categories from "./pages/Categories";
import CategoryForm from "./pages/CategoryForm";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import Carts from "./pages/Carts";
import CartDetail from "./pages/CartDetail";
import Users from "./pages/Users";
import Contacts from "./pages/Contacts";
import Blogs from "./pages/Blogs";
import BlogForm from "./pages/BlogForm";
import Coupons from "./pages/Coupons";
import CouponForm from "./pages/CouponForm";
import Notifications from "./pages/Notifications";
import MyAccount from "./pages/MyAccount";
import Layout from "./components/Layout";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--stone-50)",
        }}
      >
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="products/new" element={<ProductForm />} />
        <Route path="products/:id/edit" element={<ProductForm />} />
        <Route path="categories" element={<Categories />} />
        <Route path="categories/new" element={<CategoryForm />} />
        <Route path="categories/:id/edit" element={<CategoryForm />} />
        <Route path="orders" element={<Orders />} />
        <Route path="orders/:id" element={<OrderDetail />} />
        <Route path="carts" element={<Carts />} />
        <Route path="carts/:id" element={<CartDetail />} />
        <Route path="users" element={<Users />} />
        <Route path="contacts" element={<Contacts />} />
        <Route path="blogs" element={<Blogs />} />
        <Route path="blogs/new" element={<BlogForm />} />
        <Route path="blogs/:id/edit" element={<BlogForm />} />
        <Route path="coupons" element={<Coupons />} />
        <Route path="coupons/new" element={<CouponForm />} />
        <Route path="coupons/:id/edit" element={<CouponForm />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="account" element={<MyAccount />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
