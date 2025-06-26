"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import {
  todoAPI,
  Todo,
  CreateTodoData,
  UpdateTodoData,
  TodoFilters,
  TodoListResponse,
} from "@/lib/todo";
import { useToast } from "@/hooks/use-toast";

interface TodoContextType {
  todos: Todo[];
  isLoading: boolean;
  meta: TodoListResponse["meta"] | null;
  currentPage: number;
  filters: TodoFilters;
  stats: {
    total: number;
    completed: number;
    active: number;
    completionRate: number;
  } | null;
  createTodo: (data: CreateTodoData) => Promise<void>;
  updateTodo: (id: string, data: UpdateTodoData) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleTodo: (id: string, completed: boolean) => Promise<void>;
  loadTodos: (
    page?: number,
    newFilters?: TodoFilters,
    limit?: number
  ) => Promise<void>;
  setFilters: (filters: TodoFilters) => void;
  setPage: (page: number) => void;
  markAllCompleted: (completed: boolean) => Promise<void>;
  deleteCompletedTodos: () => Promise<void>;
  refreshTodos: () => Promise<void>;
  reorderTodos: (todoIds: string[]) => Promise<void>;
  loadStats: () => Promise<void>;
  refreshStats: () => Promise<void>;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export function useTodo() {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error("useTodo must be used within a TodoProvider");
  }
  return context;
}

interface TodoProviderProps {
  children: ReactNode;
}

