"use client";

import type React from "react";

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
import { useTheme } from "@/components/theme-provider";
import { useToast } from "@/hooks/use-toast";
import { Loader, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { login } from "@/lib/controllers/auth-controller";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const router = useRouter();

  const loginMutation = useMutation({
    mutationKey: ["login"],
    mutationFn: async () => {
      await login({ email, password });
    },
    onSuccess: () => {
      toast({
        title: "Login Successful",
        description: "You have successfully logged in.",
        variant: "success",
      });
      // Redirect to the home page or dashboard after successful login
      router.push("/");
    },
    onError: (error: any) => {
      console.error("Login failed:", error);
      toast({
        title: "Login Failed",
        description: "Please check your email and password and try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    return await loginMutation.mutateAsync();
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-200 flex flex-col">
      {/* Header with theme toggle */}
      <div className="flex justify-between items-center p-4">
        <Link href="/" className="text-xl font-semibold text-foreground">
          Todo
        </Link>
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

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <Card className="w-full max-w-md border-border shadow-sm animate-in fade-in-0 slide-in-from-bottom-5 duration-500">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-semibold text-foreground">
              Welcome back
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-border focus:border-ring focus:ring-ring transition-colors duration-200"
                  required
                  disabled={loginMutation.isPending}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-foreground font-medium"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-border focus:border-ring focus:ring-ring transition-colors duration-200"
                  required
                  disabled={loginMutation.isPending}
                />
              </div>
              <Button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200 hover:scale-105 active:scale-95 disabled:hover:scale-100"
              >
                {loginMutation.isPending ? (
                  <Loader className="animate-spin size-5" />
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground text-sm">
                {"Don't have an account? "}
                <Link
                  href="/signup"
                  className="text-foreground hover:underline font-medium transition-colors duration-200"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
