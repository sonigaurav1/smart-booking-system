# 🎯 Smart Booking System

A complete, production-ready **SaaS booking platform** for service businesses (salons, clinics, gyms, repair shops, etc.) to manage appointments, staff, and customers online.

**Status:** ✅ **Production Ready** | **Features:** 7/7 Complete

---

## 🚀 Quick Start (3 minutes)

### Installation & Setup

```bash
# Step 1: Install dependencies
npm install

# Step 2: Start dev servers (open 2 terminals)
npm run convex    # Terminal 1 - Backend
npm run dev       # Terminal 2 - Frontend

# Step 3: Open http://localhost:3000
```

### Main Routes

| Route               | Purpose               | Who    |
| ------------------- | --------------------- | ------ |
| `/`                 | Landing page          | Anyone |
| `/shop/all`         | Browse shops          | Anyone |
| `/shop/[slug]`      | Shop detail + booking | Anyone |
| `/client/dashboard` | Business stats        | Client |
| `/client/bookings`  | View appointments     | Client |
| `/client/services`  | Manage services       | Client |
| `/client/employees` | Manage team           | Client |
| `/client/settings`  | Business hours config | Client |
| `/sign-in`          | Login                 | Anyone |
| `/sign-up`          | Register              | Anyone |

---

## 🎯 Quick Demo (10 minutes)

### Customer Path

1. Go to `/shop/all`
2. Click any business
3. Click "Book [Service]"
4. Fill form → Confirm booking
5. See confirmation ✅

### Business Owner Path

1. Sign up / Log in
2. Go to `/client/services` → Add services
3. Go to `/client/employees` → Add employees
4. Go to `/client/settings` → Set business hours
5. Go to `/client/bookings` → Manage appointments
6. Go to `/client/dashboard` → View stats

---

## ✨ Core Features

### 1. 🏪 Public Shop Discovery

- View all available businesses with descriptions
- Search and filter by category
- Responsive design on all devices

### 2. 📅 One-Click Booking

- Select service from available options
- Choose preferred staff member
- Pick date & time with real-time availability
- Instant confirmation with booking details
- Conflict detection prevents double-booking

### 3. 📊 Business Dashboard

- Total appointments at a glance
- Completed vs. pending appointments tracking
- Customer count and growth metrics
- Revenue overview from completed bookings
- Live charts showing booking trends

### 4. 🛠️ Services Management

- Create services with name, price, duration, category
- Edit service details anytime
- Delete services with confirmation
- Real-time sync to booking widget

### 5. 👥 Employee Management

- Add team members with email and details
- Edit employee information
- Delete staff when needed
- Assign to services during booking

### 6. 📋 Appointment Management

- View all appointments in organized list
- See appointment details (client, service, time, staff)
- Track status (pending/done/cancelled)
- Cancel bookings with customer notification

### 7. 🔐 Authentication & Authorization

- Clerk authentication - secure sign-in/sign-up
- Role-based access control (admin/client/customer)
- Protected routes - automatic access enforcement
- Session management and JWT tokens

---

## 📊 Technology Stack

| Layer    | Tech                    | Purpose                   |
| -------- | ----------------------- | ------------------------- |
| Frontend | Next.js 15 (App Router) | Modern React framework    |
| Backend  | Convex                  | Serverless DB & functions |
| Auth     | Clerk                   | Secure authentication     |
| UI       | shadcn/ui               | Beautiful components      |
| Styling  | Tailwind CSS            | Responsive design         |
| Language | TypeScript              | Type-safe code            |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (public)     → Landing, shop browsing
│   ├── (client)     → Dashboard, bookings, management
│   ├── (admin)      → Admin features
│   └── (auth)       → Sign in/up
├── components/      → UI components
├── booking/         → Booking interface
├── dashboard/       → Dashboard components
├── constants/       → PATH constants
└── lib/             → Utilities & helpers

