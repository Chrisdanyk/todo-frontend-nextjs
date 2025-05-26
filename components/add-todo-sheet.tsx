"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"

type AddTodoSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (title: string, description?: string) => void
}

export function AddTodoSheet({ open, onOpenChange, onAdd }: AddTodoSheetProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = () => {
    if (title.trim()) {
      onAdd(title.trim(), description.trim() || undefined)
      setTitle("")
      setDescription("")
      onOpenChange(false)
    }
  }

  const handleCancel = () => {
    setTitle("")
    setDescription("")
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-background border-l border-border transition-colors duration-200">
        <SheetHeader>
          <SheetTitle className="text-foreground">Add New Todo</SheetTitle>
          <SheetDescription className="text-muted-foreground">
            Create a new todo item with title and optional description
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="todo-title" className="text-foreground font-medium">
              Title *
            </Label>
            <Input
              id="todo-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-border focus:border-ring focus:ring-ring transition-colors duration-200"
              placeholder="Enter todo title"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="todo-description" className="text-foreground font-medium">
              Description
            </Label>
            <Textarea
              id="todo-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border-border focus:border-ring focus:ring-ring transition-colors duration-200 min-h-[120px] resize-none"
              placeholder="Enter todo description (optional)"
            />
            <p className="text-xs text-muted-foreground">
              You can use this space to add detailed notes about your todo
            </p>
          </div>
        </div>

        <SheetFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="border-border text-foreground hover:bg-accent transition-colors duration-200"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-primary hover:bg-primary/90 text-primary-foreground transition-colors duration-200"
            disabled={!title.trim()}
          >
            Add Todo
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
