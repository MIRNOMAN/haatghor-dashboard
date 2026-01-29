# Quick Start Guide - New Features

## 🚀 Getting Started

This guide will help you quickly get up and running with all the new features integrated into the HaatGhor Dashboard.

## 📋 Prerequisites

Before using the new features, ensure:
1. ✅ Backend server is running (`haatghor-server`)
2. ✅ WebSocket server is enabled (automatic with backend)
3. ✅ You have admin credentials
4. ✅ Database is properly seeded

## 🔧 Environment Setup

Make sure your `.env` or `.env.local` file has:

```env
NEXT_PUBLIC_BASEURL_DEV=http://localhost:5000/api/v1
NEXT_PUBLIC_BASEURL_PROD=https://your-production-api.com/api/v1
```

**Important:** The WebSocket connection automatically derives from this URL:
- HTTP → WebSocket (ws://)
- HTTPS → Secure WebSocket (wss://)

## 🎯 Feature Access

### 1. Flash Sales Management

**Access:** Click "Flash Sales" in the sidebar (lightning icon)

**Quick Actions:**
- **View Sales:** Automatically loads when page opens
- **Create Sale:** Click "Create Flash Sale" button
- **Edit Sale:** Click pencil icon on any sale
- **Toggle Status:** Click "Activate" or "Deactivate" button
- **Delete Sale:** Click trash icon and confirm

**Status Indicators:**
- 🟢 **Active** - Sale is currently running
- ⚪ **Inactive** - Sale is created but not active
- ⚫ **Ended** - Sale period has passed

### 2. Notifications Management

**Access:** Click "Notifications" in the sidebar (bell icon)

**Quick Actions:**
- **View All:** Opens automatically
- **Mark as Read:** Click "Mark Read" on individual notification
- **Mark All Read:** Click "Mark All Read" in header
- **Send Broadcast:** Click "Send Broadcast" button
- **Delete:** Click trash icon

**Notification Types:**
- 🔵 **INFO** - Informational messages
- 🟡 **WARNING** - Warning messages
- 🔴 **ERROR** - Error messages
- 🟢 **SUCCESS** - Success messages

### 3. Subscriptions Management

**Access:** Click "Subscriptions" in the Finance section (credit card icon)

**Quick Actions:**
- **View All:** Automatically loads
- **Search User:** Type name or email in search bar
- **Cancel Subscription:** Click "Cancel" button on active subscriptions
- **Delete:** Click trash icon

**Subscription Status:**
- 🟢 **ACTIVE** - Currently active
- 🔴 **EXPIRED** - Subscription expired
- ⚪ **CANCELLED** - Manually cancelled

**Plan Types:**
- 🔵 **MONTHLY** - Monthly subscription
- 🟣 **YEARLY** - Annual subscription
- 🟡 **LIFETIME** - One-time lifetime access

### 4. Payments Management

**Access:** Click "Payments" in the Finance section (dollar sign icon)

**Quick Actions:**
- **View All:** Automatically loads
- **Search:** Search by transaction ID, user, or order
- **Process Refund:** Click "Refund" on completed payments
- **Delete:** Click trash icon
- **Export:** Click "Export" (UI ready)

**Payment Status:**
- 🟡 **PENDING** - Awaiting processing
- 🟢 **COMPLETED** - Successfully completed
- 🔴 **FAILED** - Payment failed
- 🔵 **REFUNDED** - Payment refunded

### 5. Chat System (Enhanced)

**Access:** Click "Chats" in the sidebar (message icon)

**Connection Status:**
- Look for connection indicator at bottom
- Green = Connected
- Red = Disconnected (auto-reconnecting)

**Quick Actions:**
- **Start Chat:** Click "+" icon in chat sidebar
- **Select User:** Search and select from user list
- **Send Message:** Type and press Enter or click send
- **Attach File:** Click paperclip icon
- **View Online Status:** Green dot = online

**Troubleshooting Chat:**
If chat doesn't connect:
1. Check if you're logged in
2. Verify backend server is running
3. Check browser console for errors
4. Wait 3 seconds for auto-reconnect
5. Refresh the page if needed

## 🎨 UI Components Guide

### Search Functionality
All list pages have search:
- Type in the search box
- Results filter automatically
- Press Enter or wait for auto-search

### Pagination
Navigate through pages:
- Click page numbers
- Use Previous/Next buttons
- Shows current page and total pages

### Actions
Common actions on all pages:
- ✏️ **Edit** - Modify existing records
- 🗑️ **Delete** - Remove records (with confirmation)
- 👁️ **View** - View details
- ⚡ **Toggle** - Enable/disable

### Confirmation Dialogs
For destructive actions:
- Red "Delete" button
- Gray "Cancel" button
- Clear description of action

## 📱 Navigation Structure

```
HaatGhor Dashboard
│
├── 📊 Dashboard (Home)
├── 📦 Products
├── 📁 Categories
├── 🛒 Orders
├── 👥 Users
├── 💬 Chats ← Enhanced
├── 🖼️ Banners
├── ⚡ Flash Sales ← NEW
├── 🔔 Notifications ← NEW
│
├── 📄 CONTENT
│   ├── Images
│   ├── Reviews
│   ├── FAQ
│   ├── Contact
│   └── Privacy Policy
│
├── 💰 FINANCE ← NEW SECTION
│   ├── Payments ← NEW
│   └── Subscriptions ← NEW
│
└── ⚙️ Settings
```

## 🔍 Common Tasks

### Task: Create a Flash Sale
1. Navigate to Flash Sales
2. Click "Create Flash Sale"
3. Fill in details:
   - Name
   - Start/End time
   - Discount percentage
   - Select products
4. Click "Create"
5. Toggle to "Active" when ready

### Task: Send Notification to All Users
1. Navigate to Notifications
2. Click "Send Broadcast"
3. Fill in:
   - Title
   - Message
   - Type (INFO, WARNING, ERROR, SUCCESS)
4. Click "Send"

### Task: Process a Refund
1. Navigate to Payments
2. Find the completed payment
3. Click "Refund" button
4. Confirm the refund
5. Status changes to "REFUNDED"

### Task: Cancel a Subscription
1. Navigate to Subscriptions
2. Find the active subscription
3. Click "Cancel" button
4. Confirm cancellation
5. Status changes to "CANCELLED"

### Task: Start a Chat
1. Navigate to Chats
2. Click "+" icon in sidebar
3. Search for user by name or email
4. Click on user to select
5. Chat room opens automatically
6. Type message and send

## 🐛 Troubleshooting

### Issue: Page won't load
**Solution:**
1. Check if backend is running
2. Verify you're logged in
3. Check network tab for API errors
4. Clear browser cache

### Issue: WebSocket not connecting
**Solution:**
1. Ensure backend server is running
2. Check console for connection errors
3. Verify token is valid
4. Wait for auto-reconnect (3 seconds)

### Issue: Search not working
**Solution:**
1. Type at least 2 characters
2. Wait a moment for results
3. Check if data exists in database

### Issue: Actions fail
**Solution:**
1. Check if you have proper permissions
2. Verify the record exists
3. Check server logs
4. Check browser console

## 📊 Data Requirements

### Flash Sales
Needs: Products to be created first

### Notifications
Needs: Users in the system

### Subscriptions
Needs: Users and subscription plans configured

### Payments
Needs: Orders and users

### Chat
Needs: At least 2 users in the system

## 🎯 Best Practices

1. **Flash Sales**
   - Set reasonable time periods
   - Don't overlap flash sales
   - Test with few products first
   - Monitor active status

2. **Notifications**
   - Use appropriate types
   - Keep messages concise
   - Don't spam broadcasts
   - Mark as read to track progress

3. **Subscriptions**
   - Verify dates before creating
   - Cancel before deleting
   - Check expiry regularly
   - Keep records for accounting

4. **Payments**
   - Process refunds carefully
   - Keep transaction records
   - Export regularly for backup
   - Verify amounts before refund

5. **Chat**
   - Be professional
   - Respond promptly
   - Use file attachments wisely
   - Check online status first

## 🔐 Security Notes

- All endpoints require authentication
- Tokens auto-refresh on expiry
- WebSocket connections are authenticated
- Role-based access control active
- Sensitive actions require confirmation

## 📈 Performance Tips

1. Use search to narrow results
2. Adjust pagination limit if needed
3. Close unused chat rooms
4. Clear old notifications
5. Archive old payments/subscriptions

## 🎉 You're All Set!

You now have access to:
- ✅ Flash Sales Management
- ✅ Notifications System
- ✅ Subscriptions Management
- ✅ Payments Processing
- ✅ Enhanced Real-time Chat

Enjoy managing your HaatGhor platform! 🚀

## 📞 Need Help?

1. Check the main documentation: `INTEGRATION_COMPLETE.md`
2. Review API documentation: `API_DOCUMENTATION.md`
3. Check server logs for errors
4. Review browser console for client errors

---

**Happy Managing! 🎊**
