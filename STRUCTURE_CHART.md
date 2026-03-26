# Smart Booking System - Structure Chart

## 1. System Architecture Overview

```mermaid
graph TB
    subgraph Client["Client Layer (Browser)"]
        Next["Next.js 15<br/>App Router"]
        React["React Components<br/>UI Layer"]
    end

    subgraph Network["Network Layer"]
        HTTPS["HTTPS/TLS<br/>Encryption"]
    end

    subgraph Auth["Authentication<br/>Clerk"]
        Clerk["Clerk Auth<br/>JWT Tokens"]
    end

    subgraph Backend["Backend Layer<br/>Convex"]
        API["Convex HTTP API"]
        Functions["Queries & Mutations"]
        DB["Convex Database<br/>Serverless DB"]
    end

    subgraph External["External Services"]
        Email["Email Service<br/>Notifications"]
        CDN["CDN<br/>Static Assets"]
    end

    Client -->|Requests| HTTPS
    HTTPS -->|HTTP Requests| API
    Client -->|Auth| Clerk
    API --> Functions
    Functions --> DB
    API -->|Response| HTTPS
    HTTPS -->|JSON| Client
    Functions -->|Send| Email
    React -->|Load| CDN
```

## 2. Frontend Architecture Structure

```mermaid
graph TD
    subgraph App["Next.js App Directory"]
        Layout["layout.tsx<br/>Root Layout"]

        subgraph Public["public/ Routes"]
            PubLayout["layout.tsx"]
            Home["page.tsx<br/>Landing"]
            Shop["shop/page.tsx<br/>All Shops"]
            ShopDetail["shop/[slug]/page.tsx<br/>Shop Detail"]
            User["user/page.tsx"]
        end

        subgraph Auth["auth/ Routes"]
            SignIn["sign-in/page.tsx"]
            SignUp["sign-up/page.tsx"]
        end

        subgraph Client["client/ Routes"]
            ClientLayout["layout.tsx"]
            Dashboard["dashboard/page.tsx"]
            Services["services/page.tsx"]
            Employees["employees/page.tsx"]
            Bookings["bookings/page.tsx"]
            Settings["settings/page.tsx"]
            Profile["profile/page.tsx"]
            Schedule["schedule/page.tsx"]
        end

        subgraph Admin["admin/ Routes"]
            AdminLayout["layout.tsx"]
            AdminDash["admin/page.tsx"]
        end
    end

    Layout --> PubLayout
    Layout --> SignIn
    Layout --> ClientLayout
    Layout --> AdminLayout

    PubLayout --> Home
    PubLayout --> Shop
    PubLayout --> ShopDetail
    PubLayout --> User
```

## 3. Component Hierarchy

```mermaid
graph TD
    subgraph Pages["Pages"]
        Home["HomePage"]
        ShopListing["ShopListingPage"]
        ShopDetail["ShopDetailPage"]
        Dashboard["DashboardPage"]
        Services["ServicesPage"]
        Employees["EmployeesPage"]
        Bookings["BookingsPage"]
    end

    subgraph Navigation["Navigation Components"]
        TopNav["TopNavbar"]
        SideNav["SideNavbar"]
        BreadCrumb["Breadcrumb"]
    end

    subgraph Booking["Booking Components"]
        BookingWidget["BookingWidget"]
        DateSelector["DateSelector"]
        TimeSelector["TimeSelector"]
        ServiceSelector["ServiceSelector"]
        EmployeeSelector["EmployeeSelector"]
    end

    subgraph Dashboard_Comp["Dashboard Components"]
        Header["Header"]
        Sidebar["Sidebar"]
        StatsCard["StatsCard"]
        Chart["Charts"]
        RecentTransactions["RecentTransactions"]
    end

    subgraph Shop["Shop Components"]
        ShopCard["ShopCard"]
        ShopBookingWidget["ShopBookingWidget"]
    end

    subgraph UI["UI Components (shadcn/ui)"]
        Button["Button"]
        Input["Input"]
        Form["Form"]
        Dialog["Dialog"]
        Table["Table"]
        Card["Card"]
        Badge["Badge"]
        Avatar["Avatar"]
    end

    Home --> TopNav
    ShopListing --> Shop
    ShopDetail --> BookingWidget
    Dashboard --> Dashboard_Comp
    Services --> UI
    Employees --> UI
    Bookings --> UI

    BookingWidget --> DateSelector
    BookingWidget --> TimeSelector
    BookingWidget --> ServiceSelector
    BookingWidget --> EmployeeSelector

    Dashboard_Comp --> Chart
    Dashboard_Comp --> StatsCard
```

