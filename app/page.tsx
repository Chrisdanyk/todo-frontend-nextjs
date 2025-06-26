"use client";

import { useEffect } from "react";
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
import { useTheme } from "@/components/theme-provider";
import { Moon, Sun, CheckCircle, Users, Zap } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md border-border">
          <CardContent className="flex items-center justify-center p-8">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="text-muted-foreground">Loading...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-200">
      {/* Header */}
      <div className="flex justify-between items-center p-4 md:p-6">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-semibold text-foreground">Todo App</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="h-8 w-8 hover:bg-accent transition-colors duration-200"
        >
          {theme === "light" ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center px-4 py-12 md:py-24 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground animate-in fade-in-0 slide-in-from-bottom-5 duration-500">
              Organize Your Life
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto animate-in fade-in-0 slide-in-from-bottom-5 duration-500 delay-200">
              A beautiful, simple, and powerful todo application to help you
              stay organized and productive.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in-0 slide-in-from-bottom-5 duration-500 delay-300">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <Link href="/signup">Get Started</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-border text-foreground hover:bg-accent font-medium transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-4 md:px-6 py-12 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything you need to stay organized
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to help you manage tasks efficiently
              and boost your productivity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <Card className="border-border transition-all duration-200 hover:shadow-md animate-in fade-in-0 slide-in-from-bottom-5 duration-500 delay-400">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl font-semibold text-foreground">
                  Simple & Intuitive
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Clean, modern interface that makes task management effortless
                  and enjoyable.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border transition-all duration-200 hover:shadow-md animate-in fade-in-0 slide-in-from-bottom-5 duration-500 delay-500">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl font-semibold text-foreground">
                  Lightning Fast
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Built with modern technologies for instant responsiveness and
                  smooth interactions.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border transition-all duration-200 hover:shadow-md animate-in fade-in-0 slide-in-from-bottom-5 duration-500 delay-600">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl font-semibold text-foreground">
                  Team Ready
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  User management and admin features for teams and
                  organizations.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border py-8 px-4 md:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted-foreground">
            © 2024 Todo App. Built with Next.js and modern web technologies.
          </p>
        </div>
      </div>
    </div>
  );
}
