# Smart Booking System - Process Flowcharts

## User Authentication & Onboarding Flow

```mermaid
flowchart TD
    A[User Visits App] --> B{User Logged In?}
    B -->|No| C[Sign In / Sign Up]
    C --> D[Clerk Authentication]
    D --> E[User Role Assignment]
    E --> F{User Role?}
    B -->|Yes| F
    F -->|Admin| G[Admin Dashboard]
    F -->|Client| H{Has Business?}
    H -->|Yes| I[Business Dashboard]
    H -->|No| J[Create Business]
    J --> K[Add Business Details]
    K --> L[Setup Services]
    L --> M[Add Employees]
    M --> I
```

## Client Appointment Booking Flow

```mermaid
flowchart TD
    A[Client Browses Shop] --> B[Select Service]
    B --> C[Choose Employee]
    C --> D[Select Date]
    D --> E{Check Availability}
    E -->|Not Available| F[Try Another Date/Time]
    F --> D
    E -->|Available| G[Select Time Slot]
    G --> H[Add Client Details]
    H --> I{Submit Booking?}
    I -->|Cancel| J[Back to Shop]
    I -->|Confirm| K[Create Appointment]
    K --> L[Appointment Status: Pending]
    L --> M[Send Confirmation Email]
    M --> N[Show Booking Confirmation]
```

## Business Owner Management Flow

```mermaid
flowchart TD
    A[Business Owner Login] --> B[Access Business Dashboard]
    B --> C{Action?}
    C -->|Manage Services| D[View All Services]
    D --> E{Service Action?}
    E -->|Create| F[Add New Service]
    E -->|Edit| G[Update Service Details]
    E -->|Delete| H[Remove Service]
    C -->|Manage Employees| I[View All Employees]
    I --> J{Employee Action?}
    J -->|Create| K[Add New Employee]
    J -->|Edit| L[Update Employee Info]
    J -->|Delete| M[Remove Employee]
    C -->|View Appointments| N[See All Appointments]
    N --> O{Appointment Action?}
    O -->|Confirm| P[Update Status to Confirmed]
    O -->|Mark Done| Q[Update Status to Done]
    O -->|Cancel| R[Update Status to Cancelled]
    C -->|Manage Clients| S[View Client List]
    S --> T[Add/Update Client Info]
```

## Appointment Status Lifecycle

```mermaid
flowchart TD
    A[Appointment Created] --> B[Status: Pending]
    B --> C{Business Owner Action?}
    C -->|Confirm Booking| D[Status: Confirmed]
    C -->|Cancel| E[Status: Cancelled]
    D --> F{Appointment Time Reached?}
    F -->|Yes| G[Status: Done]
    F -->|No| H[Awaiting Appointment]
    H --> C
    E --> I[Appointment Cancelled]
    G --> J[Appointment Completed]
```

## Data Flow for Booking

```mermaid
flowchart LR
    A[Client Submits Booking] --> B[Frontend Validation]
    B --> C[Check Availability<br/>by_date_employee Index]
    C --> D{Slot Available?}
    D -->|No| E[Show Error]
    D -->|Yes| F[Create Appointment Record]
    F --> G[Update Appointment Status]
    G --> H[Send Email Notification]
    H --> I[Return Confirmation]
    I --> J[Client Sees Confirmation Page]
```

## Admin User Management Flow

```mermaid
flowchart TD
    A[Admin Dashboard] --> B{Admin Action?}
    B -->|View All Users| C[List All Users]
    C --> D{Modify Role?}
    D -->|Make Admin| E[Update User Role to Admin]
    D -->|Make Client| F[Update User Role to Client]
    B -->|View Businesses| G[View All Businesses]
    G --> H{Business Action?}
    H -->|Edit| I[Update Business Info]
    H -->|Delete| J[Remove Business]
    B -->|View Statistics| K[View System Stats]
    K --> L[Total Users, Businesses, Appointments]
```
