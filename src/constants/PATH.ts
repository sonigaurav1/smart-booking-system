// Centralized route constants for the Smart Booking System
// Prefer using these to avoid hardcoding paths across components

export const PATH = {
    // Landing and Public Info
    home: "/",
    about: "/about",
    contact: "/contact",
    help: "/help",

    // Booking
    book: "/book",
    bookingConfirmation: (bookingId?: string) =>
        bookingId ? `/booking/confirmation?bookingId=${encodeURIComponent(bookingId)}` : "/booking/confirmation",

    // User (people who book)
    user: {
        root: "/user",
        dashboard: "/user/dashboard",
        profile: "/user/profile",
    },

    // Client (shop owners / service providers)
    client: {
        root: "/client",
        dashboard: "/client/dashboard",
        bookings: "/client/bookings",
        appointments: "/client/appointments",
        calendar: "/client/calendar",
        services: "/client/services",
        schedule: "/client/schedule",
        employees: "/client/employees",
        profile: "/client/profile",
        settings: "/client/settings",
        // Auth endpoints for client area
        login: "/client/login",
        signup: "/client/signup",
        signIn: "/client/sign-in",
    },

    // Admin
    admin: {
        root: "/admin",
        dashboard: "/admin/dashboard",
        users: "/admin/users",
        clients: "/admin/clients",
        bookings: "/admin/bookings",
        signIn: "/admin/sign-in",
    },

    // Auth (public)
    auth: {
        login: "/login",
        signup: "/signup",
    },

    // Public shop pages
    shop: (shopId: string) => `/shop/${encodeURIComponent(shopId)}`,
    shopAll: "/shop/all",
    shopBySlug: (slug: string) => `/shop/${encodeURIComponent(slug)}`,
} as const

export type PathValue = typeof PATH

