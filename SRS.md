# Smart Booking System - Software Requirement Specification (SRS)

## 1. Introduction

### 1.1 Purpose

This document outlines the complete software requirements for the Smart Booking System, a production-ready SaaS platform designed to help service businesses (salons, clinics, gyms, repair shops, etc.) manage appointments, staff, and customers online.

### 1.2 Document Scope

This SRS covers all functional and non-functional requirements for the Smart Booking System, including user roles, features, data models, API specifications, and system architecture.

### 1.3 Product Overview

The Smart Booking System is a web-based appointment management platform that enables:

- Business owners to manage their services, employees, and appointments
- Customers to discover businesses and book appointments in real-time
- Admins to manage system-wide users and businesses
- Real-time availability checking to prevent double-booking
- Automated confirmation notifications

---

## 2. Overall Description

### 2.1 Product Perspective

The Smart Booking System is a complete, standalone SaaS web application built with:

- **Frontend:** Next.js 15 (App Router) with TypeScript
- **Backend:** Convex (serverless database and functions)
- **Authentication:** Clerk (enterprise-grade auth provider)
- **UI Framework:** shadcn/ui with Tailwind CSS

### 2.2 Product Functions

The system provides three main functional areas:

1. **Public Shop Discovery** - Browse and discover service businesses
2. **Customer Booking** - Search and book appointments with real-time availability
3. **Business Management** - Dashboard for managing services, employees, appointments, and analytics

### 2.3 User Classes and Characteristics

#### 2.3.1 Customer/Client User

- **Characteristics:** End-user browsing businesses and booking appointments
- **Access Level:** Public shop viewing + booking functionality
- **Skills:** Basic internet and web application usage
- **Primary Goals:** Discover services and book appointments easily

#### 2.3.2 Business Owner

- **Characteristics:** Service business operator managing appointments
- **Access Level:** Business dashboard, service/employee management
- **Skills:** Business management experience
- **Primary Goals:** Manage team, schedule, services, and view business metrics

#### 2.3.3 Administrator

- **Characteristics:** System administrator with full platform control
- **Access Level:** Admin dashboard with full CRUD on all resources
- **Skills:** Technical and business management
- **Primary Goals:** Manage users, businesses, enforce policies, monitor system health

### 2.4 Operating Environment

- **Browsers:** Chrome, Firefox, Safari, Edge (latest versions)
- **Network:** Internet connection required
- **Devices:** Desktop, tablet, mobile
- **Backend:** Convex cloud infrastructure
- **Database:** Convex managed database

### 2.5 Design and Implementation Constraints

- Must use Next.js App Router for frontend routing
- Convex for backend database and functions
- Clerk for authentication and authorization
- shadcn/ui for consistent UI components
- TypeScript required for type safety
- Must be mobile-responsive

---

## 3. Specific Requirements

### 3.1 Functional Requirements

#### 3.1.1 Authentication & Authorization

**Requirement FR-1.1:** User Registration

- Users can sign up with email and password via Clerk
- Email verification required before account activation
- User roles assigned at signup (admin/client)
- **Acceptance Criteria:**
  - Registration form validates email format
  - Password strength requirements enforced
  - Email verification link sent and validated
  - User record created in database upon successful signup

**Requirement FR-1.2:** User Login

- Users can log in with email and password
- Session tokens generated and managed by Clerk
- JWT tokens used for API authentication
- **Acceptance Criteria:**
  - Login validates credentials
  - Session tokens generated and stored securely
  - Token expiration handled gracefully
  - Auto-logout on session expiration

**Requirement FR-1.3:** Role-Based Access Control (RBAC)

- Three roles: admin, client, customer
- Route-level access control enforced via middleware
- Public, client-only, and admin-only routes protected
- **Acceptance Criteria:**
  - Middleware blocks unauthorized access
  - 401 response for unauthenticated requests
  - 403 response for unauthorized access
  - Role changes applied immediately

**Requirement FR-1.4:** Password Reset

- Users can request password reset via email
- Reset link valid for 24 hours
- Password changed securely
- **Acceptance Criteria:**
  - Reset email sent with verification link
  - Link validates and allows password change
  - Old password invalidated immediately
  - User notified of password change

