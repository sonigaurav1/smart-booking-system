"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface User {
  _id: string;
  _creationTime?: number;
  clerkId: string;
  email: string;
  name: string;
  role: "admin" | "client" | "user";
  createdAt: number;
}

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

export default function AdminClientsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filterRole, setFilterRole] = useState<
    "all" | "admin" | "client" | "user"
  >("all");
  const { toast } = useToast();

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      // Call using HTTP directly
      const response = await fetch(`${CONVEX_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: "functions/queries/listAllUsers",
          args: {},
        }),
      });
      const result = await response.json();
      setUsers(result.data || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Filter users based on role
  useEffect(() => {
    if (filterRole === "all") {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(users.filter((u) => u.role === filterRole));
    }
  }, [users, filterRole]);

  // Update user role
  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      setUpdatingId(userId);
      const response = await fetch(`${CONVEX_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: "functions/mutations/updateUserRoleWithClerk",
          args: {
            userId,
            role: newRole as "admin" | "client" | "user",
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update role");
      }

      // Update local state
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId
            ? { ...u, role: newRole as "admin" | "client" | "user" }
            : u,
        ),
      );

      toast({
        title: "Success",
        description: `User role updated to ${newRole}`,
      });
    } catch (error) {
      console.error("Failed to update role:", error);
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Manage Clients & Users
        </h1>
        <p className="text-muted-foreground mt-2">
          View and manage user accounts, assign roles, and control access.
        </p>
      </div>

      {/* Filter by role */}
      <div className="flex gap-2 items-center">
        <label className="text-sm font-medium">Filter by role:</label>
        <Select
          value={filterRole}
          onValueChange={(value) =>
            setFilterRole(value as "all" | "admin" | "client" | "user")
          }
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="client">Client</SelectItem>
            <SelectItem value="user">User</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground ml-auto">
          {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Users table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Current Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user._id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        user.role === "admin"
                          ? "bg-red-100 text-red-800"
                          : user.role === "client"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={user.role}
                      onValueChange={(newRole) =>
                        handleRoleChange(user._id, newRole)
                      }
                      disabled={updatingId === user._id}
                    >
                      <SelectTrigger className="w-32">
                        {updatingId === user._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <SelectValue />
                        )}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="client">Client</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-8">
        <div className="border rounded-lg p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Total Users
          </div>
          <div className="text-3xl font-bold mt-2">{users.length}</div>
        </div>
        <div className="border rounded-lg p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Admins
          </div>
          <div className="text-3xl font-bold mt-2">
            {users.filter((u) => u.role === "admin").length}
          </div>
        </div>
        <div className="border rounded-lg p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Clients
          </div>
          <div className="text-3xl font-bold mt-2">
            {users.filter((u) => u.role === "client").length}
          </div>
        </div>
      </div>
    </div>
  );
}
