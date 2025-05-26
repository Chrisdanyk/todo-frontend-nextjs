"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"

type Todo = {
  id: string
  title: string
  description?: string | null
  completed: boolean
  createdAt: Date
  updatedAt: Date
  order: number
}

type TodoSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  action: "view" | "edit" | "delete" | null
  todo: Todo | null
  onDelete: (todoId: string) => void
  onUpdate: (todoId: string, title: string, description?: string) => void
}

export function TodoSheet({ open, onOpenChange, action, todo, onDelete, onUpdate }: TodoSheetProps) {
  const [editTitle, setEditTitle] = useState("")
  const [editDescription, setEditDescription] = useState("")

  useEffect(() => {
    if (todo && action === "edit") {
      setEditTitle(todo.title)
      setEditDescription(todo.description || "")
    }
  }, [todo, action])

  if (!todo || !action) return null

  const handleUpdate = () => {
    if (editTitle.trim()) {
      onUpdate(todo.id, editTitle.trim(), editDescription.trim() || undefined)
    }
  }

  const handleDelete = () => {
    onDelete(todo.id)
  }

  const getSheetTitle = () => {
    switch (action) {
      case "view":
        return "View Todo"
      case "edit":
        return "Edit Todo"
      case "delete":
        return "Delete Todo"
      default:
        return "Todo"
    }
  }

  const getSheetDescription = () => {
    switch (action) {
      case "view":
        return "View todo details and information"
      case "edit":
        return "Make changes to your todo"
      case "delete":
        return "This action cannot be undone"
      default:
        return ""
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-background border-l border-border transition-colors duration-200">
        <SheetHeader>
          <SheetTitle className="text-foreground">{getSheetTitle()}</SheetTitle>
          <SheetDescription className="text-muted-foreground">{getSheetDescription()}</SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {action === "view" && (
            <div className="space-y-4">
              <div>
                <Label className="text-foreground font-medium">Title</Label>
                <div className="mt-1 p-3 bg-muted rounded-md text-foreground">{todo.title}</div>
              </div>

              {todo.description && (
                <div>
                  <Label className="text-foreground font-medium">Description</Label>
                  <div className="mt-1 p-3 bg-muted rounded-md text-foreground whitespace-pre-wrap">
                    {todo.description}
                  </div>
                </div>
              )}

              <div>
                <Label className="text-foreground font-medium">Status</Label>
                <div className="mt-1">
                  <Badge
                    variant={todo.completed ? "default" : "secondary"}
                    className={
                      todo.completed
                        ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-100"
                        : "bg-orange-100 text-orange-800 hover:bg-orange-100 dark:bg-orange-900 dark:text-orange-100"
                    }
                  >
                    {todo.completed ? "Completed" : "Pending"}
                  </Badge>
                </div>
              </div>

              <div>
                <Label className="text-foreground font-medium">Created</Label>
                <div className="mt-1 text-muted-foreground">
                  {todo.createdAt.toLocaleDateString()} at {todo.createdAt.toLocaleTimeString()}
                </div>
              </div>

              <div>
                <Label className="text-foreground font-medium">Last Updated</Label>
                <div className="mt-1 text-muted-foreground">
                  {todo.updatedAt.toLocaleDateString()} at {todo.updatedAt.toLocaleTimeString()}
                </div>
              </div>
            </div>
          )}

          {action === "edit" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title" className="text-foreground font-medium">
                  Title *
                </Label>
                <Input
                  id="edit-title"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="mt-1 border-border focus:border-ring focus:ring-ring transition-colors duration-200"
                  placeholder="Enter todo title"
                />
              </div>

              <div>
                <Label htmlFor="edit-description" className="text-foreground font-medium">
                  Description
                </Label>
                <Textarea
                  id="edit-description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="mt-1 border-border focus:border-ring focus:ring-ring transition-colors duration-200 min-h-[120px] resize-none"
                  placeholder="Enter todo description (optional)"
                />
              </div>

              <div>
                <Label className="text-foreground font-medium">Current Status</Label>
                <div className="mt-1">
                  <Badge
                    variant={todo.completed ? "default" : "secondary"}
                    className={
                      todo.completed
                        ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-100"
                        : "bg-orange-100 text-orange-800 hover:bg-orange-100 dark:bg-orange-900 dark:text-orange-100"
                    }
                  >
                    {todo.completed ? "Completed" : "Pending"}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {action === "delete" && (
            <div className="space-y-4">
              <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md">
                <div className="text-red-800 dark:text-red-200 font-medium">Are you sure?</div>
                <div className="text-red-600 dark:text-red-400 text-sm mt-1">
                  This will permanently delete the todo "{todo.title}". This action cannot be undone.
                </div>
              </div>
            </div>
          )}
        </div>

        <SheetFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-border text-foreground hover:bg-accent transition-colors duration-200"
          >
            Cancel
          </Button>

          {action === "edit" && (
            <Button
              onClick={handleUpdate}
              className="bg-primary hover:bg-primary/90 text-primary-foreground transition-colors duration-200"
              disabled={!editTitle.trim()}
            >
              Save Changes
            </Button>
          )}

          {action === "delete" && (
            <Button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white transition-colors duration-200"
            >
              Delete Todo
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
