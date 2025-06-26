"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Eye, Edit, Trash2, UserPlus, Shield, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { UserManagementSheet } from "@/components/user-management-sheet";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { ProtectedRoute } from "@/components/protected-route";
import { authAPI, User as UserType } from "@/lib/auth";

type SheetAction = "view" | "edit" | "delete" | "add" | null;

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetAction, setSheetAction] = useState<SheetAction>(null);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user: currentUser } = useAuth();

  // Check if current user is admin
  const isAdmin = currentUser?.role === "ADMIN";

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
    }
  }, [isAdmin]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const response = await authAPI.listUsers();
      setUsers(response.data || []);
    } catch (error) {
      console.error("Failed to load users:", error);
      toast({
        variant: "destructive",
        title: "Failed to load users",
        description: "Unable to fetch user data. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <ProtectedRoute requireAdmin>
        <div></div>
      </ProtectedRoute>
    );
  }

  const adminCount = users.filter((user) => user.role === "ADMIN").length;
  const userCount = users.filter((user) => user.role === "USER").length;

  const handleAction = (action: SheetAction, user?: UserType) => {
    setSheetAction(action);
    setSelectedUser(user || null);
    setSheetOpen(true);
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const user = users.find((u) => u.id === userId);
      await authAPI.deleteUser(userId);
      setUsers(users.filter((user) => user.id !== userId));
      setSheetOpen(false);

      toast({
        variant: "destructive",
        title: "User deleted",
        description: `"${
          user?.name || user?.email
        }" has been permanently deleted from the system.`,
      });
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: "Failed to delete user. Please try again.",
      });
    }
  };

  const handleUpdateUser = async (
    userId: string,
    name: string,
    email: string,
    role: "ADMIN" | "USER"
  ) => {
    try {
      const updatedUser = await authAPI.updateUser(userId, {
        name,
        email,
        role,
      });
      setUsers(users.map((user) => (user.id === userId ? updatedUser : user)));
      setSheetOpen(false);

      toast({
        variant: "success",
        title: "User updated",
        description: "User information has been successfully updated.",
      });
    } catch (error) {
      console.error("Failed to update user:", error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Failed to update user. Please try again.",
      });
    }
  };

  const handleAddUser = async (
    name: string,
    email: string,
    role: "ADMIN" | "USER"
  ) => {
    try {
      // Note: The backend doesn't have a direct create user endpoint for admins
      // This would need to be implemented in the backend
      toast({
        variant: "destructive",
        title: "Not implemented",
        description:
          "User creation by admin is not yet implemented in the backend.",
      });
      setSheetOpen(false);
    } catch (error) {
      console.error("Failed to create user:", error);
      toast({
        variant: "destructive",
        title: "Create failed",
        description: "Failed to create user. Please try again.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md border-border">
          <CardContent className="flex items-center justify-center p-8">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="text-muted-foreground">Loading users...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-200">
      <div className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground animate-in fade-in-0 slide-in-from-left-5 duration-500">
              User Management
            </h1>
          </div>
          <Button
            onClick={() => handleAction("add")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          <Card className="border-border transition-all duration-200 hover:shadow-md animate-in fade-in-0 slide-in-from-bottom-5 duration-500 delay-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium text-foreground">
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-semibold text-foreground">
                {users.length}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border transition-all duration-200 hover:shadow-md animate-in fade-in-0 slide-in-from-bottom-5 duration-500 delay-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium text-foreground">
                Administrators
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-semibold text-blue-600 dark:text-blue-400">
                {adminCount}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border transition-all duration-200 hover:shadow-md animate-in fade-in-0 slide-in-from-bottom-5 duration-500 delay-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium text-foreground">
                Regular Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-semibold text-green-600 dark:text-green-400">
                {userCount}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users List */}
        <Card className="border-border transition-colors duration-200 animate-in fade-in-0 slide-in-from-bottom-5 duration-500 delay-400">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-foreground">
              Users
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Manage user accounts and permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                      {user.role === "ADMIN" ? (
                        <Shield className="h-5 w-5 text-primary" />
                      ) : (
                        <User className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">
                        {user.name || "No name"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant={
                            user.role === "ADMIN" ? "default" : "secondary"
                          }
                          className="text-xs"
                        >
                          {user.role}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Joined {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleAction("view", user)}
                      className="h-8 w-8 hover:bg-accent"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleAction("edit", user)}
                      className="h-8 w-8 hover:bg-accent"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleAction("delete", user)}
                      className="h-8 w-8 hover:bg-accent text-red-600 dark:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <UserManagementSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        action={sheetAction}
        user={selectedUser}
        onDelete={handleDeleteUser}
        onUpdate={handleUpdateUser}
        onAdd={handleAddUser}
      />
    </div>
  );
}