#### 3.1.2 Public Shop Discovery

**Requirement FR-2.1:** List All Businesses

- Display all active businesses on `/shop/all` route
- Show business name, description, category, logo
- Responsive grid layout (mobile-first design)
- **Acceptance Criteria:**
  - Page loads within 2 seconds
  - Displays all active businesses
  - Pagination for 20+ businesses
  - Images lazy-loaded for performance

**Requirement FR-2.2:** Search and Filter

- Filter businesses by category
- Search by business name
- Sort by creation date or popularity
- **Acceptance Criteria:**
  - Search returns results within 500ms
  - Filters work in combination
  - Results update without page reload
  - No results message shown when applicable

**Requirement FR-2.3:** Business Detail Page

- View complete business information
- Display all available services with prices and duration
- Show employee list
- Display business hours and contact info
- **Acceptance Criteria:**
  - Page loads business info from database
  - Displays all services in organized layout
  - Shows accurate business hours
  - Contact information visible and clickable

#### 3.1.3 Customer Appointment Booking

**Requirement FR-3.1:** Service Selection

- Browse available services for selected business
- View service name, duration, price, description
- Select service to book
- **Acceptance Criteria:**
  - All services displayed with accurate details
  - Service selection updates UI
  - Price and duration clearly shown
  - Description supports rich text

**Requirement FR-3.2:** Employee Selection

- Display available employees for selected service
- Show employee name, photo, availability
- Select preferred employee
- **Acceptance Criteria:**
  - Only available employees shown
  - Employee details displayed with photo
  - Availability status accurate
  - Employee assignment saved

**Requirement FR-3.3:** Date & Time Selection

- Calendar widget shows available dates
- Only future dates selectable
- Time slots filtered based on:
  - Business hours
  - Employee availability
  - Existing appointments (no conflicts)
- **Acceptance Criteria:**
  - Calendar prevents past date selection
  - Time slots match business hours
  - Unavailable slots disabled
  - Slot availability updates in real-time

**Requirement FR-3.4:** Availability Checking

- Query `appointments.by_date_employee` index
- Prevent double-booking of same employee/time
- Return available time slots only
- **Acceptance Criteria:**
  - No overlapping appointments created
  - Availability check completes in <500ms
  - Slot conflicts detected and prevented
  - User sees unavailable time slots as disabled

**Requirement FR-3.5:** Client Information Collection

- Collect client name, email, phone (required)
- Optional notes field
- Form validation on client-side and server-side
- **Acceptance Criteria:**
  - Email format validated
  - Phone number format validated
  - Required fields enforced
  - Data sanitized before storage

**Requirement FR-3.6:** Booking Confirmation

- Display booking summary before confirmation
- Show: service, employee, date/time, price, client info
- Require explicit confirmation from user
- **Acceptance Criteria:**
  - Summary shows all booking details
  - Confirmation button triggers booking creation
  - Cancel option available
  - Confirmation prevents accidental bookings

**Requirement FR-3.7:** Booking Creation

- Create appointment record with confirmed details
- Set initial status to "pending"
- Generate booking reference number
- Send confirmation email to client
- **Acceptance Criteria:**
  - Appointment created in database
  - Unique booking reference generated
  - Email sent within 5 seconds
  - Email includes booking details and confirmation link

**Requirement FR-3.8:** Booking Confirmation Page

- Display success message with booking details
- Show booking reference number
- Provide option to add to calendar (iCal export)
- Display next steps (await confirmation, etc.)
- **Acceptance Criteria:**
  - Confirmation page loads immediately after booking
  - All booking details displayed correctly
  - iCal export available and functional
  - Share booking option available

#### 3.1.4 Business Dashboard

**Requirement FR-4.1:** Dashboard Overview

- Display key metrics at a glance
- Show total appointments, completed appointments, customers
- Display revenue from completed bookings
- **Acceptance Criteria:**
  - Metrics load within 2 seconds
  - Numbers update in real-time
  - Calculations accurate
  - Mobile responsive

**Requirement FR-4.2:** Analytics Charts

- Display appointment trends over time
- Show completed vs pending appointments
- Revenue trends chart
- Customer growth metrics
- **Acceptance Criteria:**
  - Charts render correctly
  - Data aggregation accurate
  - Responsive on mobile
  - Load time <2 seconds

