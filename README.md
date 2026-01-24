# HaatGhor Dashboard 🛍️

> Modern, responsive admin dashboard for the HaatGhor e-commerce platform

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-latest-000000)](https://ui.shadcn.com/)

## ✨ Features

- 📊 **Dashboard Overview** - Real-time statistics and analytics
- 📦 **Product Management** - Complete CRUD operations for products
- 📁 **Category Management** - Organize products into categories
- 🛒 **Order Management** - Process and track customer orders
- 👥 **User Management** - Manage customers and admin users
- 🎨 **Banner Management** - Control promotional banners
- 🔐 **Authentication** - JWT-based auth with auto-refresh
- 📱 **Responsive Design** - Works on all devices
- 🎨 **Modern UI** - Built with shadcn/ui components

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or Bun
- HaatGhor server running

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📖 Documentation

- **[Setup Guide](./SETUP.md)** - Complete setup instructions
- **[Dashboard Guide](./DASHBOARD_GUIDE.md)** - Detailed feature documentation
- **[Features Summary](./FEATURES_SUMMARY.md)** - Quick feature overview

## 🏗️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **UI Library**: shadcn/ui (Radix UI + Tailwind CSS)
- **State Management**: Redux Toolkit + RTK Query
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Forms**: React Hook Form (ready)
- **Date**: date-fns

## 📁 Project Structure

```
haatghoe-dashboard/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── (default)/         # Main dashboard pages
│   │   │   ├── page.tsx       # Dashboard overview
│   │   │   ├── products/      # Product management
│   │   │   ├── categories/    # Category management
│   │   │   ├── orders/        # Order management
│   │   │   ├── users/         # User management
│   │   │   └── banners/       # Banner management
│   │   ├── layout.tsx         # Root layout
│   │   └── providers.tsx      # Redux provider
│   ├── components/
│   │   ├── ui/               # shadcn/ui components (20+)
│   │   ├── dashboard/        # Reusable dashboard components
│   │   └── products/         # Feature-specific components
│   ├── store/
│   │   ├── api.ts           # RTK Query base API
│   │   ├── store.ts         # Redux store config
│   │   └── features/        # API slices for each module
│   ├── types/               # TypeScript type definitions
│   ├── shared/              # Shared layout components
│   │   ├── Sidebar.tsx     # Desktop navigation
│   │   └── TopBar.tsx      # Top navigation bar
│   └── utils/              # Utility functions
└── public/                 # Static assets
```

## 🎨 Pages & Features

### Dashboard (`/`)
- Revenue, orders, products, users statistics
- Growth trends with percentages
- Quick action links
- Real-time data

### Products (`/products`)
- List all products with pagination
- Search and filter
- Create new products
- Edit existing products
- Delete products
- Image management
- Stock tracking
- Status management

### Categories (`/categories`)
- Manage product categories
- Create/edit/delete categories
- Category images
- Product count display

### Orders (`/orders`)
- View all orders
- Filter by status
- Update order status
- Track payment status
- Customer information

### Users (`/users`)
- List all users
- Update user roles
- Manage user status
- Search functionality

### Banners (`/banners`)
- Manage promotional banners
- Position control
- Display order
- Active/inactive status

## 🔌 API Integration

All pages are fully integrated with the HaatGhor backend API:

- Automatic token management
- Error handling
- Loading states
- Cache management
- Optimistic updates

## 🎨 UI Components

### Dashboard Components
- `StatsCard` - Statistics display
- `PageHeader` - Page titles with actions
- `SearchBar` - Debounced search
- `Pagination` - Data navigation
- `EmptyState` - Placeholder states

### shadcn/ui Components
Button, Card, Table, Dialog, Input, Select, Badge, Avatar, Sheet, Tabs, and more...

## 🌐 Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_BASEURL_DEV=http://localhost:5000/api/v1
NEXT_PUBLIC_BASEURL_PROD=https://api.haatghor.com/api/v1
```

## 🛠️ Development

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start

# Lint
npm run lint
```

## 📱 Responsive Design

- **Mobile**: Drawer navigation, stacked layouts
- **Tablet**: Adaptive grids, optimized spacing
- **Desktop**: Full sidebar, multi-column layouts

## 🔐 Authentication

- JWT-based authentication
- Automatic token refresh
- Role-based access control (USER, ADMIN, SUPERADMIN)
- Protected routes

## 🎯 Next Steps

Optional enhancements you can add:

1. Analytics charts (Chart.js/Recharts)
2. Bulk operations
3. Advanced filtering
4. Image upload with cloud storage
5. Real-time notifications (WebSocket)
6. Export to CSV/Excel
7. Settings page
8. Email templates

## 📊 Performance

- Route-based code splitting
- Automatic caching with RTK Query
- Debounced searches
- Lazy loading
- Optimized bundle size

## 🐛 Troubleshooting

### Common Issues

**API Connection Failed**
- Verify backend is running
- Check `.env.local` configuration

**Build Errors**
```bash
rm -rf .next node_modules
npm install
npm run build
```

**Port Already in Use**
```bash
npx kill-port 3000
```

## 📄 License

Part of the HaatGhor e-commerce platform.

## 🤝 Contributing

This is a private project for the HaatGhor platform.

## 💡 Support

For issues:
1. Check documentation files
2. Review API documentation
3. Check browser console for errors

---

**Built with ❤️ for HaatGhor E-commerce Platform**

Ready to manage your online store! 🚀
