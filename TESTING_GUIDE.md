# 🧪 Testing Guide - Image Upload & Logout Functionality

## 📋 Overview
This document provides comprehensive testing procedures for all image upload and logout features in the HaatGhor Dashboard.

---

## 🎯 Testing Environment Setup

### Prerequisites
- Node.js installed
- Dashboard running on `http://localhost:3000`
- Backend API running and accessible
- Admin credentials for login
- Sample images for testing (various formats and sizes)

### Test Image Preparation
Prepare the following test images:
1. **Valid Images**:
   - Small JPG (< 1MB)
   - Medium PNG (2-5MB)
   - Large GIF (5-9MB)
   - WebP format
   - Multiple images (for products)

2. **Invalid Test Cases**:
   - Image > 10MB
   - PDF file
   - Text file
   - Video file
   - Corrupted image

---

## 🎪 Banner Module Testing

### Test Case 1.1: Create Banner with Image
**Steps**:
1. Navigate to `/banners`
2. Click "Add Banner" button
3. Fill in banner title
4. Click file input and select an image
5. Verify image preview appears
6. Click "Create" button

**Expected Results**:
- ✅ File input accepts image selection
- ✅ Preview shows selected image
- ✅ Loading state appears during upload
- ✅ Success toast message displays
- ✅ Dialog closes
- ✅ New banner appears in list with image
- ✅ Image URL is stored and displayed

### Test Case 1.2: Update Banner - Replace Image
**Steps**:
1. Click edit on existing banner
2. See existing image in preview
3. Select new image from file input
4. Verify new preview replaces old one
5. Click "Update"

**Expected Results**:
- ✅ Existing image loads in preview
- ✅ New image replaces preview
- ✅ Update succeeds
- ✅ New image displays in list

### Test Case 1.3: Update Banner - Keep Existing Image
**Steps**:
1. Click edit on existing banner
2. Change only the title
3. Don't select new image
4. Click "Update"

**Expected Results**:
- ✅ Existing image remains in preview
- ✅ Update succeeds
- ✅ Same image still displays

### Test Case 1.4: Remove Image Before Submit
**Steps**:
1. Click "Add Banner"
2. Select an image
3. Click X button on preview
4. Try to submit

**Expected Results**:
- ✅ Preview disappears
- ✅ File input resets
- ✅ Validation error: "Image is required"

### Test Case 1.5: Invalid File Type
**Steps**:
1. Try to upload a PDF file
2. Observe behavior

**Expected Results**:
- ✅ Error toast: "Please select an image file"
- ✅ File not accepted
- ✅ No preview shown

### Test Case 1.6: File Too Large
**Steps**:
1. Try to upload image > 10MB
2. Observe behavior

**Expected Results**:
- ✅ Error toast: "Image size should not exceed 10MB"
- ✅ File not accepted

---

## 📁 Category Module Testing

### Test Case 2.1: Create Category with Image
**Steps**:
1. Navigate to `/categories`
2. Click "Add Category"
3. Enter category name
4. Upload image
5. Submit form

**Expected Results**:
- ✅ Image preview appears
- ✅ Category created successfully
- ✅ Image displays in category list
- ✅ Image shows in category card

### Test Case 2.2: View Category Details
**Steps**:
1. Click three dots on a category
2. Select "View"
3. Check displayed information

**Expected Results**:
- ✅ Dialog opens
- ✅ Category name shown
- ✅ Description shown
- ✅ Image displayed
- ✅ Dates shown

### Test Case 2.3: Update Category Image
**Steps**:
1. Edit existing category
2. Replace image
3. Submit

**Expected Results**:
- ✅ Old image shows initially
- ✅ New image preview replaces old
- ✅ Update successful
- ✅ New image in list

### Test Case 2.4: Category Without Image
**Steps**:
1. Create category without image
2. Submit

**Expected Results**:
- ✅ Category created successfully
- ✅ Placeholder icon shows in list
- ✅ No image in view dialog

---

## 📦 Product Module Testing

### Test Case 3.1: Create Product with Single Image
**Steps**:
1. Navigate to `/products/create`
2. Fill required fields
3. Upload one image
4. Submit

**Expected Results**:
- ✅ Image preview in grid
- ✅ "Thumbnail" badge on image
- ✅ Product created
- ✅ Image displays in product list

### Test Case 3.2: Create Product with Multiple Images
**Steps**:
1. Navigate to `/products/create`
2. Fill required fields
3. Select multiple images (5+)
4. Verify all previews
5. Submit

**Expected Results**:
- ✅ All images preview in grid
- ✅ First image marked as thumbnail
- ✅ Individual remove buttons appear on hover
- ✅ Product created with all images
- ✅ Thumbnail shows in list
- ✅ All images show in edit

### Test Case 3.3: Remove Individual Image
**Steps**:
1. Upload 3 images
2. Hover over second image
3. Click X button
4. Submit

**Expected Results**:
- ✅ Second image removed from preview
- ✅ Only 2 images remain
- ✅ First image still thumbnail
- ✅ Product saved with 2 images

