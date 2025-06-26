"use client";

import { Home, User, Users, Moon, Sun, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
  },
  {
    title: "User Management",
    url: "/admin/users",
    icon: Users,
    adminOnly: true,
  },
];

export function AppSidebar() {
  const { theme, setTheme } = useTheme();
  const { user, logout, isLoading } = useAuth();

  const isAdmin = user?.role === "ADMIN";

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <Sidebar className="border-r border-border transition-colors duration-200">
      <SidebarHeader className="p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-foreground">Todo</h1>
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
        {user && (
          <div className="mt-4 p-3 bg-accent/50 rounded-lg">
            <p className="text-sm font-medium text-foreground">
              {user.name || user.email}
            </p>
            <p className="text-xs text-muted-foreground capitalize">
              {user.role.toLowerCase()}
            </p>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground text-sm font-medium">
            Main
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems
                .filter((item) => !item.adminOnly || isAdmin)
                .map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className="hover:bg-accent transition-colors duration-200"
                    >
                      <Link
                        href={item.url}
                        className="flex items-center gap-3 text-foreground"
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-6">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              disabled={isLoading}
              className="hover:bg-accent transition-colors duration-200 text-red-600 dark:text-red-400 disabled:opacity-50"
            >
              <LogOut className="h-4 w-4" />
              <span>{isLoading ? "Signing out..." : "Sign Out"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
