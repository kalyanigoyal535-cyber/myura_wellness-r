import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  MessageSquare,
  FileText,
  LogOut,
  Menu,
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  type LucideIcon,
} from "lucide-react";
import "../styles/Layout.css";

interface MenuItem {
  path: string;
  label: string;
  icon: LucideIcon;
}

const menuItems: MenuItem[] = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/products", label: "Products", icon: Package },
  { path: "/categories", label: "Categories", icon: FolderTree },
  { path: "/orders", label: "Orders", icon: ShoppingCart },
  { path: "/blogs", label: "Blogs", icon: FileText },
  { path: "/users", label: "Users", icon: Users },
  { path: "/contacts", label: "Contacts", icon: MessageSquare },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [notificationSidebarOpen, setNotificationSidebarOpen] = useState<boolean>(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Get display name: For admins use name, for users use first_name + last_name, or username, or email
  const getDisplayName = (): string => {
    // Admins have name field
    if ((user as any)?.name) {
      return (user as any).name;
    }
    // Regular users have first_name/last_name
    if (user?.first_name || user?.last_name) {
      return `${user.first_name || ""} ${user.last_name || ""}`.trim();
    }
    if (user?.username) {
      return user.username;
    }
    if (user?.email) {
      return user.email.replace("@gmail.com", "").replace("@", "");
    }
    return "Admin";
  };

  return (
    <div className="layout-container">
      <aside
        className={`sidebar-layout ${sidebarOpen ? "open" : ""} ${
          sidebarCollapsed ? "collapsed" : ""
        }`}
      >
        <div className="sidebar-header-layout">
          {!sidebarCollapsed && (
            <h1 className="sidebar-logo-layout">Myura Admin</h1>
          )}
          <button
            className="sidebar-toggle-collapse"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </button>
        </div>
        <nav className="sidebar-nav-layout">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item-layout ${isActive ? "active" : ""}`}
                onClick={() => setSidebarOpen(false)}
                title={sidebarCollapsed ? item.label : ""}
              >
                <Icon size={20} className="nav-icon-layout" />
                {!sidebarCollapsed && (
                  <span className="nav-label-layout">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="sidebar-footer-layout">
          <Link
            to="/account"
            className="user-info-layout"
            onClick={() => setSidebarOpen(false)}
            title={sidebarCollapsed ? "My Account" : ""}
          >
            <div className="user-avatar-layout">
              {(user as any)?.photo ? (
                <img 
                  src={(user as any).photo} 
                  alt="Avatar" 
                  className="user-avatar-image-layout"
                />
              ) : (
                (
                  (user as any)?.name?.charAt(0) ||
                  user?.first_name?.charAt(0) ||
                  user?.last_name?.charAt(0) ||
                  user?.username?.charAt(0) ||
                  user?.email?.charAt(0)
                )?.toUpperCase()
              )}
            </div>
            {!sidebarCollapsed && (
              <div className="user-details-layout">
                <p className="user-name-layout">{getDisplayName()}</p>
                <p className="user-role-layout">
                  {user?.is_superuser ? "Super Admin" : "Admin"}
                </p>
              </div>
            )}
          </Link>
          <button
            className="logout-btn-layout"
            onClick={handleLogout}
            title={sidebarCollapsed ? "Logout" : ""}
          >
            <LogOut size={18} />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <div
        className={`main-content-layout ${
          sidebarCollapsed ? "sidebar-collapsed" : ""
        }`}
      >
        <header className="top-header-layout">
          <button
            className="menu-toggle-layout"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={24} />
          </button>
          {sidebarCollapsed && (
            <h1 className="header-logo-layout">Myura Admin</h1>
          )}
          <div className="header-spacer-layout"></div>
          <div className="header-right-layout">
            <div className="header-search-container-layout">
              <Search size={18} className="search-icon-layout" />
              <input
                type="text"
                placeholder="Search..."
                className="header-search-input-layout"
              />
            </div>
            <div className="header-actions-layout">
              <button 
                className="notification-btn-layout" 
                title="Notifications"
                onClick={() => setNotificationSidebarOpen(!notificationSidebarOpen)}
              >
                <Bell size={20} />
                <span className="notification-badge-layout">3</span>
              </button>
            </div>
          </div>
        </header>
        <main className="page-content-layout">
          <Outlet />
        </main>
      </div>

      {sidebarOpen && (
        <div
          className="sidebar-overlay-layout"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Notification Sidebar */}
      <div
        className={`notification-sidebar-layout ${
          notificationSidebarOpen ? "open" : ""
        }`}
      >
        <div className="notification-sidebar-header-layout">
          <h2 className="notification-sidebar-title-layout">Notifications</h2>
          <button
            className="notification-sidebar-close-layout"
            onClick={() => setNotificationSidebarOpen(false)}
          >
            <ChevronRight size={20} />
          </button>
        </div>
        <div className="notification-sidebar-content-layout">
          <div className="notification-item-layout">
            <div className="notification-item-icon-layout">
              <Bell size={18} />
            </div>
            <div className="notification-item-details-layout">
              <p className="notification-item-title-layout">New Order Received</p>
              <p className="notification-item-time-layout">2 minutes ago</p>
            </div>
          </div>
          <div className="notification-item-layout">
            <div className="notification-item-icon-layout">
              <MessageSquare size={18} />
            </div>
            <div className="notification-item-details-layout">
              <p className="notification-item-title-layout">New Contact Message</p>
              <p className="notification-item-time-layout">15 minutes ago</p>
            </div>
          </div>
          <div className="notification-item-layout">
            <div className="notification-item-icon-layout">
              <Users size={18} />
            </div>
            <div className="notification-item-details-layout">
              <p className="notification-item-title-layout">New User Registered</p>
              <p className="notification-item-time-layout">1 hour ago</p>
            </div>
          </div>
        </div>
      </div>

      {notificationSidebarOpen && (
        <div
          className="notification-sidebar-overlay-layout"
          onClick={() => setNotificationSidebarOpen(false)}
        />
      )}
    </div>
  );
}
