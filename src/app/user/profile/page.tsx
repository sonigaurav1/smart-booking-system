
// User don't have to login to view this page, but they can view and edit their profile here
// User can book services, view their bookings, and manage their account settings without logging in
// Use cookies or local storage to keep track of user preferences and bookings

export default function UserProfilePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Your Profile</h1>
      <p className="text-muted-foreground">
        Update your personal details and preferences.
      </p>
    </div>
  );
}