## 4. Backend Structure (Convex)

```mermaid
graph TD
    subgraph Schema["Schema Definition"]
        SchemaDef["schema.ts<br/>Database Schema"]

        Users["users<br/>Authentication"]
        Businesses["businesses<br/>Shop Profile"]
        Employees["employees<br/>Staff"]
        Services["services<br/>Offerings"]
        Clients["clients<br/>Customers"]
        Appointments["appointments<br/>Bookings"]
    end

    subgraph Queries["Query Functions"]
        QAuth["getBusinessForClerk"]
        QBusiness["getBusinessById<br/>getBusinessBySlug<br/>getBusinessStats"]
        QEmployees["listEmployeesForBusiness<br/>getEmployeeById"]
        QServices["listServicesForBusiness<br/>getServiceById"]
        QClients["listClientsForBusiness"]
        QAppointments["getAppointmentsForBusiness<br/>getAppointmentsByCustomerEmail<br/>getAppointmentsByBusiness"]
        QUsers["listAllUsers"]
    end

    subgraph Mutations["Mutation Functions"]
        MBusiness["createBusiness<br/>updateBusiness"]
        MEmployees["createEmployee<br/>updateEmployee<br/>deleteEmployee"]
        MServices["createService<br/>updateService<br/>deleteService"]
        MAppointments["bookAppointment<br/>updateAppointmentStatus"]
        MAuth["updateUserRole<br/>updateUserRoleWithClerk"]
    end

    subgraph Helpers["Helper Functions"]
        RoleHelper["requireRole.ts<br/>requireAuth"]
    end

    SchemaDef --> Users
    SchemaDef --> Businesses
    SchemaDef --> Employees
    SchemaDef --> Services
    SchemaDef --> Clients
    SchemaDef --> Appointments

    QBusiness --> Businesses
    QEmployees --> Employees
    QServices --> Services
    QClients --> Clients
    QAppointments --> Appointments

    MBusiness --> Businesses
    MEmployees --> Employees
    MServices --> Services
    MAppointments --> Appointments

    MAuth --> RoleHelper
```

## 5. Data Flow Architecture

```mermaid
graph LR
    subgraph Client_Layer["Client Layer"]
        UIComp["UI Components"]
        Hooks["Custom Hooks"]
        Context["Auth Context"]
    end

    subgraph Convex_Client["Convex Client Layer"]
        ConvexClient["ConvexHttpClient<br/>convex-client.ts"]
        Generated["Generated API<br/>_generated/api.js"]
    end

    subgraph API_Layer["API Layer"]
        Queries["Query Functions"]
        Mutations["Mutation Functions"]
    end

    subgraph Validation["Validation & Auth"]
        RoleCheck["Role Checking<br/>requireRole"]
        InputVal["Input Validation<br/>Convex Values"]
    end

    subgraph Database["Database Layer"]
        DBIndex["Database Indexes"]
        DBTables["Database Tables"]
    end

    UIComp -->|useQuery/useMutation| Hooks
    Hooks -->|Call API| ConvexClient
    ConvexClient -->|Type-safe| Generated
    Generated -->|Routes to| Queries
    Generated -->|Routes to| Mutations

    Queries --> RoleCheck
    Mutations --> RoleCheck
    Mutations --> InputVal

    RoleCheck -->|Query| DBIndex
    InputVal -->|Write| DBTables
    DBIndex -->|Return| Queries
    DBTables -->|Return| Mutations
```

## 6. Frontend Module Structure

```mermaid
graph TB
    subgraph SRC["src/"]
        subgraph App["app/"]
            layout["layout.tsx"]
            groups["Route Groups<br/>(public)<br/>(client)<br/>(auth)<br/>(admin)"]
        end

        subgraph Components["components/"]
            ui["ui/<br/>Button, Input, Dialog..."]
            booking["booking/<br/>DateSelector<br/>TimeSelector"]
            dashboard["dashboard/<br/>Header, Sidebar<br/>Charts"]
            navigation["navigation/<br/>TopNavbar<br/>SideNavbar"]
            landing["landing/<br/>LandingPage"]
            shop["shop/<br/>ShopCard<br/>ShopBookingWidget"]
        end

        subgraph Lib["lib/"]
            convex["convex-client.ts"]
            auth["auth/<br/>Clerk config"]
            utils["utils.ts"]
            context["auth-context.tsx"]
        end

        subgraph Hooks["hooks/"]
            useMobile["use-mobile.ts"]
            useToast["use-toast.ts"]
        end

        subgraph Constants["constants/"]
            PATH["PATH.ts<br/>Route constants"]
        end

        subgraph Providers["providers/"]
            ConvexProvider["ConvexClientProvider.tsx"]
            ThemeProvider["ThemeProvider.tsx"]
        end
    end
```

