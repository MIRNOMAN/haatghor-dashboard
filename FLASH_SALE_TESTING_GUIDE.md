# Flash Sale Feature - Testing Guide

## 🧪 Complete Testing Checklist

This guide will help you test all Flash Sale functionality in the HaatGhor Dashboard.

## Prerequisites

Before testing, ensure:
- ✅ Server is running on `http://localhost:5000`
- ✅ Dashboard is running on `http://localhost:3000`
- ✅ You're logged in as an **ADMIN** user
- ✅ At least one product exists in the database
- ✅ Database is connected and migrations are applied

---

## 🎯 Test Scenarios

### 1. Create Flash Sale - Happy Path

**Steps:**
1. Navigate to **Flash Sales** page from sidebar
2. Click **"Create Flash Sale"** button
3. Fill in the form:
   - **Title**: "Weekend Special"
   - **Description**: "Amazing weekend deals"
   - **Product**: Search and select a product
   - **Flash Price**: Enter a price lower than original (e.g., if product is $100, enter $49.99)
   - **Stock**: Enter 50
   - **Duration**: Set 2 hours, 30 minutes, 0 seconds
   - **Featured**: Check the box
4. Click **"Create Flash Sale"**

**Expected Results:**
- ✅ Success toast notification appears
- ✅ Dialog closes automatically
- ✅ New flash sale appears in the list
- ✅ Status badge shows "Live" (green)
- ✅ Discount percentage shows correctly (50% in this example)
- ✅ Product image displays
- ✅ Countdown timer shows remaining time

---

### 2. Create Flash Sale - Validation Tests

#### Test 2.1: Empty Title
**Steps:**
1. Click "Create Flash Sale"
2. Leave title empty
3. Fill other required fields
4. Submit

**Expected:** Form validation prevents submission

#### Test 2.2: No Product Selected
**Steps:**
1. Fill title
2. Don't select a product
3. Submit

**Expected:** Alert: "Please select a product"

#### Test 2.3: Flash Price Higher Than Original
**Steps:**
1. Select a product with price $50
2. Enter flash price $60
3. Submit

**Expected:** 
- Warning message shows: "Flash price must be less than original price"
- Red text appears under flash price field

#### Test 2.4: Invalid Stock
**Steps:**
1. Enter 0 or negative number in stock
2. Submit

**Expected:** Form validation prevents submission

#### Test 2.5: No Duration Set
**Steps:**
1. Leave all duration fields at 0
2. Submit

**Expected:** Alert: "Please set a valid duration"

#### Test 2.6: Stock Exceeds Product Stock
**Steps:**
1. Select product with 10 items in stock
2. Enter flash sale stock of 20
3. Submit

**Expected:** 
- Warning appears: "Flash sale stock exceeds available product stock"
- Can still submit (warning only)

---

### 3. Product Search & Selection

**Steps:**
1. Click "Create Flash Sale"
2. Click in the product search field
3. Type partial product name (e.g., "head" for "Headphones")
4. Wait for results

**Expected Results:**
- ✅ Loading indicator appears briefly
- ✅ Dropdown shows matching products
- ✅ Each product shows image, name, price, and stock
- ✅ Click on product selects it
- ✅ Selected product displays in a card
- ✅ "Change" button allows reselection

---

### 4. Duration Picker

**Steps:**
1. In create form, test duration inputs:
   - Set hours to 24
   - Set minutes to 30
   - Set seconds to 45
2. Check total duration display

**Expected Results:**
- ✅ Shows "Total duration: 24h 30m 45s"
- ✅ Hours accepts 0-168
- ✅ Minutes accepts 0-59
- ✅ Seconds accepts 0-59
- ✅ Invalid values are prevented

---

### 5. Edit Flash Sale

**Steps:**
1. Find an existing flash sale
2. Click **"Edit"** button
3. Form opens with pre-filled data
4. Change title to "Updated Flash Sale"
5. Change flash price to a different value
6. Click **"Update Flash Sale"**

**Expected Results:**
- ✅ Form pre-fills with current data
- ✅ Product is pre-selected and displayed
- ✅ Duration is calculated from start/end times
- ✅ Success toast appears
- ✅ Dialog closes
- ✅ Changes reflect immediately in list
- ✅ Discount percentage recalculates if price changed

---

### 6. Edit Flash Sale - Edge Cases

#### Test 6.1: Edit Active Flash Sale
**Steps:**
1. Edit a currently live flash sale
2. Change flash price
3. Save

**Expected:** Updates successfully, discount recalculates

#### Test 6.2: Edit Ended Flash Sale
**Steps:**
1. Edit a flash sale that has ended
2. Make changes
3. Save

