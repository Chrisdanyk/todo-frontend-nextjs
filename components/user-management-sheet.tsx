"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { User as UserType } from "@/lib/auth";

type SheetAction = "view" | "edit" | "delete" | "add" | null;

interface UserManagementSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: SheetAction;
  user: UserType | null;
  onDelete: (userId: string) => void;
  onUpdate: (
    userId: string,
    name: string,
    email: string,
    role: "ADMIN" | "USER"
  ) => void;
  onAdd: (name: string, email: string, role: "ADMIN" | "USER") => void;
}

export function UserManagementSheet({
  open,
  onOpenChange,
  action,
  user,
  onDelete,
  onUpdate,
  onAdd,
}: UserManagementSheetProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"ADMIN" | "USER">("USER");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    if (user && (action === "edit" || action === "view")) {
      setName(user.name || "");
      setEmail(user.email);
      setRole(user.role);
    } else if (action === "add") {
      setName("");
      setEmail("");
      setRole("USER");
    }
  }, [user, action]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (action === "edit" && user) {
      onUpdate(user.id, name, email, role);
    } else if (action === "add") {
      onAdd(name, email, role);
    }
  };

  const handleDelete = () => {
    if (user) {
      onDelete(user.id);
      setShowDeleteDialog(false);
    }
  };

  const getTitle = () => {
    switch (action) {
      case "view":
        return "View User";
      case "edit":
        return "Edit User";
      case "delete":
        return "Delete User";
      case "add":
        return "Add User";
      default:
        return "";
    }
  };

  const getDescription = () => {
    switch (action) {
      case "view":
        return "View user details and information";
      case "edit":
        return "Update user information and permissions";
      case "delete":
        return "Permanently delete this user from the system";
      case "add":
        return "Create a new user account";
      default:
        return "";
    }
  };

  if (action === "delete") {
    return (
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              user{" "}
              <span className="font-semibold">{user?.name || user?.email}</span>{" "}
              and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{getTitle()}</SheetTitle>
          <SheetDescription>{getDescription()}</SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          {action === "view" && user ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Name
                </Label>
                <p className="text-foreground">
                  {user.name || "No name provided"}
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Email
                </Label>
                <p className="text-foreground">{user.email}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Role
                </Label>
                <Badge
                  variant={user.role === "ADMIN" ? "default" : "secondary"}
                >
                  {user.role}
                </Badge>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Created
                </Label>
                <p className="text-foreground">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Last Updated
                </Label>
                <p className="text-foreground">
                  {new Date(user.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter user name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter user email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={role}
                  onValueChange={(value: "ADMIN" | "USER") => setRole(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">User</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {action === "edit" ? "Update User" : "Create User"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