export function TodoProvider({ children }: TodoProviderProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [meta, setMeta] = useState<TodoListResponse["meta"] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<TodoFilters>({});
  const [stats, setStats] = useState<{
    total: number;
    completed: number;
    active: number;
    completionRate: number;
  } | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [requestCount, setRequestCount] = useState(0);
  const [hasInitialized, setHasInitialized] = useState(false);
  const { toast } = useToast();

  // Global request limiter
  const MAX_REQUESTS_PER_MINUTE = 30;
  const [lastRequestTime, setLastRequestTime] = useState(0);

  const loadTodos = useCallback(
    async (page: number = 1, newFilters?: TodoFilters, limit?: number) => {
      if (isLoading) {
        console.log("🚫 Preventing concurrent loadTodos call");
        return; // Prevent multiple simultaneous calls
      }

      // Rate limiting
      const now = Date.now();
      if (now - lastRequestTime < 1000) {
        // Minimum 1 second between requests
        console.log("🚫 Rate limiting: too soon since last request");
        return;
      }

      if (requestCount >= MAX_REQUESTS_PER_MINUTE) {
        console.log("🚫 Rate limiting: exceeded max requests per minute");
        toast({
          variant: "destructive",
          title: "Too many requests",
          description: "Please wait a moment before making more requests.",
        });
        return;
      }

      console.log("📡 Loading todos:", { page, newFilters, limit });

      try {
        setIsLoading(true);
        setRequestCount((prev) => prev + 1);
        setLastRequestTime(now);

        const response = await todoAPI.getTodos(
          page,
          newFilters || filters,
          limit
        );
        setTodos(response.data);
        setMeta(response.meta);
        setCurrentPage(page);
        if (newFilters) {
          setFilters(newFilters);
        }
      } catch (error) {
        console.error("Failed to load todos:", error);
        toast({
          variant: "destructive",
          title: "Failed to load todos",
          description:
            error instanceof Error
              ? error.message
              : "Unable to load todos. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [filters, toast, isLoading, lastRequestTime, requestCount]
  );

  // Debounced effect for filter changes
  useEffect(() => {
    // Skip if this is the initial load or if filters haven't changed meaningfully
    if (!hasInitialized) return;

    console.log("🔄 Filter effect triggered:", filters);
    const timer = setTimeout(() => {
      console.log("⏰ Debounced filter change executing");
      loadTodos(1, filters);
    }, 800); // Slightly longer debounce to reduce calls

    return () => clearTimeout(timer);
  }, [filters, loadTodos, hasInitialized]);

  // Reset request counter every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setRequestCount(0);
    }, 60000); // Reset every minute

    return () => clearInterval(timer);
  }, []);

  // Initial load - optimized to prevent conflicts
  useEffect(() => {
    if (!hasInitialized && !isLoading) {
      console.log("🚀 Initial load triggered");
      setHasInitialized(true);
      loadTodos(1, {}, 50); // Load with default limit
    }
  }, [hasInitialized, isLoading, loadTodos]);

  const createTodo = async (data: CreateTodoData) => {
    try {
      setIsLoading(true);
      const newTodo = await todoAPI.createTodo(data);
      setTodos((prev) => [newTodo, ...prev]);

      // Refresh stats to show real-time updates
      await refreshStats();

      toast({
        variant: "success",
        title: "Todo created",
        description: "Your todo has been successfully created.",
      });
    } catch (error) {
      console.error("Failed to create todo:", error);
      toast({
        variant: "destructive",
        title: "Failed to create todo",
        description:
          error instanceof Error
            ? error.message
            : "Unable to create todo. Please try again.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTodo = async (id: string, data: UpdateTodoData) => {
    try {
      const updatedTodo = await todoAPI.updateTodo(id, data);
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? updatedTodo : todo))
      );

      // Refresh stats to show real-time updates
      await refreshStats();

      toast({
        variant: "success",
        title: "Todo updated",
        description: "Your todo has been successfully updated.",
      });
    } catch (error) {
      console.error("Failed to update todo:", error);
      toast({
        variant: "destructive",
        title: "Failed to update todo",
        description:
          error instanceof Error
            ? error.message
            : "Unable to update todo. Please try again.",
      });
      throw error;
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await todoAPI.deleteTodo(id);
      setTodos((prev) => prev.filter((todo) => todo.id !== id));

      // Refresh stats to show real-time updates
      await refreshStats();

      toast({
        variant: "default",
        title: "Todo deleted",
        description: "Your todo has been successfully deleted.",
      });
    } catch (error) {
      console.error("Failed to delete todo:", error);
      toast({
        variant: "destructive",
        title: "Failed to delete todo",
        description:
          error instanceof Error
            ? error.message
            : "Unable to delete todo. Please try again.",
      });
      throw error;
    }
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    try {
      const updatedTodo = await todoAPI.toggleTodo(id, completed);
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? updatedTodo : todo))
      );

      // Refresh stats to show real-time updates
      await refreshStats();
    } catch (error) {
      console.error("Failed to toggle todo:", error);
      toast({
        variant: "destructive",
        title: "Failed to update todo",
        description:
          error instanceof Error
            ? error.message
            : "Unable to update todo. Please try again.",
      });
      throw error;
    }
  };

  const markAllCompleted = async (completed: boolean) => {
    try {
      setIsLoading(true);
      await todoAPI.markAllCompleted(completed);

      // Update local state instead of making API calls
      setTodos((prev) => prev.map((todo) => ({ ...todo, completed })));

      // Update stats locally
      if (stats) {
        const completedCount = completed ? todos.length : 0;
        const activeCount = completed ? 0 : todos.length;
        setStats({
          ...stats,
          completed: completedCount,
          active: activeCount,
          completionRate: completed ? 100 : 0,
        });
      }

      toast({
        variant: "success",
        title: "Todos updated",
        description: `All todos have been marked as ${
          completed ? "completed" : "pending"
        }.`,
      });
    } catch (error) {
      console.error("Failed to mark all todos:", error);
      toast({
        variant: "destructive",
        title: "Failed to update todos",
        description:
          error instanceof Error
            ? error.message
            : "Unable to update todos. Please try again.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCompletedTodos = async () => {
    try {
      setIsLoading(true);
      await todoAPI.deleteCompletedTodosBulk();

      // Update local state instead of making API calls
      const completedCount = todos.filter((todo) => todo.completed).length;
      setTodos((prev) => prev.filter((todo) => !todo.completed));

      // Update stats locally
      if (stats) {
        setStats({
          ...stats,
          total: stats.total - completedCount,
          completed: stats.completed - completedCount,
          completionRate:
            stats.total - completedCount > 0
              ? Math.round(
                  ((stats.completed - completedCount) /
                    (stats.total - completedCount)) *
                    100
                )
              : 0,
        });
      }

      toast({
        variant: "success",
        title: "Completed todos deleted",
        description: "All completed todos have been deleted.",
      });
    } catch (error) {
      console.error("Failed to delete completed todos:", error);
      toast({
        variant: "destructive",
        title: "Failed to delete todos",
        description:
          error instanceof Error
            ? error.message
            : "Unable to delete todos. Please try again.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshTodos = async () => {
    await loadTodos(currentPage, filters);
  };

  const handleSetFilters = (newFilters: TodoFilters) => {
    setFilters(newFilters);
  };

  const handleSetPage = (page: number) => {
    loadTodos(page, filters);
  };

  const reorderTodos = async (todoIds: string[]) => {
    try {
      setIsLoading(true);
      await todoAPI.reorderTodos(todoIds);

      // Update the local state with the new order
      setTodos((prev) => {
        const todoMap = new Map(prev.map((todo) => [todo.id, todo]));
        return todoIds.map((id, index) => ({
          ...todoMap.get(id)!,
          order: index,
        }));
      });

      // Refresh stats to show real-time updates
      await refreshStats();

      toast({
        variant: "success",
        title: "Todos reordered",
        description: "Todos have been successfully reordered.",
      });
    } catch (error) {
      console.error("Failed to reorder todos:", error);
      toast({
        variant: "destructive",
        title: "Failed to reorder todos",
        description:
          error instanceof Error
            ? error.message
            : "Unable to reorder todos. Please try again.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = useCallback(async () => {
    if (isLoadingStats || stats) {
      console.log("🚫 Skipping stats load - already loading or has data");
      return; // Prevent multiple simultaneous calls or unnecessary calls
    }

    console.log("📊 Loading stats");

    try {
      setIsLoadingStats(true);
      const statsData = await todoAPI.getStats();
      console.log("📊 Stats loaded successfully:", statsData);
      setStats(statsData);
    } catch (error) {
      console.error("Failed to load stats:", error);
      console.error("Error details:", {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });
      toast({
        variant: "destructive",
        title: "Failed to load stats",
        description:
          error instanceof Error
            ? error.message
            : "Unable to load stats. Please try again.",
      });
    } finally {
      setIsLoadingStats(false);
    }
  }, [isLoadingStats, stats, toast]);

  const refreshStats = useCallback(async () => {
    console.log("🔄 Refreshing stats");

    try {
      setIsLoadingStats(true);
      const statsData = await todoAPI.getStats();
      setStats(statsData);
    } catch (error) {
      console.error("Failed to refresh stats:", error);
      toast({
        variant: "destructive",
        title: "Failed to refresh stats",
        description:
          error instanceof Error
            ? error.message
            : "Unable to refresh stats. Please try again.",
      });
    } finally {
      setIsLoadingStats(false);
    }
  }, [toast]);

  const value: TodoContextType = {
    todos,
    isLoading,
    meta,
    currentPage,
    filters,
    stats,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    loadTodos,
    setFilters: handleSetFilters,
    setPage: handleSetPage,
    markAllCompleted,
    deleteCompletedTodos,
    refreshTodos,
    reorderTodos,
    loadStats,
    refreshStats,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}
