# Admin Client Management Guide

## Overview

The Admin Dashboard now includes a comprehensive **Client Management** page where admins can:

- View all users in the system
- Filter users by role (Admin, Client, User)
- Change user roles directly
- See user stats and creation dates

## How to Use

### Accessing the Page

1. Sign in as an admin
2. Go to `/admin/dashboard`
3. Click "Manage Clients" or navigate to `/admin/clients`

### Managing User Roles

#### What Each Role Does:

- **Admin**: Full access to admin dashboard, can manage all users, businesses, and system settings
- **Client**: Can create businesses, manage employees, services, and bookings
- **User**: Can only book appointments through the public booking system

#### How to Assign Roles:

1. On the Clients management page, find the user in the table
2. Click the dropdown under "Actions" column
3. Select the new role (Admin, Client, or User)
4. The role is updated immediately - the user will need to refresh/re-login to see the change

### Understanding the Page

**Top Section:**

- Filter dropdown: Filter users by role
- User count: Shows how many users match the current filter

**Main Table:**

- **Name**: User's full name
- **Email**: User's email address
- **Current Role**: Color-coded role badge
- **Joined**: Date the user account was created
- **Actions**: Dropdown to change role

**Stats Section (Bottom):**

- **Total Users**: Total count of all users
- **Admins**: Count of admin accounts
- **Clients**: Count of client accounts

## For New User Signups

When a new user signs up:

1. They are automatically assigned the **Client** role
2. If they need to be an Admin, use this page to upgrade them
3. After role change, they should sign out and sign back in for the change to take effect

## Troubleshooting

### User Still Getting "Access Denied"

- ✅ Make sure their role shows as "Client" in the table
- ✅ Have them sign out and sign back in
- ✅ Check that CLERK_SECRET_KEY is set in environment variables

### Role Change Not Working

- Check browser console for errors
- Ensure you're an admin user
- Verify CLERK_SECRET_KEY is configured correctly
