# Myura Wellness Backend Server

Node.js + Express + MySQL backend server for Myura Wellness admin panel and frontend.

## 🚀 Setup Instructions

### 1. Prerequisites

- Node.js (v18 or higher)
- XAMPP (MySQL)
- npm or yarn

### 2. Install Dependencies

```bash
cd server
npm install
```

### 3. Database Setup

#### Step 1: Create Database in phpMyAdmin

1. Open XAMPP and start MySQL
2. Open phpMyAdmin: http://localhost/phpmyadmin
3. Click on "SQL" tab
4. Run this command:

```sql
CREATE DATABASE IF NOT EXISTS myura_wellness CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### Step 2: Import Database Schema

1. In phpMyAdmin, select `myura_wellness` database
2. Click on "Import" tab
3. Choose file: `server/database/schema.sql`
4. Click "Go"

#### Step 3: Configure Environment

1. Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

2. Edit `.env` file with your MySQL credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=          # Leave empty if no password
DB_NAME=myura_wellness
DB_PORT=3306
```

### 4. Start Server

Development mode (with auto-reload):

```bash
npm run dev
```

Production mode:

```bash
npm start
```

Server will run on: `http://localhost:8000`

## 📁 Project Structure

```
server/
├── config/
│   └── database.js          # MySQL connection pool
├── middleware/
│   └── auth.js             # Authentication middleware
├── routes/
│   ├── auth.js             # Authentication routes
│   ├── products.js          # Product routes
│   ├── categories.js        # Category routes
│   └── admin.js             # Admin routes
├── utils/
│   └── jwt.js               # JWT token utilities
├── database/
│   └── schema.sql            # MySQL database schema
├── uploads/                 # File uploads directory
├── server.js                # Main server file
├── package.json
└── .env                     # Environment variables
```

## 🔐 Default Admin Credentials

After migration:

- **Email:** admin@myurawellness.com
- **Password:** admin123

## 📡 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/user` - Get current user
- `POST /api/auth/token/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout

### Products

- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product

### Categories

- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category

### Admin (Requires Authentication)

- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/products` - Get all products (admin)
- `POST /api/admin/products` - Create product
- `PATCH /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/categories` - Get all categories (admin)
- `POST /api/admin/categories` - Create category
- `PATCH /api/admin/categories/:id` - Update category
- `DELETE /api/admin/categories/:id` - Delete category
- `GET /api/admin/orders` - Get all orders
- `GET /api/admin/orders/:id` - Get single order
- `PATCH /api/admin/orders/:id/update_status` - Update order status
- `GET /api/admin/users` - Get all users
- `GET /api/admin/contacts` - Get all contact submissions
- `PATCH /api/admin/contacts/:id/mark_read` - Mark contact as read

### Contact

- `POST /api/contact` - Submit contact form

## 🔧 Environment Variables

```env
PORT=8000
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=myura_wellness
DB_PORT=3306

JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-refresh-secret-key-change-this
JWT_REFRESH_EXPIRES_IN=30d

CORS_ORIGIN=http://localhost:5000,http://localhost:3000
```

## 📝 Notes

- File uploads are stored in `server/uploads/` directory
- Images are served at `/uploads/:filename`
- JWT tokens are used for authentication
- Admin routes require `is_staff` or `is_superuser` flag

## 🐛 Troubleshooting

### Database Connection Error

- Make sure XAMPP MySQL is running
- Check database credentials in `.env`
- Verify database `myura_wellness` exists

### Database Issues

- Check MySQL connection settings
- Verify database schema is imported

### Port Already in Use

- Change `PORT` in `.env` file
- Or stop the process using port 8000
