import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import useProjectStore from "../../store/projectStore";

export default function TaskInput() {
  const [text, setText] = useState("");
  const selectedProjectId = useProjectStore((s) => s.selectedProjectId);
  const addTask = useProjectStore((s) => s.addTask);

  function handleAdd() {
    const trimmed = text.trim();
    if (!trimmed) {
      toast.error("Enter a task first");
      return;
    }
    addTask(selectedProjectId, trimmed);
    setText("");
    toast.success("Task added");
  }

  return (
    <div className="flex items-center gap-2 bg-surface-alt border border-border rounded-lg p-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        className="flex-1 min-w-0 bg-transparent text-sm text-text placeholder:text-text-faint px-4 py-2.5 focus:outline-none"
        placeholder="Add a task..."
      />
      <button
        onClick={handleAdd}
        className="flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors shrink-0 cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        Add
      </button>
    </div>
  );
}
