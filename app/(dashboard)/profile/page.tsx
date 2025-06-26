"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { User, Shield, Mail, Calendar, Edit, Save, X } from "lucide-react";

export default function ProfilePage() {
  const { user, updateProfile, isLoading } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  const handleSave = async () => {
    try {
      await updateProfile({ name });
      setIsEditing(false);
    } catch (error) {
      console.error("Profile update error:", error);
    }
  };

  const handleCancel = () => {
    setName(user?.name || "");
    setEmail(user?.email || "");
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md border-border">
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading profile...</p>
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
              Profile
            </h1>
          </div>
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="lg:col-span-2 border-border transition-all duration-200 hover:shadow-md animate-in fade-in-0 slide-in-from-bottom-5 duration-500">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-foreground">
                Personal Information
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Manage your account details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full">
                  {user.role === "ADMIN" ? (
                    <Shield className="h-8 w-8 text-primary" />
                  ) : (
                    <User className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {user.name || "No name set"}
                  </h3>
                  <p className="text-muted-foreground">{user.email}</p>
                  <Badge
                    variant={user.role === "ADMIN" ? "default" : "secondary"}
                    className="mt-1"
                  >
                    {user.role}
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground font-medium">
                    Name
                  </Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="border-border focus:border-ring focus:ring-ring transition-colors duration-200"
                    />
                  ) : (
                    <p className="text-foreground">
                      {user.name || "No name provided"}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-foreground font-medium"
                  >
                    Email
                  </Label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p className="text-foreground">{user.email}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground font-medium">Role</Label>
                  <div className="flex items-center gap-2">
                    {user.role === "ADMIN" ? (
                      <Shield className="h-4 w-4 text-primary" />
                    ) : (
                      <User className="h-4 w-4 text-muted-foreground" />
                    )}
                    <Badge
                      variant={user.role === "ADMIN" ? "default" : "secondary"}
                    >
                      {user.role}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground font-medium">
                    Member Since
                  </Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="text-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground font-medium">
                    Last Updated
                  </Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="text-foreground">
                      {new Date(user.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="border-border text-foreground hover:bg-accent transition-colors duration-200"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Stats */}
          <Card className="border-border transition-all duration-200 hover:shadow-md animate-in fade-in-0 slide-in-from-bottom-5 duration-500 delay-200">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-foreground">
                Account Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-800 dark:text-green-200 font-medium">
                    Active
                  </span>
                </div>
                <p className="text-green-600 dark:text-green-400 text-sm mt-1">
                  Your account is active and ready to use
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Account Type</span>
                  <Badge
                    variant={user.role === "ADMIN" ? "default" : "secondary"}
                  >
                    {user.role}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Email Verified</span>
                  <span className="text-green-600 dark:text-green-400">✓</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Two-Factor Auth</span>
                  <span className="text-muted-foreground">Not enabled</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
