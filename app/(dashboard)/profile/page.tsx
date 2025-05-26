"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Edit, Save, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock user data - replace with actual data fetching
const mockUser = {
  id: "user-1",
  name: "John Doe",
  email: "john.doe@example.com",
  role: "USER" as const,
  createdAt: new Date("2024-01-15"),
  updatedAt: new Date("2024-01-20"),
  totalTodos: 12,
  completedTodos: 8,
  pendingTodos: 4,
}

export default function ProfilePage() {
  const [user, setUser] = useState(mockUser)
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(user.name)
  const [editEmail, setEditEmail] = useState(user.email)
  const { toast } = useToast()

  const handleSave = () => {
    setUser({
      ...user,
      name: editName,
      email: editEmail,
      updatedAt: new Date(),
    })
    setIsEditing(false)

    toast({
      variant: "success",
      title: "Profile updated",
      description: "Your profile information has been successfully updated.",
    })
  }

  const handleCancel = () => {
    setEditName(user.name)
    setEditEmail(user.email)
    setIsEditing(false)

    toast({
      title: "Changes cancelled",
      description: "Your profile changes have been discarded.",
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-200">
      <div className="p-4 md:p-6">
        <div className="flex items-center gap-4 mb-6 md:mb-8">
          <SidebarTrigger />
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground animate-in fade-in-0 slide-in-from-left-5 duration-500">
            Profile
          </h1>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Header */}
          <Card className="border-border transition-all duration-200 hover:shadow-md animate-in fade-in-0 slide-in-from-bottom-5 duration-500">
            <CardHeader className="p-4 md:p-6">
              <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  <Avatar className="h-16 w-16 md:h-20 md:w-20">
                    <AvatarImage src="/placeholder.svg?height=80&width=80" />
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg md:text-xl font-semibold">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center sm:text-left">
                    <CardTitle className="text-xl md:text-2xl font-semibold text-foreground">{user.name}</CardTitle>
                    <CardDescription className="text-muted-foreground break-all">{user.email}</CardDescription>
                    <Badge variant="secondary" className="mt-2 bg-muted text-muted-foreground">
                      {user.role}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(!isEditing)}
                  className="border-border text-foreground hover:bg-accent transition-all duration-200 hover:scale-105 active:scale-95 w-full sm:w-auto"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Edit Profile Form */}
          {isEditing && (
            <Card className="border-border transition-all duration-200 animate-in fade-in-0 slide-in-from-bottom-5 duration-300">
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-lg md:text-xl font-semibold text-foreground">Edit Profile</CardTitle>
                <CardDescription className="text-muted-foreground">Update your personal information</CardDescription>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name" className="text-foreground font-medium">
                      Name
                    </Label>
                    <Input
                      id="edit-name"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="border-border focus:border-ring focus:ring-ring transition-colors duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-email" className="text-foreground font-medium">
                      Email
                    </Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="border-border focus:border-ring focus:ring-ring transition-colors duration-200"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 pt-4">
                  <Button
                    onClick={handleSave}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="border-border text-foreground hover:bg-accent transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Account Information */}
          <Card className="border-border transition-all duration-200 hover:shadow-md animate-in fade-in-0 slide-in-from-bottom-5 duration-500 delay-200">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-lg md:text-xl font-semibold text-foreground">Account Information</CardTitle>
              <CardDescription className="text-muted-foreground">Your account details and statistics</CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <div className="space-y-1">
                  <Label className="text-foreground font-medium text-sm">User ID</Label>
                  <div className="text-muted-foreground font-mono text-xs md:text-sm break-all">{user.id}</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-foreground font-medium text-sm">Role</Label>
                  <div>
                    <Badge variant="secondary" className="bg-muted text-muted-foreground text-xs">
                      {user.role}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-foreground font-medium text-sm">Member Since</Label>
                  <div className="text-muted-foreground text-xs md:text-sm">
                    {user.createdAt.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-foreground font-medium text-sm">Last Updated</Label>
                  <div className="text-muted-foreground text-xs md:text-sm">
                    {user.updatedAt.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>

              <Separator className="bg-border" />

              <div className="space-y-4">
                <Label className="text-foreground font-medium text-base md:text-lg">Todo Statistics</Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg transition-all duration-200 hover:bg-accent">
                    <div className="text-xl md:text-2xl font-semibold text-foreground">{user.totalTodos}</div>
                    <div className="text-xs md:text-sm text-muted-foreground">Total Todos</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg transition-all duration-200 hover:bg-green-100 dark:hover:bg-green-900">
                    <div className="text-xl md:text-2xl font-semibold text-green-600 dark:text-green-400">
                      {user.completedTodos}
                    </div>
                    <div className="text-xs md:text-sm text-muted-foreground">Completed</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 dark:bg-orange-950 rounded-lg transition-all duration-200 hover:bg-orange-100 dark:hover:bg-orange-900">
                    <div className="text-xl md:text-2xl font-semibold text-orange-500 dark:text-orange-400">
                      {user.pendingTodos}
                    </div>
                    <div className="text-xs md:text-sm text-muted-foreground">Pending</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Section */}
          <Card className="border-border transition-all duration-200 hover:shadow-md animate-in fade-in-0 slide-in-from-bottom-5 duration-500 delay-300">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-lg md:text-xl font-semibold text-foreground">Security</CardTitle>
              <CardDescription className="text-muted-foreground">Manage your account security settings</CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1">
                  <div className="font-medium text-foreground">Password</div>
                  <div className="text-sm text-muted-foreground">Last changed 30 days ago</div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    toast({
                      title: "Feature coming soon",
                      description: "Password change functionality will be available soon.",
                    })
                  }}
                  className="border-border text-foreground hover:bg-accent transition-all duration-200 hover:scale-105 active:scale-95 w-full sm:w-auto"
                >
                  Change Password
                </Button>
              </div>

              <Separator className="bg-border" />

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1">
                  <div className="font-medium text-foreground">Two-Factor Authentication</div>
                  <div className="text-sm text-muted-foreground">Add an extra layer of security</div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    toast({
                      title: "Feature coming soon",
                      description: "Two-factor authentication will be available soon.",
                    })
                  }}
                  className="border-border text-foreground hover:bg-accent transition-all duration-200 hover:scale-105 active:scale-95 w-full sm:w-auto"
                >
                  Enable 2FA
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