convex/
├── schema.ts        → Database schema
├── functions/
│   ├── queries/     → Read operations
│   └── mutations/   → Write operations
└── lib/             → Backend utilities
```

---

## 🔐 Authentication & Roles

All user roles managed by **Clerk**:

- **Admin** - System owner, manage platform
- **Client** - Business owner, receive bookings
- **User** - Customer, book appointments

Route protection enforced via middleware automatically.

---

## 💡 Quick Tips

- **First time?** Create a business in profile settings
- **Empty appointments list?** Make sure you're logged in as the business owner
- **No services showing?** Create services first at `/client/services`
- **Booking failed?** Check:
  - Fill all fields (name, email)
  - Select all dropdowns
  - Pick future date
  - Professional might be busy at that time

---

## 🧪 Quick Test (5 min)

1. Sign up as business owner
2. Go to `/client/services` → Add "Hair Cut" ($25, 30 min)
3. Go to `/client/employees` → Add "John" (john@test.com)
4. Go to `/shop/all` (open in new tab or logout)
5. Click your shop → Book "Hair Cut" with John
6. Go back to `/client/bookings` → See your booking!

---

## 🚀 Deployment

```bash
# Build for production
npm run build

# Start production server
npm start

# Or deploy to Vercel (recommended)
vercel deploy
```

---

## 🔧 Development

### Project Structure

- Uses Next.js App Router with grouped routes
- TypeScript strict mode enabled
- Real-time updates with Convex
- Clerk authentication with role-based access
- Tailwind CSS + shadcn/ui components
- Use `@/*` path alias for absolute imports (see tsconfig.json)

### Key Development Patterns

**Backend (Convex):**

- New style: default-exported `query`/`mutation` modules under `convex/functions/...`
- Use explicit `args` with `convex/values` validation
- Reuse `convex/functions/helpers/requireRole.ts` for RBAC checks
- Only query rows via defined indexes in `schema.ts`
- Store timestamps as `Date.now()` numbers

**Frontend:**

- Convex client: `src/lib/convex-client.ts` for API calls
- Route protection: `src/middleware.ts` enforces access by role
- UI: shadcn/ui components in `src/components/ui/`
- Booking widgets: `src/components/booking/` for date/time selection
- Routes: import from `src/constants/PATH.ts` to avoid hardcoding URLs

### Development Checklist

- ✅ Both Next.js and Convex dev servers running (`npm run dev` + `npm run convex`)
- ✅ `NEXT_PUBLIC_CONVEX_URL` environment variable set
- ✅ Clerk auth tokens configured (see `convex/auth.config.ts`)
- ✅ TypeScript compilation passes (`npm run build`)

See [.github/copilot-instructions.md](.github/copilot-instructions.md) for detailed dev guidelines.

---

## 📱 Responsive Design

- ✅ Mobile-first approach
- ✅ Tablet optimized layouts
- ✅ Desktop full experience
- ✅ Touch-friendly buttons and inputs
- ✅ WCAG accessibility compliance

---

## 🔒 Security Features

- ✅ Encrypted passwords via Clerk
- ✅ JWT authentication for APIs
- ✅ Role-based authorization on routes
- ✅ CSRF protection on mutations
- ✅ Data validation on all inputs
- ✅ SQL injection prevention via Convex

---

## ⚡ Common Tasks

### Create a Service

`/client/services` → Add Service → Fill form → Save

### Add an Employee

`/client/employees` → Add Employee → Enter name + email → Save

### View Bookings

`/client/bookings` → See all customer appointments

### Cancel Appointment

`/client/bookings` → Find appointment → Cancel button → Confirm

### Book Appointment (as customer)

`/shop/all` → Click shop → Fill form → Select options → Book

---

## 🐛 Troubleshooting

| Issue              | Solution                                                                     |
| ------------------ | ---------------------------------------------------------------------------- |
| Page won't load    | Make sure both servers running (`npm run dev` + `npm run convex`)            |
| No data showing    | Try refreshing browser, check user is logged in                              |
| Connection error   | Verify `NEXT_PUBLIC_CONVEX_URL` is set                                       |
| Booking failed     | Check all fields filled, select all dropdowns, pick future date              |
| Role access denied | Verify user role in Clerk dashboard, check middleware in `src/middleware.ts` |

---

## 📊 Project Status

✅ Features: 7/7 Complete  
✅ Documentation: Consolidated single README  
✅ Quality: Production Grade  
✅ Ready to Deploy: YES

---

**Created:** March 2025  
**Last Updated:** March 26, 2026  
**Status:** Production Ready 🚀
