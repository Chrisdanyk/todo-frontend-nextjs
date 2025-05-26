"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Plus, Eye, Edit, Trash2, Check, GripVertical } from "lucide-react"
import { TodoSheet } from "@/components/todo-sheet"
import { AddTodoSheet } from "@/components/add-todo-sheet"
import { useToast } from "@/hooks/use-toast"

// Updated mock data with description field
const mockTodos = [
  {
    id: "1",
    title: "Complete project proposal",
    description:
      "Write a comprehensive project proposal including timeline, budget, and deliverables for the Q2 initiative.",
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    order: 0,
  },
  {
    id: "2",
    title: "Review code changes",
    description:
      "Review the pull requests from the development team and provide feedback on the new authentication system.",
    completed: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    order: 1,
  },
  {
    id: "3",
    title: "Update documentation",
    description: null,
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    order: 2,
  },
  {
    id: "4",
    title: "Schedule team meeting",
    description: "Organize a team meeting to discuss the upcoming sprint and assign tasks to team members.",
    completed: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    order: 3,
  },
  {
    id: "5",
    title: "Fix bug in authentication",
    description:
      "Investigate and fix the login issue that some users are experiencing with social media authentication.",
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    order: 4,
  },
]

type Todo = {
  id: string
  title: string
  description?: string | null
  completed: boolean
  createdAt: Date
  updatedAt: Date
  order: number
}

type SheetAction = "view" | "edit" | "delete" | null