### Test Case 3.4: Add More Images to Existing Product
**Steps**:
1. Edit product with 2 images
2. See existing 2 images
3. Upload 2 more images
4. Submit

**Expected Results**:
- ✅ Existing images show in preview
- ✅ New images added to grid
- ✅ Total 4 images in preview
- ✅ Update successful
- ✅ All 4 images saved

### Test Case 3.5: Update Product Without Changing Images
**Steps**:
1. Edit product
2. Change only price
3. Don't touch images
4. Submit

**Expected Results**:
- ✅ Existing images remain
- ✅ Update successful
- ✅ Same images still show

### Test Case 3.6: Remove All Images and Add New Ones
**Steps**:
1. Edit product with 3 images
2. Remove all 3 images
3. Upload 2 new images
4. Submit

**Expected Results**:
- ✅ All old images removed from preview
- ✅ New images show in preview
- ✅ Update successful
- ✅ Only new images saved

### Test Case 3.7: Large Number of Images
**Steps**:
1. Try to upload 10 images at once
2. Observe behavior

**Expected Results**:
- ✅ All 10 images preview
- ✅ Grid layout handles many images
- ✅ Scroll works properly
- ✅ All images upload successfully

---

## ⭐ Review Module Testing

### Test Case 4.1: View Review with Images
**Steps**:
1. Navigate to `/reviews`
2. Find review with images
3. Click three dots → View

**Expected Results**:
- ✅ Dialog opens
- ✅ Review details shown
- ✅ Images displayed in grid
- ✅ All images visible

### Test Case 4.2: View Review without Images
**Steps**:
1. View a review with no images

**Expected Results**:
- ✅ Review details shown
- ✅ No image section (or empty state)
- ✅ No errors

### Test Case 4.3: Approve Review
**Steps**:
1. Find PENDING review
2. Click Approve

**Expected Results**:
- ✅ Status changes to APPROVED
- ✅ Success toast
- ✅ Badge updates

### Test Case 4.4: Reject Review
**Steps**:
1. Find APPROVED review
2. Click Reject

**Expected Results**:
- ✅ Status changes to REJECTED
- ✅ Badge color changes
- ✅ Success message

---

## 🔐 Logout Functionality Testing

### Test Case 5.1: Logout from Sidebar
**Steps**:
1. Be logged in
2. Click Logout button at bottom of sidebar
3. Observe behavior

**Expected Results**:
- ✅ Redirected to `/login`
- ✅ Auth token cleared from cookies
- ✅ localStorage cleared
- ✅ Redux state reset
- ✅ Cannot access protected routes

### Test Case 5.2: Logout from TopBar Dropdown
**Steps**:
1. Click user avatar in TopBar
2. Click "Logout" in dropdown
3. Observe behavior

**Expected Results**:
- ✅ Dropdown closes
- ✅ Redirected to login
- ✅ All tokens cleared
- ✅ State reset

### Test Case 5.3: Verify Complete Logout
**Steps**:
1. Logout using any method
2. Check localStorage
3. Check cookies
4. Try to access `/products`
5. Try to manually navigate to `/`

**Expected Results**:
- ✅ localStorage empty
- ✅ accessToken cookie deleted
- ✅ refreshToken cookie deleted
- ✅ Redirected to login from any protected route
- ✅ Cannot access dashboard

### Test Case 5.4: Login After Logout
**Steps**:
1. Logout completely
2. Login again
3. Check dashboard access

**Expected Results**:
- ✅ Can login successfully
- ✅ Dashboard accessible
- ✅ New tokens set
- ✅ User data loaded

### Test Case 5.5: Mobile Logout
**Steps**:
1. Open on mobile/small screen
2. Open mobile menu
3. Click logout

**Expected Results**:
- ✅ Logout works same as desktop
- ✅ Mobile menu closes
- ✅ Redirected properly

---

## 🎭 Cross-Module Integration Testing

### Test Case 6.1: Upload Images Across All Modules
**Steps**:
1. Create banner with image
2. Create category with image
3. Create product with multiple images
4. Verify all stored correctly

**Expected Results**:
- ✅ All modules accept uploads
- ✅ All images display correctly
- ✅ No conflicts between modules

### Test Case 6.2: Update Multiple Items
**Steps**:
1. Edit banner image
2. Edit category image
3. Edit product images
4. All in same session

**Expected Results**:
- ✅ All updates work independently
- ✅ No state conflicts
- ✅ Each module maintains own state

---

## 📱 Responsive Design Testing

### Test Case 7.1: Mobile Image Upload
**Device**: iPhone/Android
**Steps**:
1. Upload image from mobile
2. Test camera vs gallery
3. Verify preview

**Expected Results**:
- ✅ File input works on mobile
- ✅ Camera option available
- ✅ Gallery option available
- ✅ Preview displays correctly
- ✅ Upload succeeds

### Test Case 7.2: Tablet View
**Device**: iPad/Tablet
**Steps**:
1. Test all upload flows
2. Check grid layouts
3. Verify responsiveness

**Expected Results**:
- ✅ UI adjusts to tablet size
- ✅ Grids show 2-3 columns
- ✅ Touch interactions work