**Requirement FR-4.3:** Recent Bookings

- Display most recent appointments
- Show: client name, service, date/time, status
- Sortable by date, status, client name
- **Acceptance Criteria:**
  - Last 10 bookings displayed
  - Sort functionality works
  - Status badge shows current status
  - Links to full booking details

#### 3.1.5 Services Management

**Requirement FR-5.1:** List Services

- Display all services for business
- Show: name, duration, price, category, description
- Edit/delete actions available
- **Acceptance Criteria:**
  - All services listed
  - Accurate service details shown
  - Edit/delete buttons visible
  - No deleted services displayed

**Requirement FR-5.2:** Create Service

- Form with fields: name, duration (minutes), price, category, description
- Form validation (required fields, price format)
- Success message upon creation
- **Acceptance Criteria:**
  - All required fields validated
  - Duration as positive integer
  - Price as decimal number
  - Service appears in list immediately

**Requirement FR-5.3:** Update Service

- Edit existing service details
- All fields editable
- Validation same as create
- Changes reflected in booking widget immediately
- **Acceptance Criteria:**
  - All fields updatable
  - Validation enforced
  - Changes visible to customers within 5 seconds
  - Edit history not required

**Requirement FR-5.4:** Delete Service

- Delete service with confirmation
- Confirmation dialog prevents accidental deletion
- Service removed from list
- **Acceptance Criteria:**
  - Confirmation required before deletion
  - Service removed from database
  - Service unavailable in booking widget
  - Delete option only for business owner

#### 3.1.6 Employee Management

**Requirement FR-6.1:** List Employees

- Display all employees for business
- Show: name, email, photo, available times
- Edit/delete actions available
- **Acceptance Criteria:**
  - All employees listed
  - Accurate employee details shown
  - Photos displayed
  - Edit/delete buttons visible

**Requirement FR-6.2:** Add Employee

- Form with fields: name, email, photo URL, available times
- Form validation
- Success message upon creation
- **Acceptance Criteria:**
  - Required fields validated
  - Email format validated
  - Photo URL validated
  - Employee appears in list immediately

**Requirement FR-6.3:** Update Employee

- Edit existing employee details
- All fields editable
- Changes reflected immediately
- **Acceptance Criteria:**
  - All fields updatable
  - Validation enforced
  - Changes visible immediately
  - No data loss on update

**Requirement FR-6.4:** Delete Employee

- Delete employee with confirmation
- Confirmation dialog prevents accidental deletion
- Employee removed from list
- **Acceptance Criteria:**
  - Confirmation required before deletion
  - Employee removed from database
  - Employee unavailable in booking widget
  - Delete option only for business owner

#### 3.1.7 Appointment Management

**Requirement FR-7.1:** List Appointments

- Display all appointments for business
- Show: client name, service, date/time, employee, status
- Filter by status, date range, employee
- Sort by date, status, client
- **Acceptance Criteria:**
  - All appointments listed
  - Accurate details shown
  - Filters work independently and combined
  - Sort options functional

**Requirement FR-7.2:** View Appointment Details

- Display full appointment information
- Show: client details, service, employee, date/time, notes, status history
- Display booking reference number
- **Acceptance Criteria:**
  - All details displayed accurately
  - Status history shown
  - Booking reference visible
  - Client contact info shown

**Requirement FR-7.3:** Update Appointment Status

- Change status: pending → confirmed → done
- Allow cancellation at any status
- Status: pending, confirmed, done, cancelled
- Send notification email on status change
- **Acceptance Criteria:**
  - Status changes saved to database
  - Valid status transitions enforced
  - Email sent on status change
  - Status history tracked
  - User feedback on successful update

**Requirement FR-7.4:** Cancel Appointment

- Cancel appointment with optional reason
- Send cancellation email to client
- Status changed to "cancelled"
- Slot becomes available again
- **Acceptance Criteria:**
  - Cancellation recorded
  - Email sent to client
  - Slot available for rebooking
  - Cancellation reason optional
  - Cannot cancel completed appointments

#### 3.1.8 Business Settings

**Requirement FR-8.1:** Business Profile

