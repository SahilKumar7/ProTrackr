import { useState } from "react";
import { FolderKanban, Plus, Search, X, Menu } from "lucide-react";
import useProjectStore from "../../store/projectStore";
import { getProgress, cn } from "../../lib/utils";
import ThemeToggle from "./ThemeToggle";

export default function Sidebar() {
  const projects = useProjectStore((s) => s.projects);
  const tasks = useProjectStore((s) => s.tasks);
  const selectedProjectId = useProjectStore((s) => s.selectedProjectId);
  const selectProject = useProjectStore((s) => s.selectProject);
  const startAddProject = useProjectStore((s) => s.startAddProject);

  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const filtered = search.trim()
    ? projects.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase()),
      )
    : projects;

  function handleSelect(id) {
    selectProject(id);
    setMobileOpen(false);
  }

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between px-5 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center">
            <FolderKanban className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-lg font-bold text-sidebar-text tracking-tight">
            ProTrackr
          </h1>
        </div>
        <button
          className="md:hidden text-sidebar-muted hover:text-sidebar-text cursor-pointer"
          onClick={() => setMobileOpen(false)}
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sidebar-muted" />
          <input
            type="text"
            placeholder="Search projects..."
            aria-label="Search projects"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-sidebar-hover text-sidebar-text placeholder:text-sidebar-muted text-sm border-none focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
      </div>

      <div className="px-4 pb-4">
        <button
          onClick={() => {
            startAddProject();
            setMobileOpen(false);
          }}
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg text-sm font-medium bg-primary/15 text-primary hover:bg-primary/25 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      <div className="mx-4 border-t border-white/10" />

      <nav
        className="flex-1 overflow-y-auto px-3 pt-3 pb-1"
        aria-label="Projects"
      >
        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-sidebar-muted">
          Projects
        </p>
        <ul className="space-y-0.5">
          {filtered.map((project) => {
            const projectTasks = tasks.filter(
              (t) => t.projectId === project.id,
            );
            const { percent } = getProgress(projectTasks);
            const isActive = project.id === selectedProjectId;

            return (
              <li key={project.id}>
                <button
                  onClick={() => handleSelect(project.id)}
                  className={cn(
                    "w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer",
                    isActive
                      ? "bg-sidebar-hover text-sidebar-text font-medium"
                      : "text-sidebar-muted hover:text-sidebar-text hover:bg-sidebar-hover",
                  )}
                >
                  <span className="block truncate">{project.title}</span>
                  {projectTasks.length > 0 && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-300"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="text-xs text-sidebar-muted tabular-nums">
                        {percent}%
                      </span>
                    </div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
        {filtered.length === 0 && projects.length > 0 && (
          <p className="text-xs text-sidebar-muted text-center py-8">
            No projects match &ldquo;{search}&rdquo;
          </p>
        )}
      </nav>

      <div className="px-3 py-3 border-t border-white/10">
        <ThemeToggle />
      </div>
    </>
  );

  return (
    <>
      <button
        className="fixed top-4 left-4 z-40 md:hidden p-2.5 rounded-lg bg-surface border border-border shadow-md cursor-pointer"
        onClick={() => setMobileOpen(true)}
        aria-label="Open sidebar"
      >
        <Menu className="w-5 h-5 text-text" />
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed md:static z-50 top-0 left-0 h-full w-72 bg-sidebar flex flex-col transition-transform duration-200",
          "md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