**Expected:** Updates successfully (can be reactivated)

---

### 7. Delete Flash Sale

**Steps:**
1. Click **"Delete"** button on a flash sale
2. Confirmation dialog appears
3. Click **"Cancel"**
4. Click **"Delete"** again
5. Click **"Delete"** in confirmation

**Expected Results:**
- ✅ Confirmation dialog shows warning message
- ✅ Cancel button closes dialog without deleting
- ✅ Delete button shows "Deleting..." during operation
- ✅ Success toast appears
- ✅ Flash sale removed from list immediately
- ✅ If on last item of page, pagination adjusts

---

### 8. Activate/Deactivate Flash Sale

**Steps:**
1. Find an active flash sale (green badge)
2. Click **"Deactivate"** button
3. Observe changes
4. Click **"Activate"** button
5. Observe changes

**Expected Results:**
- ✅ Deactivate: Badge changes to "Inactive" (outline)
- ✅ Deactivate: Success toast appears
- ✅ Activate: Badge changes to "Live" (green) if within time range
- ✅ Activate: Success toast appears
- ✅ Changes persist on page refresh

---

### 9. Search Functionality

**Steps:**
1. Create several flash sales with different titles
2. In search bar, type partial title
3. Wait for results
4. Clear search

**Expected Results:**
- ✅ Results filter as you type
- ✅ Search is case-insensitive
- ✅ No results shows empty state
- ✅ Clearing search shows all results

---

### 10. Status Filter

**Steps:**
1. Create flash sales with different statuses:
   - One that's currently live
   - One that ended (you can edit dates)
2. Test each filter option:
   - Select "All Status"
   - Select "Live"
   - Select "Upcoming"
   - Select "Ended"

**Expected Results:**
- ✅ "All Status": Shows all flash sales
- ✅ "Live": Shows only currently active ones
- ✅ "Upcoming": Shows scheduled for future (if any)
- ✅ "Ended": Shows past flash sales
- ✅ Filter works with search simultaneously

---

### 11. Pagination

**Steps:**
1. Create 15+ flash sales
2. Observe pagination controls
3. Click "Next" page
4. Click "Previous" page
5. Click specific page number

**Expected Results:**
- ✅ Shows 10 items per page
- ✅ Page numbers display correctly
- ✅ "Previous" disabled on first page
- ✅ "Next" disabled on last page
- ✅ Current page highlighted
- ✅ Pagination persists with filters

---

### 12. Real-time Countdown

**Steps:**
1. Create a flash sale with 5 minutes duration
2. Observe the countdown timer
3. Wait 1 minute
4. Refresh page

**Expected Results:**
- ✅ Timer shows "Xm Ys left"
- ✅ Timer updates (you may need to refresh to see changes)
- ✅ When time runs out, status changes to "Ended"
- ✅ Ended sales show "Ended" badge

---

### 13. Visual Elements

**Steps:**
1. View a flash sale card
2. Check all visual elements

**Expected Results:**
- ✅ Product image displays (or placeholder if no image)
- ✅ Title is prominent
- ✅ Status badges have correct colors:
  - Live: Green
  - Upcoming: Blue
  - Ended: Gray
  - Inactive: Outline
  - Featured: Yellow outline
- ✅ Original price shows with strikethrough
- ✅ Flash price is bold and prominent
- ✅ Discount badge is red with white text
- ✅ Stock information displays correctly
- ✅ Sold count shows if > 0
- ✅ Dates format correctly
- ✅ Product category displays

---

### 14. Loading States

**Steps:**
1. Clear browser cache
2. Navigate to Flash Sales page
3. Observe loading state
4. Create a flash sale
5. Observe button loading state

**Expected Results:**
- ✅ Page shows skeleton loaders while fetching
- ✅ Create button shows "Saving..." during submission
- ✅ Delete button shows "Deleting..." during deletion
- ✅ Buttons are disabled during operations
- ✅ No double-submission possible

---

### 15. Error Handling

#### Test 15.1: Network Error
**Steps:**
1. Stop the server
2. Try to create a flash sale
3. Observe error

**Expected:** Error toast with message

#### Test 15.2: Duplicate Flash Sale
**Steps:**
1. Create flash sale for Product A
2. Try to create another flash sale for Product A (while first is active)
3. Observe error

**Expected:** Error toast: "An active flash sale already exists for this product"

#### Test 15.3: Invalid Product
**Steps:**
1. Manually edit API request (using DevTools) with invalid product ID
2. Submit

**Expected:** Error toast: "Product not found"

---

### 16. Responsive Design

**Steps:**
1. Resize browser window to mobile size (375px)
2. Test all functionality
3. Resize to tablet (768px)
4. Resize to desktop (1920px)

