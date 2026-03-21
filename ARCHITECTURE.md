# System Architecture & Data Flow

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        User Browser                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Next.js Frontend (React Components)                        │
│  ├─ Public Pages (/shop/*)                                 │
│  ├─ Client Pages (/client/*)                               │
│  ├─ Auth Pages (/sign-in, /sign-up)                        │
│  └─ Middleware (Route Protection)                          │
│                                                              │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/WebSocket
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Clerk Auth Service                       │
│              (User Authentication & Roles)                  │
└─────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   Convex Backend                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Queries (Read)                                             │
│  ├─ listBusinesses                                          │
│  ├─ getBusinessBySlug                                       │
│  ├─ listServicesForBusiness                                │
│  ├─ listEmployeesForBusiness        ← NEW                  │
│  ├─ getAppointmentsByBusiness       ← NEW                  │
│  └─ getBusinessStats                                       │
│                                                              │
│  Mutations (Write)                                          │
│  ├─ bookAppointment         ← UPDATED                      │
│  ├─ createService                                          │
│  ├─ updateService                                          │
│  ├─ deleteService                                          │
│  ├─ createEmployee                                         │
│  ├─ updateEmployee                                         │
│  ├─ deleteEmployee                                         │
│  ├─ updateAppointmentStatus                                │
│  └─ ... more mutations                                     │
│                                                              │
│  Database (Convex)                                          │
│  ├─ users (id, clerkId, email, role, ...)                 │
│  ├─ businesses (id, ownerId, slug, name, ...)             │
│  ├─ services (id, businessId, name, duration, price, ...) │
│  ├─ employees (id, businessId, name, email, ...)          │
│  ├─ appointments (id, businessId, serviceId, employeeId,) │
│  └─ clients (id, businessId, name, email, ...)            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Data Flow Diagram

### Booking Flow (Customer → Business)

```
Customer at /shop/all
       │
       ▼
Browse Shops (Query: listBusinesses)
       │
       ▼
Click Shop (Query: getBusinessBySlug)
       │
       ▼
View Services & Employees
(Query: listServicesForBusiness)
(Query: listEmployeesForBusiness)  ← Uses NEW query
       │
       ▼
Fill Booking Form
(name, email, service, employee, date, time)
       │
       ▼
Submit Booking
(Mutation: bookAppointment)  ← Uses UPDATED mutation
       │
       ├─ Validate: Employee exists ✓
       ├─ Validate: Service exists ✓
       ├─ Check: Slot conflict?
       │  (Query: getAppointmentsByBusiness)  ← Uses NEW query
       │
       ▼
Appointment Created
       │
       ▼
Business Owner Notified
(Appears in /client/bookings)
```

### Client Management Flow

```
Business Owner at /client/dashboard
       │
       ├─────────────────┬─────────────────┐
       ▼                 ▼                 ▼
   Services          Employees        Bookings
   /client/          /client/          /client/
   services          employees         bookings
       │                 │                 │
       ├─CRUD ops       ├─CRUD ops       ├─Read all
       │(Create)        │(Create)        │
       ├─(Read)         ├─(Read)         ├─View details
       ├─(Update)       ├─(Update)       └─Cancel
       └─(Delete)       └─(Delete)
```

## 🔄 Component Hierarchy

```
App
├─ (auth)
│  ├─ sign-in
│  └─ sign-up
│
├─ (public)
│  ├─ page (landing)
│  ├─ about
│  ├─ contact
│  ├─ help
│  └─ shop
│     ├─ all
│     │  └─ ShopCard
│     │     └─ ShopBookingWidget  ← ENHANCED
│     └─ [shopId]
│        └─ ShopBookingWidget  ← ENHANCED
│           ├─ DateSelector
│           ├─ TimeSelector
│           └─ Select dropdowns
│
├─ (client)  ← Protected by Middleware
│  └─ client
│     ├─ (overview)
│     │  └─ dashboard
│     │     ├─ Stats
│     │     ├─ BookingsChart
│     │     └─ EmployeeSchedule
│     │
│     ├─ (booking)
│     │  └─ bookings  ← NEW DYNAMIC PAGE
│     │     └─ AppointmentCard
│     │        └─ StatusBadge
│     │
│     └─ (manage)
│        ├─ services  ← ENHANCED
│        │  ├─ ServiceList
│        │  ├─ ServiceForm
│        │  └─ ServiceCard
│        │
│        └─ employees ← ENHANCED
│           ├─ EmployeeList
│           ├─ EmployeeForm
│           └─ EmployeeCard
```

## 🔐 Authorization Flow

```
Request comes in
       │
       ▼
Middleware checks
       │
       ├─ Is route public?
       │  YES → Allow ✓
       │
       ├─ Is user authenticated?
       │  NO → Redirect to /sign-in ✗
       │
       ├─ Get user role from Clerk
       │  │
       │  ├─ "admin" → Allow /admin/* ✓
       │  ├─ "client" → Allow /client/* ✓
       │  └─ "user" → Only public pages ✓
       │
       ▼
Request proceeds
       │
       ▼
Convex mutation/query
       │
       ├─ Verify business ownership
       ├─ Verify data belongs to user
       │
       ▼
Return data (if authorized)
```

## 📱 Page State Management

```
Each Page Component:
├─ State
│  ├─ data (fetched from Convex)
│  ├─ loading (boolean)
│  ├─ error (string or null)
│  └─ UI state (dialogs, selected items, etc)
│
├─ Effects
│  ├─ useEffect on mount
│  │  └─ Fetch data from Convex
│  │
│  └─ useEffect on user/dependency changes
│     └─ Re-fetch if needed
│
├─ Handlers
│  ├─ onCreate
│  ├─ onEdit
│  ├─ onDelete
│  └─ onStatusChange
│
└─ Render
   ├─ Loading state
   ├─ Error state
   ├─ Empty state
   └─ Data view
```

## 🎯 Request Flow Example: Book Appointment

```
User Click "Book"
   │
   ▼
handleBook() called
   │
   ▼
Validate inputs
   ├─ Name filled? ✓
   ├─ Email filled? ✓
   ├─ Service selected? ✓
   ├─ Employee selected? ✓
   ├─ Date selected? ✓
   └─ Time selected? ✓
   │
   ▼ (all valid)
Call convex.mutation(bookAppointment, {
   businessId,
   clientName,
   clientEmail,
   employeeId,
   serviceId,
   appointmentDate,
   appointmentTime
})
   │
   ▼ (to Convex backend)
Convex Handler
   │
   ├─ Verify employee exists
   ├─ Verify service exists
   ├─ Query existing appointments
   ├─ Check for conflicts
   │
   ├─ If conflict found
   │  └─ Throw error
   │
   └─ If all good
      ├─ Insert appointment
      └─ Return appointmentId
   │
   ▼ (back to client)
Show success toast
Redirect to confirmation
```

## 📈 Query Performance

```
Queries with Indexes:
├─ listBusinesses
│  └─ Index: by_createdAt
│
├─ getBusinessBySlug
│  └─ Index: by_slug
│
├─ listServicesForBusiness
│  └─ Index: by_businessId
│
├─ listEmployeesForBusiness ← NEW
│  └─ Index: by_businessId
│
├─ getAppointmentsByBusiness ← NEW
│  └─ Index: by_businessId
│
└─ Appointment conflict check
   └─ Index: by_date_employee
      (checks date + employee combo)
```

## 🎯 Real-time Updates Strategy

Current: Client polling (fetch on mount, on user actions)

Future enhancements could add:

- Convex subscriptions for real-time updates
- Optimistic UI updates
- WebSocket connections

---

This architecture ensures:

- ✅ Clean separation of concerns
- ✅ Type safety with TypeScript
- ✅ Proper authorization at every level
- ✅ Scalable with Convex
- ✅ Responsive user experience
- ✅ Mobile-first design