---

## 🚀 Performance Testing

### Test Case 8.1: Large Image Upload
**Steps**:
1. Upload 9MB image
2. Monitor upload time
3. Check memory usage

**Expected Results**:
- ✅ Upload completes within 10s
- ✅ No browser freeze
- ✅ Progress feedback visible

### Test Case 8.2: Multiple Simultaneous Uploads
**Steps**:
1. Upload 5 products with images
2. All at same time
3. Monitor performance

**Expected Results**:
- ✅ All uploads succeed
- ✅ No errors
- ✅ Reasonable response time

---

## 🐛 Error Handling Testing

### Test Case 9.1: Network Error During Upload
**Steps**:
1. Start upload
2. Disconnect internet
3. Observe behavior

**Expected Results**:
- ✅ Error message appears
- ✅ Form not cleared
- ✅ Can retry after reconnect

### Test Case 9.2: Server Error (500)
**Steps**:
1. Trigger server error
2. Observe handling

**Expected Results**:
- ✅ User-friendly error message
- ✅ Form data preserved
- ✅ Can retry

### Test Case 9.3: Validation Error from Backend
**Steps**:
1. Send invalid data
2. Check error handling

**Expected Results**:
- ✅ Backend error message displayed
- ✅ Form remains filled
- ✅ User can correct and resubmit

---

## 📊 Test Results Template

```markdown
## Test Execution Report

**Date**: [Date]
**Tester**: [Name]
**Environment**: [Dev/Staging/Prod]

### Banner Module
- [ ] TC 1.1: Create with image - PASS/FAIL
- [ ] TC 1.2: Update image - PASS/FAIL
- [ ] TC 1.3: Keep existing - PASS/FAIL
- [ ] TC 1.4: Remove before submit - PASS/FAIL
- [ ] TC 1.5: Invalid file type - PASS/FAIL
- [ ] TC 1.6: File too large - PASS/FAIL

### Category Module
- [ ] TC 2.1: Create with image - PASS/FAIL
- [ ] TC 2.2: View category - PASS/FAIL
- [ ] TC 2.3: Update image - PASS/FAIL
- [ ] TC 2.4: Without image - PASS/FAIL

### Product Module
- [ ] TC 3.1: Single image - PASS/FAIL
- [ ] TC 3.2: Multiple images - PASS/FAIL
- [ ] TC 3.3: Remove individual - PASS/FAIL
- [ ] TC 3.4: Add more images - PASS/FAIL
- [ ] TC 3.5: No image change - PASS/FAIL
- [ ] TC 3.6: Replace all - PASS/FAIL
- [ ] TC 3.7: Many images - PASS/FAIL

### Review Module
- [ ] TC 4.1: View with images - PASS/FAIL
- [ ] TC 4.2: View without images - PASS/FAIL
- [ ] TC 4.3: Approve - PASS/FAIL
- [ ] TC 4.4: Reject - PASS/FAIL

### Logout
- [ ] TC 5.1: Sidebar logout - PASS/FAIL
- [ ] TC 5.2: TopBar logout - PASS/FAIL
- [ ] TC 5.3: Complete cleanup - PASS/FAIL
- [ ] TC 5.4: Re-login - PASS/FAIL
- [ ] TC 5.5: Mobile logout - PASS/FAIL

### Issues Found
1. [Description] - [Severity: Critical/High/Medium/Low]
2. ...

### Notes
[Any additional observations]
```

---

## ✅ Acceptance Criteria

All tests must pass for feature to be considered complete:

- [ ] All image uploads work (single & multiple)
- [ ] All image previews display correctly
- [ ] All validations work (type & size)
- [ ] All updates preserve or replace images correctly
- [ ] Logout completely clears state
- [ ] Cannot access protected routes after logout
- [ ] No console errors during any operation
- [ ] Responsive on mobile, tablet, desktop
- [ ] Error messages are user-friendly
- [ ] Loading states provide clear feedback

---

## 🎯 Regression Testing Checklist

After any changes, verify:
- [ ] Existing banners still display images
- [ ] Existing categories still show images
- [ ] Existing products show all images
- [ ] Reviews with images still visible
- [ ] Logout still works from all locations
- [ ] Login still works after logout
- [ ] All forms still validate correctly

---

## 📝 Notes for Testers

1. **Test on Multiple Browsers**: Chrome, Firefox, Safari, Edge
2. **Test on Multiple Devices**: Desktop, tablet, mobile
3. **Test Different Image Formats**: JPG, PNG, GIF, WebP
4. **Test Edge Cases**: Empty forms, special characters, very long names
5. **Test Performance**: Large files, multiple files, slow network
6. **Document Everything**: Screenshots of failures, console logs, network tabs

---

## 🆘 Reporting Issues

When reporting bugs, include:
1. Test case number
2. Steps to reproduce
3. Expected result
4. Actual result
5. Screenshots/screen recording
6. Browser & version
7. Console errors
8. Network tab (if upload issue)

---

**Last Updated**: January 2026  
**Version**: 1.0.0  
**Status**: Ready for Testing