**Expected Results:**
- ✅ Layout adapts to screen size
- ✅ Cards stack on mobile
- ✅ Dialog is scrollable on small screens
- ✅ All buttons accessible
- ✅ No horizontal scroll
- ✅ Text remains readable

---

### 17. Browser Compatibility

Test in multiple browsers:
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari (if on Mac)

**Expected:** All functionality works consistently

---

### 18. Performance

**Steps:**
1. Create 50+ flash sales
2. Navigate to page
3. Test search
4. Test pagination
5. Check browser DevTools Performance tab

**Expected Results:**
- ✅ Page loads in < 2 seconds
- ✅ Search responds quickly
- ✅ No memory leaks
- ✅ Smooth animations
- ✅ No console errors

---

### 19. Accessibility

**Steps:**
1. Use keyboard only (Tab, Enter, Escape)
2. Navigate through form
3. Submit using keyboard
4. Test with screen reader (optional)

**Expected Results:**
- ✅ All interactive elements focusable
- ✅ Focus indicators visible
- ✅ Tab order logical
- ✅ Enter submits form
- ✅ Escape closes dialog
- ✅ Labels associated with inputs

---

### 20. Data Persistence

**Steps:**
1. Create a flash sale
2. Refresh page
3. Close browser
4. Reopen and navigate to Flash Sales

**Expected Results:**
- ✅ Flash sale persists after refresh
- ✅ Flash sale persists after browser close
- ✅ All data intact (images, prices, dates)
- ✅ Status updates correctly based on time

---

## 🐛 Common Issues & Solutions

### Issue 1: "Product not found" error
**Solution:** Ensure product exists in database and ID is valid

### Issue 2: Flash sale not appearing in list
**Solution:** Check status filter, search term, or pagination

### Issue 3: Countdown timer not updating
**Solution:** This is expected - timer updates on page refresh or component remount

### Issue 4: Cannot create flash sale
**Solution:** 
- Verify you're logged in as admin
- Check server is running
- Check network tab for errors

### Issue 5: Images not loading
**Solution:** 
- Verify image URLs are valid
- Check CORS settings on image server
- Check browser console for errors

---

## 📊 Test Results Template

Use this template to track your testing:

```
[ ] Test 1: Create Flash Sale - Happy Path
[ ] Test 2: Validation Tests (all sub-tests)
[ ] Test 3: Product Search & Selection
[ ] Test 4: Duration Picker
[ ] Test 5: Edit Flash Sale
[ ] Test 6: Edit Edge Cases
[ ] Test 7: Delete Flash Sale
[ ] Test 8: Activate/Deactivate
[ ] Test 9: Search Functionality
[ ] Test 10: Status Filter
[ ] Test 11: Pagination
[ ] Test 12: Real-time Countdown
[ ] Test 13: Visual Elements
[ ] Test 14: Loading States
[ ] Test 15: Error Handling
[ ] Test 16: Responsive Design
[ ] Test 17: Browser Compatibility
[ ] Test 18: Performance
[ ] Test 19: Accessibility
[ ] Test 20: Data Persistence
```

---

## 🎓 Testing Tips

1. **Test in Order**: Follow the test sequence for best results
2. **Use DevTools**: Keep browser console open to catch errors
3. **Test Edge Cases**: Try unusual inputs and scenarios
4. **Document Issues**: Note any bugs with steps to reproduce
5. **Test Incrementally**: Test after each code change
6. **Use Real Data**: Test with actual product data when possible
7. **Clear Cache**: Clear browser cache if seeing stale data
8. **Check Network**: Monitor network requests in DevTools

---

## ✅ Sign-off Checklist

Before considering testing complete:

- [ ] All 20 test scenarios passed
- [ ] No console errors
- [ ] No linter errors
- [ ] All validations working
- [ ] Error handling works
- [ ] Loading states display correctly
- [ ] Responsive on all screen sizes
- [ ] Accessible via keyboard
- [ ] Data persists correctly
- [ ] Performance is acceptable

---

## 📝 Bug Report Template

If you find a bug, report it using this format:

```markdown
**Bug Title:** [Short description]

**Severity:** Critical / High / Medium / Low

**Steps to Reproduce:**
1. Step one
2. Step two
3. Step three

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Screenshots:**
[If applicable]

**Environment:**
- Browser: [e.g., Chrome 120]
- OS: [e.g., Windows 11]
- Screen Size: [e.g., 1920x1080]

**Console Errors:**
[Paste any console errors]

**Additional Notes:**
[Any other relevant information]
```

---

## 🎉 Testing Complete!

Once all tests pass, the Flash Sale feature is ready for production use!

**Happy Testing! 🚀**