- Edit: name, description, category, address, phone, logo
- Display current business info
- Validation on all fields
- **Acceptance Criteria:**
  - All fields editable
  - Changes saved to database
  - Changes visible immediately
  - Validation prevents invalid data

**Requirement FR-8.2:** Business Hours

- Set opening and closing times
- Support per-day hours (optional)
- Display on shop pages and booking widget
- **Acceptance Criteria:**
  - Hours saved for business
  - Time format validated
  - Hours displayed on public pages
  - Unavailable time slots disabled in booking

**Requirement FR-8.3:** Contact Information

- Store and display: phone, email, address
- Map integration (optional)
- Edit from settings page
- **Acceptance Criteria:**
  - Contact info stored in database
  - Displayed on business profile
  - Validated format
  - Links functional (mailto, tel, maps)

### 3.2 Non-Functional Requirements

#### 3.2.1 Performance

- **FR-NF-1.1:** Page load time <2 seconds for all pages
- **FR-NF-1.2:** API response time <500ms for all queries
- **FR-NF-1.3:** Database queries optimized with indexes
- **FR-NF-1.4:** Images lazy-loaded and optimized
- **FR-NF-1.5:** Client-side caching implemented for static assets

#### 3.2.2 Security

- **FR-NF-2.1:** HTTPS/TLS for all communications
- **FR-NF-2.2:** Passwords hashed and never logged
- **FR-NF-2.3:** JWT tokens used for API authentication
- **FR-NF-2.4:** CORS properly configured
- **FR-NF-2.5:** Input validation and sanitization enforced
- **FR-NF-2.6:** SQL injection prevention via parameterized queries
- **FR-NF-2.7:** Rate limiting on API endpoints
- **FR-NF-2.8:** RBAC enforced on all protected endpoints

#### 3.2.3 Scalability

- **FR-NF-3.1:** Support 10,000+ concurrent users
- **FR-NF-3.2:** Database auto-scales with Convex
- **FR-NF-3.3:** CDN for static asset delivery
- **FR-NF-3.4:** Stateless API design for horizontal scaling

#### 3.2.4 Reliability

- **FR-NF-4.1:** 99.9% uptime target
- **FR-NF-4.2:** Automatic error recovery
- **FR-NF-4.3:** Database backup and disaster recovery
- **FR-NF-4.4:** Graceful error handling and user feedback

#### 3.2.5 Usability

- **FR-NF-5.1:** Mobile-first responsive design
- **FR-NF-5.2:** Accessibility compliance (WCAG 2.1 AA minimum)
- **FR-NF-5.3:** Keyboard navigation support
- **FR-NF-5.4:** Loading states for all async operations
- **FR-NF-5.5:** Error messages clear and actionable

#### 3.2.6 Maintainability

- **FR-NF-6.1:** Clean code with TypeScript strict mode
- **FR-NF-6.2:** Comprehensive code comments and documentation
- **FR-NF-6.3:** Consistent naming conventions
- **FR-NF-6.4:** Modular component architecture
- **FR-NF-6.5:** Unit and integration test coverage >80%

#### 3.2.7 Compatibility

- **FR-NF-7.1:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **FR-NF-7.2:** iOS Safari 14+, Android Chrome
- **FR-NF-7.3:** Screen sizes from 320px to 4K displays

---

## 4. Data Requirements

### 4.1 Data Models

#### 4.1.1 Users Table

```
- clerkId (Primary Key, String, Unique)
- email (String, Unique)
- name (String)
- role (Enum: admin, client)
- createdAt (Number - Unix timestamp)
- indexes: by_clerkId, by_role
```

#### 4.1.2 Businesses Table

```
- _id (Primary Key, String)
- ownerId (Foreign Key → Users.clerkId)
- slug (String, Unique)
- name (String)
- description (String, Optional)
- category (String, Optional)
- address (String, Optional)
- phone (String, Optional)
- logo (String, Optional - URL)
- openTime (String - HH:MM format)
- closeTime (String - HH:MM format)
- createdAt (Number - Unix timestamp)
- indexes: by_ownerId, by_slug, by_createdAt
```

#### 4.1.3 Employees Table

