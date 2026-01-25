# 🚀 HaatGhor Dashboard - Developer Quick Start

## 📋 Overview
This guide helps you understand and work with the image upload functionality in the HaatGhor Dashboard.

---

## 🎯 Quick Reference

### Banner Module
**Path**: `/banners`  
**Upload**: Single image  
**Format**: JPG, PNG, GIF, WebP  
**Max Size**: 10MB

### Category Module
**Path**: `/categories`  
**Upload**: Single image  
**Format**: JPG, PNG, GIF, WebP  
**Max Size**: 10MB

### Product Module
**Path**: `/products`  
**Upload**: Multiple images  
**Format**: JPG, PNG, GIF, WebP  
**Max Size**: 10MB per image  
**Note**: First image becomes thumbnail

### Review Module
**Path**: `/reviews`  
**Upload**: View only (images uploaded by customers)

---

## 🛠️ How to Add Image Upload to a New Module

### Step 1: Update the Component

```tsx
import { useState, useRef } from "react";

function YourComponent() {
  // State for image handling
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Image change handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    
    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size should not exceed 10MB');
      return;
    }

    setImageFile(file);
    
    // Generate preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Remove image handler
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("name", "Your Name");
    
    if (imageFile) {
      formData.append("image", imageFile);
    }
    
    await createYourItem(formData).unwrap();
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* File Input */}
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
      />
      
      {/* Preview */}
      {imagePreview && (
        <div className="relative">
          <img src={imagePreview} alt="Preview" />
          <Button onClick={handleRemoveImage}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      <Button type="submit">Submit</Button>
    </form>
  );
}
```

### Step 2: Update the API

```typescript
// In your API file (e.g., src/store/features/yourModule/yourModuleApi.ts)
export const yourModuleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createYourItem: builder.mutation<T_ApiResponse<YourType>, FormData>({
      query: (formData) => ({
        url: '/your-endpoint',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['YourTag'],
    }),
    
    updateYourItem: builder.mutation<T_ApiResponse<YourType>, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/your-endpoint/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['YourTag'],
    }),
  }),
});
```

---

## 🎨 Multiple Image Upload (Like Products)

```tsx
function MultipleImageUpload() {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large`);
        return false;
      }
      return true;
    });

    setImageFiles(prev => [...prev, ...validFiles]);

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("name", "Product Name");
    
    imageFiles.forEach(file => {
      formData.append("images", file);
    });
    
    await createProduct(formData).unwrap();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageChange}
      />
      
      <div className="grid grid-cols-4 gap-4">
        {imagePreviews.map((preview, index) => (
          <div key={index} className="relative">
            <img src={preview} alt={`Preview ${index}`} />
            <Button onClick={() => handleRemoveImage(index)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      
      <Button type="submit">Submit</Button>
    </form>
  );
}
```

---

## 🔐 Logout Implementation

### Where It's Implemented
- **Sidebar**: Bottom of sidebar
- **TopBar**: User dropdown menu

### How It Works
```typescript
const handleLogout = () => {
  // 1. Clear Redux state
  dispatch(logout());
  
  // 2. Clear cookies
  document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  
  // 3. Clear localStorage
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  
  // 4. Clear sessionStorage
  sessionStorage.clear();
  
  // 5. Redirect to login
  router.push("/login");
};
```

### To Add Logout to a New Component
```tsx
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hookts";
import { logout } from "@/store/features/auth/authSlice";

function YourComponent() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    localStorage.clear();
    sessionStorage.clear();
    router.push("/login");
  };

  return <Button onClick={handleLogout}>Logout</Button>;
}
```

---

## 🐛 Troubleshooting

### Problem: Image not uploading
**Solution**: 
1. Check backend accepts `multipart/form-data`
2. Verify FormData is created correctly
3. Don't set `Content-Type` header manually
4. Check browser DevTools Network tab

### Problem: Preview not showing
**Solution**:
1. Ensure FileReader is working
2. Check imagePreview state updates
3. Verify image file is valid

### Problem: File too large error
**Solution**:
1. Frontend limit: 10MB (change in validation)
2. Backend limit: Check server config
3. Nginx/Apache: Check upload limits

### Problem: Logout not working
**Solution**:
1. Check Redux store is cleared
2. Verify cookies are deleted
3. Check redirect is working
4. Ensure middleware redirects unauthenticated users

---

## 📦 Dependencies Used

```json
{
  "react": "^18.x",
  "next": "^14.x",
  "@reduxjs/toolkit": "^2.x",
  "lucide-react": "^0.x",
  "sonner": "^1.x"
}
```

---

## 🎓 Best Practices

### ✅ DO
- Validate file type and size on frontend
- Show image previews
- Use FormData for file uploads
- Provide loading states
- Show success/error messages
- Clear file input after use
- Preserve existing images during updates

### ❌ DON'T
- Don't set Content-Type header for FormData
- Don't use base64 for large images
- Don't skip validation
- Don't forget to clean up state
- Don't ignore error cases

---

## 📚 Code Examples Repository

### Simple File Input
```tsx
<Input type="file" accept="image/*" onChange={handleImageChange} />
```

### Multiple File Input
```tsx
<Input type="file" accept="image/*" multiple onChange={handleImageChange} />
```

### Image Preview
```tsx
{imagePreview && (
  <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
)}
```

### FormData with Images
```tsx
const formData = new FormData();
formData.append("name", "Value");
formData.append("image", imageFile);
```

---

## 🔗 Useful Links

- [FormData MDN](https://developer.mozilla.org/en-US/docs/Web/API/FormData)
- [FileReader MDN](https://developer.mozilla.org/en-US/docs/Web/API/FileReader)
- [RTK Query Docs](https://redux-toolkit.js.org/rtk-query/overview)
- [Next.js Documentation](https://nextjs.org/docs)

---

## 💡 Tips

1. **Use refs for file inputs**: Makes it easier to reset
2. **Always validate**: Both type and size
3. **Show previews**: Better UX
4. **Handle errors gracefully**: User-friendly messages
5. **Test edge cases**: Large files, wrong types, etc.
6. **Mobile responsive**: Test on different screen sizes

---

## ✅ Checklist for New Features

When adding a new module with image upload:

- [ ] Add state for file and preview
- [ ] Create file input with validation
- [ ] Implement preview UI
- [ ] Add remove/replace functionality
- [ ] Update API to accept FormData
- [ ] Test with different file types
- [ ] Test with large files
- [ ] Test update/edit functionality
- [ ] Add loading states
- [ ] Add error handling
- [ ] Test on mobile devices

---

## 🎉 You're Ready!

You now have all the knowledge to work with image uploads in the HaatGhor Dashboard. Happy coding! 🚀

For more detailed information, check:
- `IMAGE_UPLOAD_GUIDE.md` - Complete implementation guide
- `FRONTEND_IMAGE_IMPLEMENTATION.md` - Technical details

---

**Last Updated**: January 2026  
**Version**: 1.0.0
