"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Shield, LucideUser } from "lucide-react"

type User = {
  id: string
  name: string
  email: string
  role: "ADMIN" | "USER"
  createdAt: Date
  updatedAt: Date
  totalTodos: number
  completedTodos: number
}

type UserManagementSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  action: "view" | "edit" | "delete" | "add" | null
  user: User | null
  onDelete: (userId: string) => void
  onUpdate: (userId: string, name: string, email: string, role: "ADMIN" | "USER") => void
  onAdd: (name: string, email: string, role: "ADMIN" | "USER") => void
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
  const [editName, setEditName] = useState("")
  const [editEmail, setEditEmail] = useState("")
  const [editRole, setEditRole] = useState<"ADMIN" | "USER">("USER")

  useEffect(() => {
    if (user && (action === "edit" || action === "view")) {
      setEditName(user.name)
      setEditEmail(user.email)
      setEditRole(user.role)
    } else if (action === "add") {
      setEditName("")
      setEditEmail("")
      setEditRole("USER")
    }
  }, [user, action])

  if (!action) return null

  const handleSubmit = () => {
    if (!editName.trim() || !editEmail.trim()) return

    if (action === "add") {
      onAdd(editName.trim(), editEmail.trim(), editRole)
    } else if (action === "edit" && user) {
      onUpdate(user.id, editName.trim(), editEmail.trim(), editRole)
    }
  }

  const handleDelete = () => {
    if (user) {
      onDelete(user.id)
    }
  }

  const getSheetTitle = () => {
    switch (action) {
      case "view":
        return "View User"
      case "edit":
        return "Edit User"
      case "delete":
        return "Delete User"
      case "add":
        return "Add New User"
      default:
        return "User"
    }
  }

  const getSheetDescription = () => {
    switch (action) {
      case "view":
        return "View user details and information"
      case "edit":
        return "Make changes to user information"
      case "delete":
        return "This action cannot be undone"
      case "add":
        return "Create a new user account"
      default:
        return ""
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-background border-l border-border transition-colors duration-200">
        <SheetHeader>
          <SheetTitle className="text-foreground">{getSheetTitle()}</SheetTitle>
          <SheetDescription className="text-muted-foreground">{getSheetDescription()}</SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {action === "view" && user && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${
                    user.role === "ADMIN" ? "bg-blue-500" : "bg-green-500"
                  }`}
                >
                  {user.role === "ADMIN" ? <Shield className="h-6 w-6" /> : <LucideUser className="h-6 w-6" />}
                </div>
                <div>
                  <div className="font-semibold text-foreground">{user.name}</div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                </div>
              </div>

              <div>
                <Label className="text-foreground font-medium">Role</Label>
                <div className="mt-1">
                  <Badge
                    variant={user.role === "ADMIN" ? "default" : "secondary"}
                    className={
                      user.role === "ADMIN"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                        : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                    }
                  >
                    {user.role}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-foreground font-medium">Total Todos</Label>
                  <div className="mt-1 text-2xl font-semibold text-foreground">{user.totalTodos}</div>
                </div>
                <div>
                  <Label className="text-foreground font-medium">Completed</Label>
                  <div className="mt-1 text-2xl font-semibold text-green-600 dark:text-green-400">
                    {user.completedTodos}
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-foreground font-medium">Member Since</Label>
                <div className="mt-1 text-muted-foreground">
                  {user.createdAt.toLocaleDateString()} at {user.createdAt.toLocaleTimeString()}
                </div>
              </div>

              <div>
                <Label className="text-foreground font-medium">Last Updated</Label>
                <div className="mt-1 text-muted-foreground">
                  {user.updatedAt.toLocaleDateString()} at {user.updatedAt.toLocaleTimeString()}
                </div>
              </div>
            </div>
          )}

          {(action === "edit" || action === "add") && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="user-name" className="text-foreground font-medium">
                  Name *
                </Label>
                <Input
                  id="user-name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="mt-1 border-border focus:border-ring focus:ring-ring transition-colors duration-200"
                  placeholder="Enter user name"
                />
              </div>

              <div>
                <Label htmlFor="user-email" className="text-foreground font-medium">
                  Email *
                </Label>
                <Input
                  id="user-email"
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="mt-1 border-border focus:border-ring focus:ring-ring transition-colors duration-200"
                  placeholder="Enter user email"
                />
              </div>

              <div>
                <Label htmlFor="user-role" className="text-foreground font-medium">
                  Role *
                </Label>
                <Select value={editRole} onValueChange={(value: "ADMIN" | "USER") => setEditRole(value)}>
                  <SelectTrigger className="mt-1 border-border focus:border-ring focus:ring-ring transition-colors duration-200">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">User</SelectItem>
                    <SelectItem value="ADMIN">Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {action === "add" && (
                <div className="p-4 bg-muted rounded-md">
                  <div className="text-sm text-muted-foreground">
                    <strong>Note:</strong> The user will need to set their password on first login.
                  </div>
                </div>
              )}
            </div>
          )}

          {action === "delete" && user && (
            <div className="space-y-4">
              <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md">
                <div className="text-red-800 dark:text-red-200 font-medium">Are you sure?</div>
                <div className="text-red-600 dark:text-red-400 text-sm mt-1">
                  This will permanently delete the user "{user.name}" and all their data. This action cannot be undone.
                </div>
              </div>
            </div>
          )}
        </div>

        <SheetFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-border text-foreground hover:bg-accent transition-colors duration-200"
          >
            Cancel
          </Button>

          {(action === "edit" || action === "add") && (
            <Button
              onClick={handleSubmit}
              className="bg-primary hover:bg-primary/90 text-primary-foreground transition-colors duration-200"
              disabled={!editName.trim() || !editEmail.trim()}
            >
              {action === "add" ? "Add User" : "Save Changes"}
            </Button>
          )}

          {action === "delete" && (
            <Button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white transition-colors duration-200"
            >
              Delete User
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
