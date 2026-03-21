# Quick Start Testing Guide

## 🚀 Run the Application

### Terminal 1 - Convex Backend:

```bash
npm run convex
# Output: Convex dev server running at http://localhost:3210
# Copy the Convex URL and set it as NEXT_PUBLIC_CONVEX_URL
```

### Terminal 2 - Next.js Frontend:

```bash
npm run dev
# Application will run at http://localhost:3000
```

## 📋 Testing Checklist

### Phase 1: Setup & Authentication

- [ ] Navigate to `http://localhost:3000`
- [ ] Click "Sign Up"
- [ ] Create two accounts:
  1. One for **business owner** (mark as client)
  2. One for **customer** (mark as user)
- [ ] Log in with business owner account

### Phase 2: Business Setup (as Business Owner)

1. Go to `/client/dashboard`
   - [ ] You should see "No business found" or create one
   - [ ] Create a business via profile settings

2. Go to `/client/services`
   - [ ] Click "Add Service"
   - [ ] Create 3 services:
     - [ ] Service 1: "Hair Cut" - 30 min - $25
     - [ ] Service 2: "Hair Wash" - 20 min - $15
     - [ ] Service 3: "Full Styling" - 45 min - $50
   - [ ] Verify services appear in list
   - [ ] Try editing one service
   - [ ] Test delete (with confirmation)

3. Go to `/client/employees`
   - [ ] Click "Add Employee"
   - [ ] Create 2 employees:
     - [ ] "John Smith" - john@salon.com
     - [ ] "Jane Doe" - jane@salon.com
   - [ ] Verify employees appear in list
   - [ ] Try editing an employee
   - [ ] Test delete (with confirmation)

### Phase 3: Public Booking (as Customer or New Tab)

1. Logout from business owner account (or open new incognito tab)

2. Navigate to `/shop/all`
   - [ ] You should see your business listed
   - [ ] Click on your business card

3. On business detail page (`/shop/[slug]`)
   - [ ] You should see "Book an Appointment" form
   - [ ] Services dropdown should show your 3 services
   - [ ] Professionals dropdown should show your 2 employees

4. Complete a booking:
   - [ ] Enter name: "Test Customer"
   - [ ] Enter email: "customer@test.com"
   - [ ] Select service: "Hair Cut"
   - [ ] Select professional: "John Smith"
   - [ ] Select future date (click on calendar)
   - [ ] Select time (e.g., "10:00 AM")
   - [ ] Click "Book Hair Cut"
   - [ ] [ ] Should show success toast and redirect to confirmation
   - [ ] You should see appointment confirmation

### Phase 4: Client Dashboard & Bookings

1. Login back as business owner (or switch tabs)

2. Go to `/client/dashboard`
   - [ ] You should see 1 total appointment
   - [ ] You should see 1 pending appointment
   - [ ] Stats should show 1 unique customer

3. Go to `/client/bookings`
   - [ ] You should see the booking you just made
   - [ ] Shows:
     - [ ] "Test Customer" as client name
     - [ ] "Hair Cut" as service
     - [ ] "John Smith" as professional
     - [ ] "Pending" status badge
   - [ ] Click on appointment to see details
   - [ ] Click "Cancel Appointment" button
   - [ ] Confirm cancellation
   - [ ] Verify status changes to "Cancelled"

### Phase 5: Multiple Bookings Test

1. Create 3-5 more bookings with different:
   - [ ] Services
   - [ ] Professionals
   - [ ] Dates/times
   - [ ] Customer names

2. Back on `/client/bookings`
   - [ ] All bookings should be visible
   - [ ] Can sort/scroll through them
   - [ ] Each shows correct information

### Phase 6: Data Validation

1. Try to create booking with:
   - [ ] Same time/professional (should fail - "Slot not available")
   - [ ] Empty customer name (should fail)
   - [ ] Invalid email format (should validate)

2. Try to create service with:
   - [ ] Empty name (should prevent save)
   - [ ] Negative duration (try to set)
   - [ ] Negative price (try to set)

## 🐛 Troubleshooting

### Issue: "Convex endpoint not reachable"

**Solution**:

- Make sure `npm run convex` is running
- Check `NEXT_PUBLIC_CONVEX_URL` is set correctly
- Copy URL from `npm run convex` output

### Issue: "User not authenticated"

**Solution**:

- Make sure Clerk environment variables are set
- Check `/sign-in` page loads correctly
- Try signing up for a new account

### Issue: "No business found"

**Solution**:

- Create a business in profile settings first
- Or set your role to "client" in Clerk dashboard

### Issue: Appointments not showing

**Solution**:

- Make sure you're viewing with the correct business owner account
- Check appointments were actually created (no error toast)
- Refresh the page

## 📊 Expected Results

After completing all tests, you should have:

- ✅ 3-5 services in business
- ✅ 2 employees
- ✅ 3-5 bookings (mix of pending and cancelled)
- ✅ Dashboard showing correct stats
- ✅ All CRUD operations working (Create, Read, Update, Delete)
- ✅ Real-time updates across pages
- ✅ Proper error handling with toast notifications

## 🎯 Performance Checks

- [ ] Page loads smoothly (< 2s)
- [ ] No console errors
- [ ] UI is responsive on mobile (use DevTools F12)
- [ ] Services/employees load quickly
- [ ] Bookings list is snappy even with many items

## ✅ Sign-Off

Once all tests pass:

- [ ] Core MVP is functional
- [ ] Ready for user testing
- [ ] Ready for deployment (set up hosting)

---

**Estimated testing time: 15-20 minutes**

Need help? Check [MVP-GUIDE.md](./MVP-GUIDE.md) for more details.
