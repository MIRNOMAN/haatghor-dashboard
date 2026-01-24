# HaatGhor Dashboard - Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
# or
bun install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Development API URL
NEXT_PUBLIC_BASEURL_DEV=http://localhost:5000/api/v1

# Production API URL
NEXT_PUBLIC_BASEURL_PROD=https://api.haatghor.com/api/v1

# Client URL (for OAuth callbacks, etc.)
NEXT_PUBLIC_CLIENT_URL_DEV=http://localhost:3000
NEXT_PUBLIC_CLIENT_URL_PROD=https://dashboard.haatghor.com

# AI Backend URL (if using AI features)
NEXT_PUBLIC_AI_BASEURL_DEV=http://localhost:8000
NEXT_PUBLIC_AI_BASEURL_PROD=https://ai.haatghor.com
```

### 3. Start Backend Server

Make sure your HaatGhor server is running on `http://localhost:5000`

```bash
cd ../haatghor-server
npm run dev
```

### 4. Start Dashboard

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 What's Included

### Pages & Features
- ✅ Dashboard Overview with statistics
- ✅ Product Management (CRUD)
- ✅ Category Management (CRUD)
- ✅ Order Management (List, Update Status)
- ✅ User Management (List, Update Role/Status)
- ✅ Banner Management (CRUD)

### Components
- ✅ 20+ shadcn/ui components
- ✅ Responsive layouts
- ✅ Loading states
- ✅ Error handling
- ✅ Toast notifications

### State Management
- ✅ Redux Toolkit
- ✅ RTK Query for API calls
- ✅ Automatic token refresh
- ✅ Persistent state with redux-persist

## 🎨 Customization

### Colors & Theme

Edit `src/app/globals.css` to customize the theme:

```css
@layer base {
  :root {
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    /* ... more variables */
  }
}
```

### Navigation

Edit `src/shared/Sidebar.tsx` and `src/shared/TopBar.tsx` to modify menu items.

### API Base URL

The API base URL is configured in `src/utils/baseApi.ts` and uses environment variables.

## 🔧 Development Tips

### Adding New Pages

1. Create page in `src/app/(default)/your-page/page.tsx`
2. Add route to sidebar in `src/shared/Sidebar.tsx`
3. Create API slice in `src/store/features/your-feature/yourApi.ts`
4. Add types in `src/types/your-types.ts`

### Adding New API Endpoints

```typescript
// src/store/features/example/exampleApi.ts
import { baseApi } from "@/store/api";

export const exampleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getExample: builder.query({
      query: () => '/example',
      providesTags: ['Example'],
    }),
  }),
});

export const { useGetExampleQuery } = exampleApi;
```

### Using Toast Notifications

```typescript
import { toast } from "sonner";

toast.success("Success message");
toast.error("Error message");
toast.info("Info message");
```

## 📱 Testing

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

### Lint
```bash
npm run lint
```

## 🔐 Authentication

The dashboard uses JWT-based authentication:

1. Login via auth page (to be implemented or use existing)
2. Token stored in Redux state
3. Automatic refresh when token expires
4. Protected routes based on user role

### User Roles
- **USER**: Regular customer
- **ADMIN**: Store manager
- **SUPERADMIN**: Full access

## 📊 API Documentation

Refer to the backend API documentation at:
`haatghor-server/API_DOCUMENTATION.md`

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000
```

### Clear Cache
```bash
rm -rf .next
npm run dev
```

### Reset Dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📝 Environment Modes

- **Development**: Uses `NEXT_PUBLIC_BASEURL_DEV`
- **Production**: Uses `NEXT_PUBLIC_BASEURL_PROD`

Automatically detected based on `NODE_ENV`.

## 🚢 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import repository in Vercel
3. Add environment variables
4. Deploy

### Other Platforms
```bash
npm run build
npm start
```

Make sure to set environment variables in your hosting platform.

---

**Ready to go! 🎉**
