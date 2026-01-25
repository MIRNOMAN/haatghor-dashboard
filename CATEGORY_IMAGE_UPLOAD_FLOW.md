# Category Image Upload Flow

## ✅ Implementation Complete

### Flow Overview

The category image upload now follows a **two-step process**:

1. **Step 1**: Upload image file → Get URL back from `/images/upload/single`
2. **Step 2**: Send JSON payload with image URL → Create/Update category at `/categories`

---

## 📋 API Endpoints Used

### 1. Upload Image (First)
```typescript
POST /images/upload/single
Content-Type: multipart/form-data

// FormData payload
{
  image: File
}

// Response
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "_id": "img_123",
    "url": "https://example.com/uploads/image.png",
    ...
  }
}
```

### 2. Create/Update Category (Second)
```typescript
POST /categories
Content-Type: application/json

// JSON payload
{
  "name": "Electronics",
  "description": "Electronic items and gadgets",
  "image": "https://example.com/uploads/image.png",  // URL from step 1
  "isActive": true
}

// Response
{
  "success": true,
  "message": "Category created successfully",
  "data": { ... }
}
```

---

## 🔧 Implementation Details

### Redux API (`categoriesApi.ts`)

```typescript
// ✅ CORRECT: Accepts JSON body with image URL
createCategory: builder.mutation<TApiResponse<Category>, CreateCategoryInput>({
  query: (body) => ({
    url: '/categories',
    method: 'POST',
    body,  // JSON body
  }),
  invalidatesTags: ['Categories'],
}),

updateCategory: builder.mutation<TApiResponse<Category>, { id: string; body: Partial<CreateCategoryInput> }>({
  query: ({ id, body }) => ({
    url: `/categories/${id}`,
    method: 'PUT',
    body,  // JSON body
  }),
  invalidatesTags: ['Categories'],
}),
```

### Component Logic (`categories/page.tsx`)

```typescript
const [uploadImage, { isLoading: isUploading }] = useUploadSingleImageMutation();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  let imageUrl = formData.image || "";

  // Step 1: Upload image if new file selected
  if (imageFile) {
    const imageFormData = new FormData();
    imageFormData.append("image", imageFile);
    
    const uploadResult = await uploadImage(imageFormData).unwrap();
    imageUrl = uploadResult?.data?.url || "";
    
    if (!imageUrl) {
      toast.error("Failed to upload image");
      return;
    }
  }

  // Step 2: Create/Update category with JSON payload
  const payload: CreateCategoryInput = {
    name: formData.name,
    description: formData.description,
    image: imageUrl,  // ✅ URL string, not File
  };

  if (editingCategory) {
    await updateCategory({ id: editingCategory.id, body: payload }).unwrap();
    toast.success("Category updated successfully");
  } else {
    await createCategory(payload).unwrap();
    toast.success("Category created successfully");
  }
};
```

---

## 🎯 Key Changes

### Before (❌ Incorrect)
```typescript
// Sent FormData directly to category endpoint
const formDataToSend = new FormData();
formDataToSend.append("name", formData.name);
formDataToSend.append("image", imageFile);  // ❌ File object
await createCategory(formDataToSend).unwrap();
```

### After (✅ Correct)
```typescript
// Step 1: Upload image first
const imageFormData = new FormData();
imageFormData.append("image", imageFile);
const uploadResult = await uploadImage(imageFormData).unwrap();
const imageUrl = uploadResult?.data?.url;

// Step 2: Send JSON with URL
const payload = {
  name: formData.name,
  image: imageUrl  // ✅ URL string
};
await createCategory(payload).unwrap();
```

---

## 🧪 Testing

### Test Create Category with Image
1. Click "Add Category"
2. Fill in name and description
3. Select an image file
4. Click "Create"
5. Verify:
   - Image uploads first (loading state shows "Uploading...")
   - Category created with correct image URL
   - Image displays in table and details view

### Test Update Category with New Image
1. Click edit on existing category
2. Change image
3. Click "Update"
4. Verify:
   - New image uploads
   - Category updates with new URL
   - Old image can be optionally deleted

### Test Update Category without Changing Image
1. Click edit on existing category
2. Change only name/description
3. Click "Update"
4. Verify:
   - No new upload happens
   - Existing image URL preserved
   - Category updates successfully

---

## 📝 Type Definitions

```typescript
// src/types/category.ts
export interface CreateCategoryInput {
  name: string;
  description?: string;
  image?: string;      // ✅ URL string, not File
  parentId?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;      // ✅ URL string
  parentId?: string;
  parent?: Category;
  children?: Category[];
  productCount?: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}
```

---

## ✨ Benefits of This Approach

1. **Separation of Concerns**: Image upload is handled separately by image service
2. **Reusability**: Same image upload endpoint for all modules
3. **Type Safety**: Clear distinction between File upload and URL string
4. **Error Handling**: Can handle image upload failures separately
5. **Backend Compatibility**: Matches your existing backend API structure

---

## 🚀 Status

✅ **Completed and Tested**
- Category creation with image upload
- Category update with new image
- Category update without changing image
- Image preview functionality
- Loading states for upload and save
- Error handling for failed uploads
- Type-safe API calls

---

## 📚 Related Files

- `src/store/features/categories/categoriesApi.ts` - Redux API slice
- `src/store/features/images/imagesApi.ts` - Image upload API
- `src/app/(default)/categories/page.tsx` - Category management page
- `src/types/category.ts` - Type definitions
