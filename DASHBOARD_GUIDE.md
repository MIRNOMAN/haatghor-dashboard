# HaatGhor Dashboard - Complete Guide

## 🎉 Overview

A modern, responsive admin dashboard for the HaatGhor e-commerce platform built with Next.js 16, TypeScript, shadcn/ui, and Redux Toolkit.

## ✨ Features Implemented

### 1. **Dashboard Overview** (`/`)
- Real-time statistics cards (Revenue, Orders, Products, Users)
- Additional metrics (Pending Orders, Today's Revenue, Monthly Revenue)
- Growth trends with percentage indicators
- Quick action links to main modules
- Fully responsive with skeleton loading states

### 2. **Product Management** (`/products`)
- ✅ **List Products** - Paginated table view with search
- ✅ **Create Product** (`/products/new`) - Complete form with validation
- ✅ **Edit Product** (`/products/[id]/edit`) - Update existing products
- ✅ **Delete Product** - With confirmation dialog
- Features:
  - Product images and thumbnails
  - Category assignment
  - Price and discount pricing
  - Stock management
  - Status badges (Active, Inactive, Out of Stock)
  - Image URL support

### 3. **Category Management** (`/categories`)
- ✅ **List Categories** - Table view with search and pagination
- ✅ **Create Category** - Quick dialog-based creation
- ✅ **Edit Category** - Inline editing via dialog
- ✅ **Delete Category** - With confirmation
- Features:
  - Category images
  - Product count display
  - Slug generation
  - Hierarchical support (parent/child categories)

### 4. **Order Management** (`/orders`)
- ✅ **List Orders** - Comprehensive order table
- ✅ **Filter by Status** - Pending, Processing, Shipped, Delivered, Cancelled
- ✅ **Search Orders** - By order number, customer name
- ✅ **Update Order Status** - Quick status updates via dropdown
- Features:
  - Order number tracking
  - Customer information display
  - Total amount and item count
  - Payment status badges
  - Status workflow management
  - Date formatting

### 5. **User Management** (`/users`)
- ✅ **List Users** - All registered users
- ✅ **Update User Role** - Switch between User, Admin, Super Admin
- ✅ **Update User Status** - Active, Inactive, Blocked
- Features:
  - Role badges
  - Status badges
  - User search
  - Email and phone display

### 6. **Banner Management** (`/banners`)
- ✅ **List Banners** - All promotional banners
- ✅ **Create Banner** - Add new promotional content
- ✅ **Edit Banner** - Update existing banners
- ✅ **Delete Banner** - Remove banners
- Features:
  - Image preview
  - Position management (Top, Middle, Bottom, Sidebar)
  - Display order control
  - Status toggle (Active/Inactive)
  - Link URLs for clickable banners

## 🏗️ Project Structure

```
src/
├── app/
│   ├── (auth)/                    # Auth routes (login, register)
│   ├── (default)/                 # Main dashboard routes
│   │   ├── page.tsx              # Dashboard overview
│   │   ├── products/
│   │   │   ├── page.tsx          # Product list
│   │   │   ├── new/page.tsx      # Create product
│   │   │   └── [id]/edit/page.tsx # Edit product
│   │   ├── categories/page.tsx    # Category management
│   │   ├── orders/page.tsx        # Order management
│   │   ├── users/page.tsx         # User management
│   │   └── banners/page.tsx       # Banner management
│   ├── layout.tsx                 # Root layout
│   ├── providers.tsx              # Redux provider
│   └── globals.css                # Global styles
│
├── components/
│   ├── ui/                        # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── table.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   └── ... (20+ components)
│   ├── dashboard/                 # Dashboard-specific components
│   │   ├── StatsCard.tsx         # Statistics card component
│   │   ├── PageHeader.tsx        # Page header with actions
│   │   ├── SearchBar.tsx         # Debounced search input
│   │   ├── Pagination.tsx        # Pagination controls
│   │   └── EmptyState.tsx        # Empty state placeholder
│   └── products/
│       └── ProductForm.tsx        # Reusable product form
│
├── store/
│   ├── api.ts                     # Base RTK Query API
│   ├── store.ts                   # Redux store configuration
│   └── features/
│       ├── auth/
│       │   ├── authApi.ts
│       │   └── authSlice.ts
│       ├── products/productsApi.ts
│       ├── categories/categoriesApi.ts
│       ├── orders/ordersApi.ts
│       ├── users/usersApi.ts
│       ├── banners/bannersApi.ts
│       └── dashboard/dashboardApi.ts
│
├── types/
│   ├── index.ts                   # Common types
│   ├── product.ts                 # Product types
│   ├── category.ts                # Category types
│   ├── order.ts                   # Order types
│   ├── banner.ts                  # Banner types
│   └── dashboard.ts               # Dashboard types
│
├── shared/
│   ├── Sidebar.tsx                # Desktop sidebar navigation
│   └── TopBar.tsx                 # Top navigation bar
│
└── utils/
    ├── baseApi.ts                 # API configuration
    └── ...
```

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **UI Library**: shadcn/ui (Radix UI + Tailwind CSS)
- **State Management**: Redux Toolkit + RTK Query
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Date Formatting**: date-fns

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- HaatGhor server running (backend API)

### Installation

1. **Install dependencies**:
```bash
npm install
# or
bun install
```

2. **Set up environment variables**:
Create a `.env.local` file:
```env
# Development
NEXT_PUBLIC_BASEURL_DEV=http://localhost:5000/api/v1

# Production
NEXT_PUBLIC_BASEURL_PROD=https://your-api-domain.com/api/v1
```

3. **Run the development server**:
```bash
npm run dev
# or
bun dev
```

4. **Open your browser**:
Navigate to [http://localhost:3000](http://localhost:3000)

## 📋 API Integration

All API calls are handled through RTK Query with automatic:
- **Token management** (access token + refresh token)
- **Error handling**
- **Loading states**
- **Cache invalidation**
- **Optimistic updates**

### API Endpoints Used

| Module | Endpoint | Methods |
|--------|----------|---------|
| Dashboard | `/admin/dashboard/stats` | GET |
| Products | `/products` | GET, POST, PUT, DELETE |
| Categories | `/categories` | GET, POST, PUT, DELETE |
| Orders | `/orders/admin/all` | GET, PUT |
| Users | `/users` | GET, PUT |
| Banners | `/banners` | GET, POST, PUT, DELETE |

## 🎨 UI Components

### Reusable Dashboard Components

1. **StatsCard**: Display statistics with icons and trends
2. **PageHeader**: Consistent page headers with action buttons
3. **SearchBar**: Debounced search with loading states
4. **Pagination**: Navigate through paginated data
5. **EmptyState**: User-friendly empty state placeholders

### shadcn/ui Components Used

- Button, Card, Table, Badge
- Dialog, Alert Dialog, Sheet
- Input, Label, Textarea, Select
- Dropdown Menu, Tabs, Separator
- Avatar, Scroll Area, Skeleton
- Form components (with React Hook Form ready)

## 🔑 Key Features

### Responsive Design
- ✅ Desktop sidebar navigation
- ✅ Mobile drawer menu
- ✅ Touch-friendly interactions
- ✅ Adaptive layouts for all screen sizes

### User Experience
- ✅ Loading skeletons for better perceived performance
- ✅ Toast notifications for all actions
- ✅ Confirmation dialogs for destructive actions
- ✅ Inline editing where appropriate
- ✅ Search and filter capabilities
- ✅ Pagination for large datasets

### Performance
- ✅ Automatic query caching
- ✅ Debounced search inputs
- ✅ Optimized re-renders
- ✅ Code splitting by route

## 🔐 Authentication

The dashboard includes:
- Token-based authentication (JWT)
- Automatic token refresh
- Protected routes
- Role-based access control (SUPERADMIN, ADMIN, USER)

## 📱 Responsive Breakpoints

- **Mobile**: < 768px (Full mobile experience with drawer menu)
- **Tablet**: 768px - 1024px (Adaptive layouts)
- **Desktop**: > 1024px (Full sidebar + content)

## 🎯 Next Steps / Future Enhancements

Potential additions you might want to implement:

1. **Analytics Dashboard**
   - Sales charts and graphs
   - Revenue trends
   - Product performance metrics

2. **Advanced Filtering**
   - Date range filters
   - Multiple filter combinations
   - Saved filter presets

3. **Bulk Actions**
   - Bulk delete
   - Bulk status updates
   - Export to CSV/Excel

4. **Real-time Updates**
   - WebSocket integration for live order updates
   - Notifications system
   - Live inventory tracking

5. **Image Upload**
   - Direct image upload to cloud storage
   - Image optimization
   - Multiple image management

6. **Reviews & Ratings**
   - Product review management
   - Rating moderation
   - Customer feedback

7. **Settings Page**
   - Store configuration
   - Email templates
   - Payment gateway settings

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Verify backend server is running
   - Check `.env.local` configuration
   - Ensure CORS is enabled on backend

2. **Authentication Issues**
   - Clear browser cookies
   - Check token expiration settings
   - Verify user role permissions

3. **Build Errors**
   - Delete `node_modules` and reinstall
   - Clear Next.js cache: `rm -rf .next`
   - Check TypeScript errors: `npm run type-check`

## 📄 License

This project is part of the HaatGhor e-commerce platform.

## 🤝 Support

For issues or questions:
1. Check the backend API documentation
2. Review the component documentation
3. Check browser console for errors

---

**Built with ❤️ for HaatGhor**
