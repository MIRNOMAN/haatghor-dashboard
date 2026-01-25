# Image Upload Implementation Guide

## Overview
This guide documents the complete image upload functionality implemented across all modules in the HaatGhor Dashboard. All image uploads now use proper `FormData` and file inputs instead of text URLs.

## ✅ Implemented Modules

### 1. Banner Module
**Location**: `src/app/(default)/banners/page.tsx`

**Features**:
- ✅ Single image upload for create and update
- ✅ Image preview before upload
- ✅ Image validation (file type and size)
- ✅ Remove/replace image functionality
- ✅ FormData submission to backend
- ✅ Existing image display during edit

**Usage**:
```typescript
const formData = new FormData();
formData.append("title", "Banner Title");
formData.append("image", imageFile); // File object
await createBanner(formData).unwrap();
```

### 2. Category Module
**Location**: `src/app/(default)/categories/page.tsx`

**Features**:
- ✅ Single image upload for create and update
- ✅ Image preview with remove button
- ✅ File validation (type: image/*, size: max 10MB)
- ✅ FormData API integration
- ✅ View functionality to see category details

**Usage**:
```typescript
const formData = new FormData();
formData.append("name", "Category Name");
formData.append("image", imageFile); // File object
await createCategory(formData).unwrap();
```

### 3. Product Module
**Location**: `src/components/products/ProductForm.tsx`

**Features**:
- ✅ Multiple image upload support
- ✅ Grid preview of all uploaded images
- ✅ Individual image removal
- ✅ First image automatically set as thumbnail
- ✅ Existing images preserved during update
- ✅ FormData with multiple files

**Usage**:
```typescript
const formData = new FormData();
formData.append("name", "Product Name");

// Add multiple images
imageFiles.forEach(file => {
  formData.append("images", file);
});

// Preserve existing images during update
existingImages.forEach(url => {
  formData.append("existingImages[]", url);
});

await createProduct(formData).unwrap();
```

### 4. Review Module
**Location**: `src/app/(default)/reviews/page.tsx`

**Features**:
- ✅ View dialog to see complete review details
- ✅ Display review images in grid layout
- ✅ Support for multiple review images
- ✅ Status management (Approve/Reject)

**Note**: Reviews are typically created by users on the frontend app, not the admin dashboard. The dashboard only displays and manages them.

## 📋 Common Features Across All Modules

### Image Validation
All modules implement consistent validation:
```typescript
const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  
  // Type validation
  if (!file.type.startsWith('image/')) {
    toast.error('Please select an image file');
    return;
  }
  
  // Size validation (10MB)
  if (file.size > 10 * 1024 * 1024) {
    toast.error('Image size should not exceed 10MB');
    return;
  }
  
  setImageFile(file);
  // Generate preview...
};
```

### Image Preview
All modules show image previews before upload:
```tsx
{imagePreview && (
  <div className="relative w-full h-48 border rounded-lg overflow-hidden bg-muted">
    <img
      src={imagePreview}
      alt="Preview"
      className="w-full h-full object-contain"
    />
    <Button
      type="button"
      variant="destructive"
      size="icon"
      className="absolute top-2 right-2"
      onClick={handleRemoveImage}
    >
      <X className="h-4 w-4" />
    </Button>
  </div>
)}
```

### FormData Submission
All create/update mutations now accept FormData:
```typescript
// API Definition
createBanner: builder.mutation<T_ApiResponse<Banner>, FormData>({
  query: (formData) => ({
    url: '/banners',
    method: 'POST',
    body: formData,
  }),
  invalidatesTags: ['Banners'],
}),

// Update with ID
updateBanner: builder.mutation<T_ApiResponse<Banner>, { id: string; formData: FormData }>({
  query: ({ id, formData }) => ({
    url: `/banners/${id}`,
    method: 'PUT',
    body: formData,
  }),
  invalidatesTags: ['Banners'],
}),
```

## 🔐 Logout Implementation

### Features
- ✅ Clear Redux auth state
- ✅ Remove access and refresh tokens from cookies
- ✅ Clear localStorage and sessionStorage
- ✅ Redirect to login page
- ✅ Implemented in both Sidebar and TopBar

### Implementation
**Locations**: `src/shared/Sidebar.tsx`, `src/shared/TopBar.tsx`

```typescript
const handleLogout = () => {
  // Clear Redux state
  dispatch(logout());
  
  // Clear cookies
  document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  
  // Clear localStorage
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  
  // Clear sessionStorage
  sessionStorage.clear();
  
  // Redirect to login
  router.push("/login");
};
```

## 🎨 UI/UX Enhancements

### Image Upload Input
```tsx
<Input
  ref={fileInputRef}
  id="image"
  type="file"
  accept="image/*"
  onChange={handleImageChange}
  className="cursor-pointer"
/>
<p className="text-xs text-muted-foreground">
  Supported: JPG, PNG, GIF, WebP (Max 10MB)
</p>
```

### Multiple Image Upload (Products)
```tsx
<Input
  ref={fileInputRef}
  id="images"
  type="file"
  accept="image/*"
  multiple
  onChange={handleImageChange}
  className="cursor-pointer"
/>
```

### Image Grid Display
```tsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  {imagePreviews.map((preview, index) => (
    <div key={index} className="relative group">
      <div className="aspect-square border rounded-lg overflow-hidden bg-muted">
        <img
          src={preview}
          alt={`Preview ${index + 1}`}
          className="w-full h-full object-cover"
        />
      </div>
      <Button
        type="button"
        variant="destructive"
        size="icon"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => handleRemoveImage(index)}
      >
        <X className="h-4 w-4" />
      </Button>
      {index === 0 && (
        <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
          Thumbnail
        </div>
      )}
    </div>
  ))}
</div>
```

## 📝 API Integration Summary

### Updated API Files
1. **Banners**: `src/store/features/banners/bannersApi.ts`
2. **Categories**: `src/store/features/categories/categoriesApi.ts`
3. **Products**: `src/store/features/products/productsApi.ts`

### RTK Query Configuration
The base API in `src/store/api.ts` automatically handles FormData:
- No need to set `Content-Type` header
- Browser automatically sets it to `multipart/form-data` with boundary
- RTK Query handles the serialization

## 🚀 Testing Checklist

### Banner Module
- [ ] Create banner with image upload
- [ ] Update banner and replace image
- [ ] Update banner keeping existing image
- [ ] Delete banner
- [ ] Validate file type restriction
- [ ] Validate file size limit (10MB)

### Category Module
- [ ] Create category with image
- [ ] Update category with new image
- [ ] Update category without changing image
- [ ] View category details
- [ ] Delete category

### Product Module
- [ ] Create product with multiple images
- [ ] Update product and add more images
- [ ] Update product and remove some images
- [ ] Update product keeping all images
- [ ] Verify first image is thumbnail
- [ ] Test with 5+ images

### Review Module
- [ ] View review with images
- [ ] View review without images
- [ ] Approve/Reject review
- [ ] Delete review

### Logout
- [ ] Logout from Sidebar
- [ ] Logout from TopBar dropdown
- [ ] Verify redirect to login
- [ ] Verify cannot access protected routes after logout
- [ ] Verify clean state on re-login

## 🔧 Troubleshooting

### Images not uploading
1. Check backend API endpoint accepts `multipart/form-data`
2. Verify file input has correct `name` attribute
3. Check FormData is being sent correctly (use browser DevTools Network tab)
4. Ensure backend file size limits match frontend (10MB)

### Preview not showing
1. Verify FileReader is creating data URL correctly
2. Check state updates for imagePreview
3. Ensure image file is valid image format

### FormData not received by backend
1. Don't set Content-Type header manually
2. Let browser set it automatically with boundary
3. Verify FormData keys match backend expectations

## 📚 Additional Resources

- [MDN FormData API](https://developer.mozilla.org/en-US/docs/Web/API/FormData)
- [MDN FileReader API](https://developer.mozilla.org/en-US/docs/Web/API/FileReader)
- [RTK Query Mutations](https://redux-toolkit.js.org/rtk-query/usage/mutations)

## 🎯 Best Practices

1. **Always validate file type and size on frontend** (and backend)
2. **Show image previews** to improve UX
3. **Allow image removal/replacement** during editing
4. **Use FormData** for all file uploads
5. **Provide clear feedback** (loading states, success/error messages)
6. **Handle errors gracefully** with user-friendly messages
7. **Clean up file inputs** after submission
8. **Preserve existing images** during updates when no new image is uploaded

## ✅ Completion Status

| Module | Single Upload | Multiple Upload | Preview | Validation | FormData | Status |
|--------|--------------|-----------------|---------|------------|----------|--------|
| Banner | ✅ | N/A | ✅ | ✅ | ✅ | Complete |
| Category | ✅ | N/A | ✅ | ✅ | ✅ | Complete |
| Product | N/A | ✅ | ✅ | ✅ | ✅ | Complete |
| Review | Display Only | Display Only | ✅ | N/A | N/A | Complete |
| Logout | ✅ | N/A | N/A | N/A | N/A | Complete |

All image upload functionality has been successfully implemented! 🎉
