"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Eye, Edit, Trash2, UserPlus, Shield, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { UserManagementSheet } from "@/components/user-management-sheet"
import { useToast } from "@/hooks/use-toast"

// Mock users data
const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "ADMIN" as const,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
    totalTodos: 12,
    completedTodos: 8,
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "USER" as const,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-05"),
    totalTodos: 5,
    completedTodos: 3,
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    role: "USER" as const,
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-02-15"),
    totalTodos: 8,
    completedTodos: 6,
  },
  {
    id: "4",
    name: "Alice Brown",
    email: "alice.brown@example.com",
    role: "USER" as const,
    createdAt: new Date("2024-02-20"),
    updatedAt: new Date("2024-02-25"),
    totalTodos: 15,
    completedTodos: 10,
  },
]

type UserType = {
  id: string
  name: string
  email: string
  role: "ADMIN" | "USER"
  createdAt: Date
  updatedAt: Date
  totalTodos: number
  completedTodos: number
}

type SheetAction = "view" | "edit" | "delete" | "add" | null

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserType[]>(mockUsers)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [sheetAction, setSheetAction] = useState<SheetAction>(null)
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null)
  const { toast } = useToast()

  // Check if current user is admin (mock)
  const currentUserRole = "ADMIN"
  const isAdmin = currentUserRole === "ADMIN"

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md border-border">
          <CardHeader className="text-center">
            <CardTitle className="text-foreground">Access Denied</CardTitle>
            <CardDescription className="text-muted-foreground">
              You don't have permission to access this page
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const adminCount = users.filter((user) => user.role === "ADMIN").length
  const userCount = users.filter((user) => user.role === "USER").length

  const handleAction = (action: SheetAction, user?: UserType) => {
    setSheetAction(action)
    setSelectedUser(user || null)
    setSheetOpen(true)
  }

  const handleDeleteUser = (userId: string) => {
    const user = users.find((u) => u.id === userId)
    setUsers(users.filter((user) => user.id !== userId))
    setSheetOpen(false)

    toast({
      variant: "destructive",
      title: "User deleted",
      description: `"${user?.name}" has been permanently deleted from the system.`,
    })
  }

  const handleUpdateUser = (userId: string, name: string, email: string, role: "ADMIN" | "USER") => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, name, email, role, updatedAt: new Date() } : user)))
    setSheetOpen(false)

    toast({
      variant: "success",
      title: "User updated",
      description: "User information has been successfully updated.",
    })
  }

  const handleAddUser = (name: string, email: string, role: "ADMIN" | "USER") => {
    const newUser: UserType = {
      id: Date.now().toString(),
      name,
      email,
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      totalTodos: 0,
      completedTodos: 0,
    }
    setUsers([...users, newUser])
    setSheetOpen(false)

    toast({
      variant: "success",
      title: "User created",
      description: `"${name}" has been successfully added to the system.`,
    })
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
              <CardTitle className="text-lg font-medium text-foreground">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-semibold text-foreground">{users.length}</div>
            </CardContent>
          </Card>

          <Card className="border-border transition-all duration-200 hover:shadow-md animate-in fade-in-0 slide-in-from-bottom-5 duration-500 delay-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium text-foreground">Administrators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-semibold text-blue-600 dark:text-blue-400">{adminCount}</div>
            </CardContent>
          </Card>

          <Card className="border-border transition-all duration-200 hover:shadow-md animate-in fade-in-0 slide-in-from-bottom-5 duration-500 delay-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium text-foreground">Regular Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-semibold text-green-600 dark:text-green-400">{userCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Users List */}
        <Card className="border-border transition-colors duration-200 animate-in fade-in-0 slide-in-from-bottom-5 duration-500 delay-400">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-foreground">Users</CardTitle>
            <CardDescription className="text-muted-foreground">Manage user accounts and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {users.map((user, index) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-all duration-200 group animate-in fade-in-0 slide-in-from-left-5"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                        user.role === "ADMIN" ? "bg-blue-500" : "bg-green-500"
                      }`}
                    >
                      {user.role === "ADMIN" ? <Shield className="h-5 w-5" /> : <User className="h-5 w-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground truncate">{user.name}</span>
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
                      <div className="text-sm text-muted-foreground truncate">{user.email}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {user.completedTodos}/{user.totalTodos} todos completed
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAction("view", user)}
                      className="h-8 w-8 p-0 hover:bg-accent transition-colors duration-200"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAction("edit", user)}
                      className="h-8 w-8 p-0 hover:bg-accent transition-colors duration-200"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAction("delete", user)}
                      className="h-8 w-8 p-0 hover:bg-red-50 dark:hover:bg-red-950 text-red-600 dark:text-red-400 transition-colors duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {users.length === 0 && (
                <div className="text-center py-12 animate-in fade-in-0 duration-500">
                  <div className="text-muted-foreground mb-2">No users found</div>
                  <div className="text-sm text-muted-foreground">Add your first user to get started</div>
                </div>
              )}
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
  )
}
