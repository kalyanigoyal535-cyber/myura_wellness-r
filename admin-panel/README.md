# Myura Wellness Admin Panel

Professional admin panel for managing Myura Wellness e-commerce platform.

## Features

- ✅ Dashboard with statistics and analytics
- ✅ Product Management (CRUD)
- ✅ Category Management (CRUD)
- ✅ Order Management with status updates
- ✅ User Management
- ✅ Contact Submissions Management
- ✅ Authentication with JWT
- ✅ Responsive Design
- ✅ Modern UI matching website theme

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

3. Start development server:
```bash
npm run dev
```

The admin panel will run on `http://localhost:5000`

## Build

```bash
npm run build
```

## Requirements

- Node.js 18+
- Backend API running on port 8080
- Admin user with `is_staff=True` or `is_superuser=True`

## Login

Use admin credentials with staff privileges to access the panel.