## 7. Backend Module Structure

```mermaid
graph TB
    subgraph Convex["convex/"]
        subgraph Root["Root Files"]
            schema["schema.ts"]
            auth_config["auth.config.ts"]
            appointmentsTS["appointments.ts"]
            employeesTS["employees.ts"]
            usersTS["users.ts"]
        end

        subgraph Functions["functions/"]
            subgraph Queries["queries/"]
                q1["getBusinessById.ts"]
                q2["getBusinessBySlug.ts"]
                q3["listServicesForBusiness.ts"]
                q4["listEmployeesForBusiness.ts"]
                q5["getAppointmentsForBusiness.ts"]
                q6["listClientsForBusiness.ts"]
                q7["getAppointmentsByCustomerEmail.ts"]
                q8["getBusinessStats.ts"]
                q9["listAllUsers.ts"]
            end

            subgraph Mutations["mutations/"]
                m1["createBusiness.ts"]
                m2["updateBusiness.ts"]
                m3["createService.ts"]
                m4["updateService.ts"]
                m5["deleteService.ts"]
                m6["createEmployee.ts"]
                m7["updateEmployee.ts"]
                m8["deleteEmployee.ts"]
                m9["bookAppointment.ts"]
                m10["updateAppointmentStatus.ts"]
                m11["updateUserRole.ts"]
                m12["updateUserRoleWithClerk.ts"]
            end

            subgraph Helpers["helpers/"]
                requireRole["requireRole.ts"]
            end
        end

        subgraph Generated["_generated/"]
            api_d["api.d.ts"]
            api_js["api.js"]
            server_d["server.d.ts"]
            server_js["server.js"]
            dataModel["dataModel.d.ts"]
        end

        subgraph Lib_Backend["lib/"]
            roles["roles.ts"]
            clerk["auth/clerk.ts"]
        end
    end
```

## 8. Request/Response Flow

### 8.1 Authentication Flow

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant Clerk
    participant Convex
    participant Database

    User->>Browser: Opens App
    Browser->>Clerk: Check Session
    Clerk-->>Browser: JWT Token (if logged in)
    Browser->>Convex: Request with JWT
    Convex->>Convex: Verify JWT & Extract Identity
    Convex->>Database: Query with User Context
    Database-->>Convex: Data
    Convex-->>Browser: Response
    Browser-->>User: Render Page
```

### 8.2 Booking Flow

```mermaid
sequenceDiagram
    actor Customer
    participant Frontend
    participant Convex
    participant Database
    participant Email

    Customer->>Frontend: Browse & Select Service
    Frontend->>Convex: checkAvailability(date, employee)
    Convex->>Database: Query by_date_employee Index
    Database-->>Convex: Available Slots
    Convex-->>Frontend: Show Available Times
    Customer->>Frontend: Confirm Booking
    Frontend->>Convex: bookAppointment(details)
    Convex->>Database: Create Appointment Record
    Convex->>Email: Send Confirmation Email
    Email-->>Customer: Confirmation Email
    Convex-->>Frontend: Success Response
    Frontend-->>Customer: Show Confirmation Page
```

### 8.3 Service Management Flow

```mermaid
sequenceDiagram
    actor Owner
    participant Frontend
    participant Convex
    participant Database

    Owner->>Frontend: Login to Dashboard
    Frontend->>Convex: getBusinessForClerk()
    Convex->>Database: Query User's Business
    Database-->>Convex: Business Data
    Convex-->>Frontend: Display Dashboard
    Owner->>Frontend: Click "Add Service"
    Owner->>Frontend: Fill Service Form
    Frontend->>Convex: createService(serviceData)
    Convex->>Convex: Validate Input (requireRole)
    Convex->>Database: Insert New Service
    Database-->>Convex: Service Created
    Convex-->>Frontend: Success Response
    Frontend->>Frontend: Update Service List (Real-time)
    Frontend-->>Owner: Show Success Toast
