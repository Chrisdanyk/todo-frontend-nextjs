"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  fallback?: ReactNode;
}

export function ProtectedRoute({
  children,
  requireAuth = true,
  requireAdmin = false,
  fallback,
}: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && requireAuth && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, requireAuth, isAuthenticated, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md border-border">
          <CardContent className="flex items-center justify-center p-8">
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="text-muted-foreground">Loading...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if user needs to be authenticated
  if (requireAuth && !isAuthenticated) {
    return (
      fallback || (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Card className="w-full max-w-md border-border">
            <CardHeader className="text-center">
              <CardTitle className="text-foreground">
                Authentication Required
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Please log in to access this page
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button onClick={() => router.push("/login")}>Go to Login</Button>
            </CardContent>
          </Card>
        </div>
      )
    );
  }

  // Check if user needs admin role
  if (requireAdmin && user?.role !== "ADMIN") {
    return (
      fallback || (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Card className="w-full max-w-md border-border">
            <CardHeader className="text-center">
              <CardTitle className="text-foreground">Access Denied</CardTitle>
              <CardDescription className="text-muted-foreground">
                You don't have permission to access this page. Admin privileges
                required.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button onClick={() => router.push("/dashboard")}>
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    );
  }

  return <>{children}</>;
}
