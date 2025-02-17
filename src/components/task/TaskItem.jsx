import { useState, useRef, useEffect } from "react";
import { GripVertical, Check, Pencil, Trash2, X, CornerDownLeft } from "lucide-react";
import { toast } from "sonner";
import useProjectStore from "../../store/projectStore";
import { cn } from "../../lib/utils";

export default function TaskItem({ task, dragRef, isDragging }) {
  const selectedProjectId = useProjectStore((s) => s.selectedProjectId);
  const toggleTask = useProjectStore((s) => s.toggleTask);
  const deleteTask = useProjectStore((s) => s.deleteTask);
  const updateTask = useProjectStore((s) => s.updateTask);

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const inputRef = useRef();

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  function handleSave() {
    const trimmed = editText.trim();
    if (!trimmed) {
      toast.error("Task text cannot be empty");
      return;
    }
    updateTask(selectedProjectId, task.id, trimmed);
    setIsEditing(false);
  }

  function handleCancel() {
    setEditText(task.text);
    setIsEditing(false);
  }

  return (
    <li
      ref={dragRef}
      className={cn(
        "group flex items-center gap-3 py-3.5 px-3 -mx-3 rounded-lg transition-colors",
        isDragging && "drag-overlay bg-surface-card rounded-lg border border-border",
        !isDragging && "hover:bg-surface-hover",
      )}
    >
      <button
        className="cursor-grab active:cursor-grabbing text-text-faint hover:text-text-muted shrink-0 touch-none"
        tabIndex={-1}
        aria-label="Drag to reorder"
      >
        <GripVertical className="w-4 h-4" />
      </button>

      <button
        onClick={() => toggleTask(selectedProjectId, task.id)}
        className={cn(
          "w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all",
          task.completed
            ? "bg-primary border-primary text-white"
            : "border-border-strong hover:border-primary",
        )}
        aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
      >
        {task.completed && <Check className="w-3 h-3" strokeWidth={3} />}
      </button>

      {isEditing ? (
        <div className="flex-1 flex items-center gap-2 min-w-0">
          <input
            ref={inputRef}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") handleCancel();
            }}
            className="flex-1 min-w-0 bg-surface-alt border border-border rounded-lg px-4 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <button
            onClick={handleSave}
            className="p-2 text-success hover:bg-success-soft rounded-lg transition-colors"
            aria-label="Save"
          >
            <CornerDownLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleCancel}
            className="p-2 text-text-muted hover:bg-surface-hover rounded-lg transition-colors"
            aria-label="Cancel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <>
          <span
            className={cn(
              "flex-1 text-sm leading-relaxed min-w-0 truncate transition-colors",
              task.completed ? "line-through text-text-faint" : "text-text",
            )}
          >
            {task.text}
          </span>
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-text-muted hover:text-primary hover:bg-primary-soft rounded-lg transition-colors"
              aria-label="Edit task"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                deleteTask(selectedProjectId, task.id);
                toast.success("Task deleted");
              }}
              className="p-2 text-text-muted hover:text-danger hover:bg-danger-soft rounded-lg transition-colors"
              aria-label="Delete task"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </>
      )}
    </li>
  );
}