export default function DashboardPage() {
  const [todos, setTodos] = useState<Todo[]>(mockTodos.sort((a, b) => a.order - b.order))
  const [sheetOpen, setSheetOpen] = useState(false)
  const [addSheetOpen, setAddSheetOpen] = useState(false)
  const [sheetAction, setSheetAction] = useState<SheetAction>(null)
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null)
  const [draggedTodo, setDraggedTodo] = useState<string | null>(null)
  const { toast } = useToast()

  const completedCount = todos.filter((todo) => todo.completed).length
  const uncompletedCount = todos.filter((todo) => !todo.completed).length

  const handleAction = (action: SheetAction, todo: Todo) => {
    setSheetAction(action)
    setSelectedTodo(todo)
    setSheetOpen(true)
  }

  const handleToggleComplete = (todoId: string) => {
    const todo = todos.find((t) => t.id === todoId)
    if (!todo) return

    setTodos(
      todos.map((todo) => (todo.id === todoId ? { ...todo, completed: !todo.completed, updatedAt: new Date() } : todo)),
    )

    toast({
      variant: "success",
      title: todo.completed ? "Todo marked as pending" : "Todo completed!",
      description: `"${todo.title}" has been ${todo.completed ? "marked as pending" : "completed"}.`,
    })
  }

  const handleDeleteTodo = (todoId: string) => {
    const todo = todos.find((t) => t.id === todoId)
    setTodos(todos.filter((todo) => todo.id !== todoId))
    setSheetOpen(false)

    toast({
      variant: "destructive",
      title: "Todo deleted",
      description: `"${todo?.title}" has been permanently deleted.`,
    })
  }

  const handleUpdateTodo = (todoId: string, title: string, description?: string) => {
    setTodos(todos.map((todo) => (todo.id === todoId ? { ...todo, title, description, updatedAt: new Date() } : todo)))
    setSheetOpen(false)

    toast({
      variant: "success",
      title: "Todo updated",
      description: "Your todo has been successfully updated.",
    })
  }

  const handleAddTodo = (title: string, description?: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      title,
      description,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      order: todos.length,
    }
    setTodos([...todos, newTodo])

    toast({
      variant: "success",
      title: "Todo created",
      description: `"${title}" has been added to your todo list.`,
    })
  }

  const handleDragStart = (e: React.DragEvent, todoId: string) => {
    setDraggedTodo(todoId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, targetTodoId: string) => {
    e.preventDefault()

    if (!draggedTodo || draggedTodo === targetTodoId) return

    const draggedIndex = todos.findIndex((todo) => todo.id === draggedTodo)
    const targetIndex = todos.findIndex((todo) => todo.id === targetTodoId)

    const newTodos = [...todos]
    const [draggedItem] = newTodos.splice(draggedIndex, 1)
    newTodos.splice(targetIndex, 0, draggedItem)

    // Update order
    const updatedTodos = newTodos.map((todo, index) => ({
      ...todo,
      order: index,
      updatedAt: new Date(),
    }))

    setTodos(updatedTodos)
    setDraggedTodo(null)

    toast({
      variant: "success",
      title: "Todos reordered",
      description: "Your todo list has been successfully reordered.",
    })
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-200">
      <div className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground animate-in fade-in-0 slide-in-from-left-5 duration-500">
              Dashboard
            </h1>
          </div>
          <Button
            onClick={() => setAddSheetOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Todo
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          <Card className="border-border transition-all duration-200 hover:shadow-md animate-in fade-in-0 slide-in-from-bottom-5 duration-500 delay-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium text-foreground">Total Todos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-semibold text-foreground">{todos.length}</div>
            </CardContent>
          </Card>

          <Card className="border-border transition-all duration-200 hover:shadow-md animate-in fade-in-0 slide-in-from-bottom-5 duration-500 delay-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium text-foreground">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-semibold text-green-600 dark:text-green-400">
                {completedCount}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border transition-all duration-200 hover:shadow-md animate-in fade-in-0 slide-in-from-bottom-5 duration-500 delay-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium text-foreground">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-semibold text-orange-500 dark:text-orange-400">
                {uncompletedCount}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Todos List */}
        <Card className="border-border transition-colors duration-200 animate-in fade-in-0 slide-in-from-bottom-5 duration-500 delay-400">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-foreground">Your Todos</CardTitle>
            <CardDescription className="text-muted-foreground">
              Manage your tasks and track your progress. Drag to reorder.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todos.map((todo, index) => (
                <div
                  key={todo.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, todo.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, todo.id)}
                  className={`flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-all duration-200 cursor-move group animate-in fade-in-0 slide-in-from-left-5 ${
                    draggedTodo === todo.id ? "opacity-50 scale-95" : ""
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0" />
                    <button
                      onClick={() => handleToggleComplete(todo.id)}
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 hover:scale-110 ${
                        todo.completed
                          ? "bg-green-500 border-green-500 text-white"
                          : "border-border hover:border-muted-foreground"
                      }`}
                    >
                      {todo.completed && <Check className="h-3 w-3" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <span
                        className={`font-medium block truncate ${todo.completed ? "text-muted-foreground line-through" : "text-foreground"}`}
                      >
                        {todo.title}
                      </span>
                      {todo.description && (
                        <span className="text-sm text-muted-foreground block truncate mt-1">{todo.description}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAction("view", todo)}
                      className="h-8 w-8 p-0 hover:bg-accent transition-colors duration-200"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAction("edit", todo)}
                      className="h-8 w-8 p-0 hover:bg-accent transition-colors duration-200"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAction("delete", todo)}
                      className="h-8 w-8 p-0 hover:bg-red-50 dark:hover:bg-red-950 text-red-600 dark:text-red-400 transition-colors duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {todos.length === 0 && (
                <div className="text-center py-12 animate-in fade-in-0 duration-500">
                  <div className="text-muted-foreground mb-2">No todos yet</div>
                  <div className="text-sm text-muted-foreground">Create your first todo to get started</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <TodoSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        action={sheetAction}
        todo={selectedTodo}
        onDelete={handleDeleteTodo}
        onUpdate={handleUpdateTodo}
      />

      <AddTodoSheet open={addSheetOpen} onOpenChange={setAddSheetOpen} onAdd={handleAddTodo} />
    </div>
  )
}
