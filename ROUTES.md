# HaatGhor Dashboard - Routes Reference

## 📍 All Available Routes

### Main Dashboard
```
/                           - Dashboard overview with statistics
```

### Product Management
```
/products                   - List all products
/products/new              - Create new product
/products/[id]             - View product details (ready for implementation)
/products/[id]/edit        - Edit existing product
```

### Category Management
```
/categories                - List and manage categories
```

### Order Management
```
/orders                    - List all orders, filter, search
/orders/[id]              - Order details (ready for implementation)
```

### User Management
```
/users                     - List all users, manage roles/status
/users/[id]               - User details (ready for implementation)
```

### Banner Management
```
/banners                   - List and manage promotional banners
```

### Settings (Future)
```
/settings                  - Store settings (to be implemented)
```

## 🔗 API Endpoints Used

### Dashboard
- `GET /admin/dashboard/stats` - Dashboard statistics

### Products
- `GET /products?page=1&limit=10&search=...&categoryId=...` - List products
- `GET /products/:id` - Get single product
- `POST /products` - Create product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

### Categories
- `GET /categories?page=1&limit=10&search=...` - List categories
- `GET /categories/:id` - Get single category
- `POST /categories` - Create category
- `PUT /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category

### Orders
- `GET /orders/admin/all?page=1&limit=10&status=...&search=...` - List orders
- `GET /orders/:id` - Get single order
- `PUT /orders/admin/:id/status` - Update order status

### Users
- `GET /users?page=1&limit=10&search=...` - List users
- `GET /users/:id` - Get user details
- `PUT /users/user-role/:id` - Update user role
- `PUT /users/user-status/:id` - Update user status

### Banners
- `GET /banners?page=1&limit=10&position=...` - List banners
- `GET /banners/:id` - Get single banner
- `POST /banners` - Create banner
- `PUT /banners/:id` - Update banner
- `DELETE /banners/:id` - Delete banner

## 🎨 Navigation Structure

### Desktop Sidebar Menu
1. Dashboard (/)
2. Products (/products)
3. Categories (/categories)
4. Orders (/orders)
5. Users (/users)
6. Banners (/banners)
7. Settings (/settings)
8. Logout

### Mobile Drawer Menu
Same as desktop, accessible via hamburger menu in top bar

## 🔐 Protected Routes

All routes require authentication. Access levels:

- **SUPERADMIN**: Full access to all routes
- **ADMIN**: Limited access (to be configured)
- **USER**: Minimal access (customer view)

## 📊 Route Features

### `/` - Dashboard
- Statistics cards
- Quick actions
- Growth trends

### `/products`
- Table view with pagination
- Search bar
- Create button → `/products/new`
- Edit action → `/products/[id]/edit`
- Delete action (with confirmation)

### `/products/new`
- Product form
- Category selection
- Image URLs
- Price & stock
- Cancel → back to `/products`

### `/products/[id]/edit`
- Pre-filled form
- Update existing data
- Cancel → back to `/products`

### `/categories`
- Table view
- Dialog-based create/edit
- Delete with confirmation

### `/orders`
- Order list
- Status filter dropdown
- Status update dropdown
- Customer info display

### `/users`
- User list
- Role update dialog
- Status update dialog

### `/banners`
- Banner list
- Image previews
- Position badges
- Dialog-based create/edit

## 🚀 Quick Navigation

From any page:
- Click logo/title → Dashboard
- Use sidebar → Navigate to any module
- Mobile → Hamburger menu
- Search → Find products/orders/users

## 📱 Responsive Routes

All routes are fully responsive:
- Mobile: Optimized layouts, drawer menu
- Tablet: Adaptive grids
- Desktop: Full layout with sidebar

---

**All routes are implemented and ready to use!** ✅
