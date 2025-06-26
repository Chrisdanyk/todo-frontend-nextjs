"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Edit, Eye, GripVertical } from "lucide-react";
import { useTodo } from "@/contexts/todo-context";
import { Todo } from "@/lib/todo";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface TodoItemProps {
  todo: Todo;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function TodoItem({ todo, onView, onEdit, onDelete }: TodoItemProps) {
  const { toggleTodo } = useTodo();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleToggle = async () => {
    try {
      await toggleTodo(todo.id, !todo.completed);
    } catch (error) {
      console.error("Failed to toggle todo:", error);
    }
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`border-border transition-all duration-200 hover:shadow-sm group ${
        isDragging ? "opacity-50 shadow-lg" : ""
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing hover:bg-accent/50 rounded p-1 transition-colors duration-200"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>

          <Checkbox
            checked={todo.completed}
            onCheckedChange={handleToggle}
            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />

          <div className="flex-1 min-w-0">
            <p
              className={`text-foreground transition-all duration-200 cursor-pointer ${
                todo.completed ? "line-through text-muted-foreground" : ""
              }`}
              onClick={onView}
            >
              {todo.title}
            </p>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={onView}
              className="h-8 w-8 hover:bg-accent opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onEdit}
              className="h-8 w-8 hover:bg-accent opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="h-8 w-8 hover:bg-red-50 dark:hover:bg-red-950 text-red-600 dark:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