```
- _id (Primary Key, String)
- businessId (Foreign Key → Businesses._id)
- name (String)
- email (String)
- photo (String, Optional - URL)
- availableTimes (Array of Strings - HH:MM format)
- createdAt (Number - Unix timestamp)
- indexes: by_businessId
```

#### 4.1.4 Services Table

```
- _id (Primary Key, String)
- businessId (Foreign Key → Businesses._id)
- name (String)
- duration (Number - minutes)
- description (String, Optional)
- category (String, Optional)
- price (Number, Optional - decimal)
- createdAt (Number - Unix timestamp)
- indexes: by_businessId
```

#### 4.1.5 Clients Table

```
- _id (Primary Key, String)
- businessId (Foreign Key → Businesses._id)
- clerkId (String, Optional - Clerk user ID)
- name (String)
- email (String, Optional)
- phone (String, Optional)
- createdAt (Number - Unix timestamp)
- indexes: by_businessId
```

#### 4.1.6 Appointments Table

```
- _id (Primary Key, String)
- businessId (Foreign Key → Businesses._id)
- clientId (String, Optional - Clerk user ID)
- clientName (String)
- clientEmail (String)
- employeeId (Foreign Key → Employees._id)
- serviceId (Foreign Key → Services._id)
- appointmentDate (String - YYYY-MM-DD format)
- appointmentTime (String - HH:MM format)
- status (Enum: pending, confirmed, done, cancelled)
- notes (String, Optional)
- createdAt (Number - Unix timestamp)
- indexes: by_businessId, by_date_employee (composite)
```

### 4.2 Data Validation Rules

- Email addresses must be valid format
- Timestamps must be Unix milliseconds (positive numbers)
- Prices must be non-negative decimals
- Duration must be positive integers
- Appointment dates must be future dates
- Business hours must be valid time format (HH:MM)
- Phone numbers must be digits and valid format

### 4.3 Data Retention

- User data retained for account lifetime + 30 days after deletion
- Appointment history retained for 3 years
- Deleted businesses retained for 30 days in archive
- Regular backups performed (minimum daily)

---

## 5. Interface Requirements

### 5.1 User Interface

#### 5.1.1 Public Pages

- **Landing Page** (`/`)
  - Hero section with call-to-action
  - Feature highlights
  - Footer with links
- **Shop Listing** (`/shop/all`)
  - Grid/list view of businesses
  - Search and filter controls
  - Business cards with key info
  - Pagination or infinite scroll
- **Shop Detail** (`/shop/[slug]`)
  - Business profile
  - Services list
  - Employee showcase
  - Booking widget (integrated)

#### 5.1.2 Client Pages

- **Client Dashboard** (`/client/dashboard`)
  - Overview cards with metrics
  - Charts and analytics
  - Recent bookings list
  - Quick action buttons
- **Services Management** (`/client/services`)
  - Services table
  - Add/Edit/Delete forms
  - Bulk actions (optional)
- **Employee Management** (`/client/employees`)
  - Employees table
  - Add/Edit/Delete forms
  - Photo upload
- **Appointments/Bookings** (`/client/bookings`)
  - Appointments table with filters
  - Appointment detail view
  - Status update controls
  - Cancellation functionality
- **Settings** (`/client/settings`)
  - Business profile edit
  - Business hours configuration
  - Contact information
  - Danger zone (delete business)

#### 5.1.3 Auth Pages

- **Sign In** (`/sign-in`)
  - Email/password form
  - Sign up link
  - Password reset link
- **Sign Up** (`/sign-up`)
  - Email/password form
  - Role selection
  - Sign in link

#### 5.1.4 Admin Pages (if applicable)

- **User Management**
  - User list with roles
  - Role update functionality
- **Business Management**
  - All businesses list
  - Business details and editing
  - Business deletion

### 5.2 Component Library

Using shadcn/ui components:

- Button, Input, Form, Card
- Dialog/Alert Dialog for confirmations
- Table for data display
- Tabs for content organization
- Badge for status indicators
- Avatar for user photos
- Calendar widget for date selection
- Toast notifications for feedback

### 5.3 Design System

- **Colors:** Consistent brand colors via Tailwind CSS
- **Typography:** Responsive font sizes
- **Spacing:** 4px base unit system
- **Icons:** Lucide React icons
- **Animations:** Subtle transitions (200-300ms)
- **Dark Mode:** Optional support via theme provider