```

## 9. Database Schema Relationship

```mermaid
erDiagram
    USERS ||--o{ BUSINESSES : owns
    USERS ||--o{ CLIENTS : "registers-as"
    BUSINESSES ||--o{ EMPLOYEES : contains
    BUSINESSES ||--o{ SERVICES : offers
    BUSINESSES ||--o{ CLIENTS : "has"
    BUSINESSES ||--o{ APPOINTMENTS : hosts
    EMPLOYEES ||--o{ APPOINTMENTS : "booked-for"
    SERVICES ||--o{ APPOINTMENTS : "scheduled-for"
    CLIENTS ||--o{ APPOINTMENTS : "makes"
```

## 10. File Organization Summary

```
smart-booking-system/
├── src/
│   ├── app/
│   │   ├── (public)/          # Public routes (/, /shop/*, /user/*)
│   │   ├── (client)/          # Client routes (/client/*)
│   │   ├── (admin)/           # Admin routes (/admin/*)
│   │   ├── (auth)/            # Auth routes (/sign-in, /sign-up)
│   │   └── api/               # API routes
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── booking/           # Booking widgets
│   │   ├── dashboard/         # Dashboard components
│   │   ├── navigation/        # Nav components
│   │   ├── landing/           # Landing page
│   │   └── shop/              # Shop components
│   ├── lib/
│   │   ├── convex-client.ts   # Convex client instance
│   │   ├── auth-context.tsx   # Auth context
│   │   ├── utils.ts           # Utilities
│   │   └── auth/              # Auth helpers
│   ├── hooks/                 # Custom React hooks
│   ├── constants/             # Constants (paths, etc)
│   ├── providers/             # Context providers
│   └── middleware.ts          # Route protection
├── convex/
│   ├── schema.ts              # Database schema definition
│   ├── auth.config.ts         # Clerk config
│   ├── functions/
│   │   ├── queries/           # Read operations
│   │   ├── mutations/         # Write operations
│   │   └── helpers/           # Helper functions
│   ├── lib/                   # Backend utilities
│   └── _generated/            # Auto-generated types
├── public/                    # Static assets
└── package.json               # Dependencies
```

## 11. Technology Stack Structure

```mermaid
graph TB
    subgraph Deployment["Deployment"]
        Vercel["Vercel<br/>Frontend Hosting"]
        ConvexCloud["Convex Cloud<br/>Backend"]
        ClerkCloud["Clerk Cloud<br/>Auth"]
    end

    subgraph Frontend_Stack["Frontend Stack"]
        NextJS["Next.js 15<br/>App Router"]
        React["React 18+<br/>UI Library"]
        TS["TypeScript<br/>Type Safety"]
        Tailwind["Tailwind CSS<br/>Styling"]
        ShadCN["shadcn/ui<br/>Components"]
        Lucide["Lucide Icons<br/>Icon Set"]
    end

    subgraph Backend_Stack["Backend Stack"]
        Convex_Tech["Convex<br/>Serverless DB"]
        Node["Node.js<br/>Runtime"]
        TypeScript_B["TypeScript<br/>Type Safety"]
    end

    subgraph Infrastructure["Infrastructure"]
        Network["HTTPS/TLS<br/>Encryption"]
        CDN["Vercel CDN<br/>Static Files"]
        Email_Service["Email Service<br/>Notifications"]
    end

    subgraph Dev_Tools["Development Tools"]
        ESLint["ESLint<br/>Code Quality"]
        TS_Check["TypeScript<br/>Type Checking"]
        PostCSS["PostCSS<br/>CSS Processing"]
    end
```

## 12. Component Dependencies

```mermaid
graph TD
    App["App (Root)"]

    App --> Providers["Providers"]
    Providers --> ConvexProvider["ConvexClientProvider"]
    Providers --> ThemeProvider["ThemeProvider"]

    App --> Middleware["Middleware<br/>Route Protection"]

    App --> Layout["RootLayout"]
    Layout --> Navigation["Navigation Components"]
    Layout --> Pages["Page Components"]

    Pages --> Public["Public Pages"]
    Pages --> Client["Client Pages"]
    Pages --> Admin["Admin Pages"]
    Pages --> Auth["Auth Pages"]

    Public --> BookingWidgets["Booking Widgets"]
    Client --> DashboardComp["Dashboard Components"]
    Client --> ManagementComp["Management Components"]

    BookingWidgets --> UIComp["UI Components"]
    DashboardComp --> UIComp
    ManagementComp --> UIComp

    UIComp --> ShadCN["shadcn/ui Library"]

    Navigation --> Hooks["Custom Hooks<br/>useAuth<br/>useMobile<br/>useToast"]
    Pages --> ConvexClient["ConvexHttpClient<br/>useQuery<br/>useMutation"]
```

---

This comprehensive structure chart provides a complete overview of the Smart Booking System's organization, from high-level architecture down to individual file locations and component relationships.
