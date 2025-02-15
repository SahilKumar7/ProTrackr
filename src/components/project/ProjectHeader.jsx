import { useRef } from "react";
import { Trash2, CalendarDays } from "lucide-react";
import { toast } from "sonner";
import useProjectStore from "../../store/projectStore";
import { formatDate, getProgress } from "../../lib/utils";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import ConfirmDialog from "../ui/ConfirmDialog";

export default function ProjectHeader() {
  const project = useProjectStore((s) => s.getSelectedProject());
  const tasks = useProjectStore((s) =>
    s.getTasksForProject(s.selectedProjectId),
  );
  const deleteProject = useProjectStore((s) => s.deleteProject);
  const confirmRef = useRef();

  if (!project) return null;

  const { total, done, percent } = getProgress(tasks);

  function handleDelete() {
    deleteProject(project.id);
    toast.success(`"${project.title}" deleted`);
  }

  const badgeColor =
    percent === 100 ? "success" : percent > 0 ? "primary" : "default";

  return (
    <>
      <ConfirmDialog
        ref={confirmRef}
        title="Delete project?"
        description={`"${project.title}" and all its tasks will be permanently removed.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
      />

      <header className="bg-surface-card rounded-xl border border-border shadow-sm p-6 md:p-8 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-text truncate">
              {project.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <span className="flex items-center gap-1.5 text-sm text-text-muted">
                <CalendarDays className="w-4 h-4" />
                {formatDate(project.dueDate)}
              </span>
              <Badge color={badgeColor}>
                {done}/{total} tasks
              </Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => confirmRef.current.open()}
            aria-label="Delete project"
            className="text-danger hover:bg-danger-soft shrink-0"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </div>

        {total > 0 && (
          <div className="mt-6 flex items-center gap-3">
            <div className="flex-1 h-2 rounded-full bg-surface-alt overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${percent}%` }}
              />
            </div>
            <span className="text-sm font-medium text-text-muted tabular-nums w-10 text-right">
              {percent}%
            </span>
          </div>
        )}

        <p className="mt-6 pt-6 border-t border-border text-sm text-text-muted whitespace-pre-wrap leading-relaxed">
          {project.description}
        </p>
      </header>
    </>
  );
}
