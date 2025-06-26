"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TodoItem } from "@/components/todo-item";
import { AddTodoSheet } from "@/components/add-todo-sheet";
import { TodoSheet } from "@/components/todo-sheet";
import { useTodo } from "@/contexts/todo-context";
import { Search, Plus, CheckCircle, Trash2, Filter } from "lucide-react";
import { Todo } from "@/lib/todo";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

export function TodoList() {
  const {
    todos,
    isLoading,
    meta,
    filters,
    createTodo,
    updateTodo,
    deleteTodo,
    setFilters,
    loadTodos,
    markAllCompleted,
    deleteCompletedTodos,
    reorderTodos,
  } = useTodo();

  const [showAddSheet, setShowAddSheet] = useState(false);
  const [sheetAction, setSheetAction] = useState<
    "view" | "edit" | "delete" | null
  >(null);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const completedCount = todos.filter((todo) => todo.completed).length;
  const activeCount = todos.filter((todo) => !todo.completed).length;

  // Sort todos by order
  const sortedTodos = [...todos].sort((a, b) => a.order - b.order);

  // Update search term in filters
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setFilters({ ...filters, search: value || undefined });
  };

  const handleAddTodo = async (title: string, description?: string) => {
    try {
      await createTodo({ title });
      setShowAddSheet(false);
    } catch (error) {
      console.error("Failed to create todo:", error);
    }
  };

  const handleUpdateTodo = async (
    todoId: string,
    title: string,
    description?: string
  ) => {
    try {
      await updateTodo(todoId, { title });
      setSheetAction(null);
      setSelectedTodo(null);
    } catch (error) {
      console.error("Failed to update todo:", error);
    }
  };

  const handleDeleteTodo = async (todoId: string) => {
    try {
      await deleteTodo(todoId);
      setSheetAction(null);
      setSelectedTodo(null);
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  const handleFilterChange = (value: string) => {
    switch (value) {
      case "all":
        setFilters({ ...filters, completed: undefined });
        break;
      case "active":
        setFilters({ ...filters, completed: false });
        break;
      case "completed":
        setFilters({ ...filters, completed: true });
        break;
      default:
        setFilters({ ...filters, completed: undefined });
    }
  };

  const handleMarkAllCompleted = async () => {
    const allCompleted = todos.every((todo) => todo.completed);
    await markAllCompleted(!allCompleted);
  };

  const handleDeleteCompleted = async () => {
    await deleteCompletedTodos();
  };

  const openTodoSheet = (todo: Todo, action: "view" | "edit" | "delete") => {
    setSelectedTodo(todo);
    setSheetAction(action);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      try {
        // Get the new order of todo IDs
        const oldIndex = sortedTodos.findIndex((todo) => todo.id === active.id);
        const newIndex = sortedTodos.findIndex((todo) => todo.id === over?.id);

        const newTodoIds = [...sortedTodos.map((todo) => todo.id)];
        const [movedTodo] = newTodoIds.splice(oldIndex, 1);
        newTodoIds.splice(newIndex, 0, movedTodo);

        await reorderTodos(newTodoIds);
      } catch (error) {
        console.error("Failed to reorder todos:", error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          {/* <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
            My Todos
          </h1> */}
          {/* <p className="text-muted-foreground mt-1">
            {activeCount} active, {completedCount} completed
          </p> */}
        </div>

        <div className="flex items-center gap-2 mt-6">
          <Button
            onClick={() => setShowAddSheet(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Todo
          </Button>

          {todos.length > 0 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllCompleted}
                className="border-border text-foreground hover:bg-accent"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {todos.every((todo) => todo.completed)
                  ? "Uncomplete All"
                  : "Complete All"}
              </Button>

              {completedCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeleteCompleted}
                  className="border-border text-foreground hover:bg-red-50 dark:hover:bg-red-950 text-red-600 dark:text-red-400"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Completed
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search todos..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 border-border focus:border-ring focus:ring-ring transition-colors duration-200"
          />
        </div>

        <Select
          value={
            filters.completed === undefined
              ? "all"
              : filters.completed
              ? "completed"
              : "active"
          }
          onValueChange={handleFilterChange}
        >
          <SelectTrigger className="w-full sm:w-48 border-border focus:border-ring focus:ring-ring transition-colors duration-200">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Todos</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Todo List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="text-muted-foreground">Loading todos...</span>
            </div>
          </div>
        ) : todos.length === 0 ? (
          <Card className="border-border">
            <CardContent className="p-12 text-center">
              <div className="text-muted-foreground">
                {filters.completed !== undefined || filters.search ? (
                  <>
                    <p className="text-lg font-medium mb-2">No todos found</p>
                    <p className="text-sm">
                      Try adjusting your filters or search terms.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-lg font-medium mb-2">No todos yet</p>
                    <p className="text-sm">
                      Create your first todo to get started!
                    </p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sortedTodos.map((todo) => todo.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3 group">
                {sortedTodos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onView={() => openTodoSheet(todo, "view")}
                    onEdit={() => openTodoSheet(todo, "edit")}
                    onDelete={() => openTodoSheet(todo, "delete")}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Pagination Info */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {(meta.page - 1) * meta.limit + 1} to{" "}
            {Math.min(meta.page * meta.limit, meta.total)} of {meta.total} todos
          </span>
          <span>
            Page {meta.page} of {meta.totalPages}
          </span>
        </div>
      )}

      {/* Add Todo Sheet */}
      <AddTodoSheet
        open={showAddSheet}
        onOpenChange={setShowAddSheet}
        onAdd={handleAddTodo}
      />

      {/* Todo Sheet for View/Edit/Delete */}
      {selectedTodo && sheetAction && (
        <TodoSheet
          open={!!selectedTodo && !!sheetAction}
          onOpenChange={(open) => {
            if (!open) {
              setSheetAction(null);
              setSelectedTodo(null);
            }
          }}
          action={sheetAction}
          todo={selectedTodo}
          onDelete={handleDeleteTodo}
          onUpdate={handleUpdateTodo}
        />
      )}
    </div>
  );
}
