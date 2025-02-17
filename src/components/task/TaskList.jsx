import { DragDropProvider } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import { ClipboardList } from "lucide-react";
import useProjectStore from "../../store/projectStore";
import { EMPTY_STATE } from "../../lib/constants";
import TaskInput from "./TaskInput";
import TaskItem from "./TaskItem";

function SortableTask({ task, id }) {
  const { ref, isDragging } = useSortable({ id });

  return <TaskItem task={task} dragRef={ref} isDragging={isDragging} />;
}

export default function TaskList() {
  const selectedProjectId = useProjectStore((s) => s.selectedProjectId);
  const tasks = useProjectStore((s) =>
    s.getTasksForProject(s.selectedProjectId),
  );
  const reorderTasks = useProjectStore((s) => s.reorderTasks);

  function handleDragEnd(event) {
    const { source, target } = event.operation;
    if (!source || !target || source.id === target.id) return;

    const ids = tasks.map((t) => t.id);
    const oldIdx = ids.indexOf(source.id);
    const newIdx = ids.indexOf(target.id);
    if (oldIdx < 0 || newIdx < 0) return;

    const reordered = [...ids];
    const [moved] = reordered.splice(oldIdx, 1);
    reordered.splice(newIdx, 0, moved);

    reorderTasks(selectedProjectId, reordered);
  }

  return (
    <section className="bg-surface-card rounded-xl border border-border shadow-sm p-6 md:p-8">
      <h2 className="text-lg font-semibold text-text mb-5">Tasks</h2>
      <TaskInput />

      {tasks.length === 0 ? (
        <div className="flex flex-col items-center py-14 text-center">
          <ClipboardList className="w-10 h-10 text-text-faint mb-3" strokeWidth={1.5} />
          <p className="text-sm font-medium text-text-muted">
            {EMPTY_STATE.noTasks.title}
          </p>
          <p className="text-xs text-text-faint mt-1.5 max-w-xs">
            {EMPTY_STATE.noTasks.description}
          </p>
        </div>
      ) : (
        <DragDropProvider onDragEnd={handleDragEnd}>
          <ul className="mt-5 divide-y divide-border">
            {tasks.map((task) => (
              <SortableTask key={task.id} id={task.id} task={task} />
            ))}
          </ul>
        </DragDropProvider>
      )}
    </section>
  );
}