---

## 6. System Architecture

### 6.1 Frontend Architecture

- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript
- **State Management:** React hooks + Convex client
- **Routing:** File-based routing (App Router)
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui + custom components

### 6.2 Backend Architecture

- **Database:** Convex (serverless)
- **API:** Convex HTTP API
- **Authentication:** Clerk JWT integration
- **Functions:** Convex queries and mutations
- **Schema:** Defined in `convex/schema.ts`

### 6.3 Deployment

- **Frontend:** Vercel (recommended for Next.js)
- **Backend:** Convex cloud
- **Auth:** Clerk cloud
- **CDN:** Vercel edge network

---

## 7. External Interface Requirements

### 7.1 Clerk Authentication API

- OAuth integration for sign in/sign up
- JWT token generation and validation
- User metadata storage and retrieval
- Session management

### 7.2 Email Service

- Confirmation emails for bookings
- Status change notifications
- Password reset emails
- Business notifications (optional)

### 7.3 Payment Integration (Future)

- Stripe for payment processing
- Invoice generation
- Refund handling

---

## 8. Business Rules

### 8.1 Booking Rules

- Appointments cannot be booked for past dates/times
- Slots cannot overlap for same employee on same date
- Business hours must be respected
- Minimum notice period may be enforced (configurable)
- Cancellation must be allowed up to X hours before appointment

### 8.2 Pricing Rules

- Service prices non-negative
- Business can set custom prices
- Discounts optional (future feature)

### 8.3 Access Control Rules

- Customers can only view public shop pages
- Business owners can only manage their own business
- Admins can manage all businesses and users
- Users cannot modify other users' profiles

### 8.4 Data Rules

- Email addresses must be unique per user
- Business slugs must be unique
- Deleted records should be soft-deleted when possible
- Audit trail for sensitive operations recommended

---

## 9. Assumptions and Dependencies

### 9.1 Assumptions

- Users have reliable internet connection
- Email service is available for notifications
- Clerk remains the authentication provider
- Convex remains the backend provider
- Modern browser support sufficient

### 9.2 Dependencies

- Clerk API availability (99.9% uptime)
- Convex cloud infrastructure
- Email service provider (Gmail, SendGrid, etc.)
- Third-party CDN for image hosting (optional)

---

## 10. Acceptance Criteria

All features shall be considered complete when:

1. All functional requirements implemented and tested
2. All non-functional requirements met (performance, security, etc.)
3. Code coverage >80% for critical paths
4. User acceptance testing passed
5. Security audit completed
6. Performance benchmarks met
7. Documentation complete
8. Deployment to production successful

---

## 11. Change Management

Future enhancements may include:

- Payment processing (Stripe integration)
- Automated reminders (SMS/Email)
- Review and rating system
- Recurring appointments
- Multi-location business support
- Staff scheduling optimization
- Advanced analytics and reporting
- Mobile app (iOS/Android native)
- Calendar sync (Google, Apple, Outlook)
- Waitlist functionality

---

## Appendix A: API Endpoints

### Queries (Read Operations)

- `getBusinessBySlug` - Fetch business by slug
- `getAppointmentsForBusiness` - List appointments for business
- `listServicesForBusiness` - List services for business
- `listEmployeesForBusiness` - List employees for business
- `listClientsForBusiness` - List clients for business
- `getAppointmentsByCustomerEmail` - Get customer's appointments
- `getBusinessStats` - Get business analytics

### Mutations (Write Operations)

- `createBusiness` - Create new business
- `updateBusiness` - Update business details
- `createService` - Add new service
- `updateService` - Update service details
- `deleteService` - Remove service
- `createEmployee` - Add new employee
- `updateEmployee` - Update employee details
- `deleteEmployee` - Remove employee
- `bookAppointment` - Create new appointment
- `updateAppointmentStatus` - Change appointment status
- `updateUserRole` - Admin: change user role

---

## Document Control

| Version | Date       | Author | Changes              |
| ------- | ---------- | ------ | -------------------- |
| 1.0     | 2026-03-26 | Team   | Initial SRS creation |
