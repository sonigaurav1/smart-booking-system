# 🎯 Quick Reference Card

## 🚀 Start Here

```bash
# Terminal 1 - Backend
npm run convex

# Terminal 2 - Frontend
npm run dev

# Visit: http://localhost:3000
```

## 📍 Main Routes

| Route               | Purpose               | Who    |
| ------------------- | --------------------- | ------ |
| `/shop/all`         | Browse shops          | Anyone |
| `/shop/[slug]`      | Shop detail + booking | Anyone |
| `/client/dashboard` | Business stats        | Client |
| `/client/bookings`  | View appointments     | Client |
| `/client/services`  | Manage services       | Client |
| `/client/employees` | Manage team           | Client |
| `/sign-in`          | Login                 | Anyone |
| `/sign-up`          | Register              | Anyone |

## 🔑 Key Features

### Booking Widget

```
Fill Name/Email → Select Service → Select Professional → Pick Date/Time → Confirm
```

### Services Management

```
Create → Edit → List → Delete
- Name, Duration, Price, Category, Description
```

### Employees Management

```
Create → Edit → List → Delete
- Name, Email
```

### Appointments Tracking

```
View List → See Details → Cancel if needed → Status updates
- Pending, Done, Cancelled
```

## 💡 Tips

- **First time?** Create a business in profile settings
- **Empty appointments list?** Make sure you're logged in as the business owner
- **No services showing?** Create services first at `/client/services`
- **Booking failed?** Check:
  - Fill all fields (name, email)
  - Select all dropdowns
  - Pick future date
  - Professional might be busy at that time

## 🧪 Quick Test (5 min)

1. Sign up as business owner
2. Go to `/client/services` → Add "Hair Cut" ($25, 30 min)
3. Go to `/client/employees` → Add "John" (john@test.com)
4. Go to `/shop/all` (open in new tab or logout)
5. Click your shop → Book "Hair Cut" with John
6. Go back to `/client/bookings` → See your booking!

## 🛠️ Stack

| Part     | Tech                    |
| -------- | ----------------------- |
| Frontend | Next.js 14 (App Router) |
| Styling  | Tailwind + shadcn/ui    |
| Backend  | Convex                  |
| Auth     | Clerk                   |
| Database | Convex (serverless)     |

## 📱 Responsive

- ✅ Desktop
- ✅ Tablet
- ✅ Mobile (use DevTools F12 to test)

## 🔐 Access Control

- **Admin** - `/admin/*` routes
- **Client** - `/client/*` routes (business owners)
- **User** - Can browse & book (no special route)

## 🎨 Components Used

- Cards, Buttons, Dialogs
- Date Picker, Time Selector
- Dropdowns, Text Inputs
- Toast notifications
- Alert dialogs

## 📖 Learn More

- **Features** - See `MVP-GUIDE.md`
- **Testing** - See `TESTING-GUIDE.md`
- **Full Details** - See `IMPLEMENTATION-SUMMARY.md`

## ⚡ Common Tasks

### Create a Service

```
/client/services → Add Service → Fill form → Save
```

### Add an Employee

```
/client/employees → Add Employee → Enter name + email → Save
```

### View Bookings

```
/client/bookings → See all customer appointments
```

### Cancel Appointment

```
/client/bookings → Find appointment → Cancel button → Confirm
```

### Book Appointment (as customer)

```
/shop/all → Click shop → Fill form → Select options → Book
```

## 🐛 Issues?

- **Page won't load** - Make sure both servers running
- **No data showing** - Try refreshing browser
- **Error message** - Check field requirements
- **Connection error** - Verify `NEXT_PUBLIC_CONVEX_URL`

## ✅ Status

- ✅ MVP Complete
- ✅ All features working
- ✅ Type-safe code
- ✅ Error handling
- ✅ Mobile responsive
- ✅ Ready to test/deploy

---

**Start with:** `npm run dev` then visit `/shop/all` 🚀
