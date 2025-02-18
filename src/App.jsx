import { useEffect } from "react";
import { Toaster } from "sonner";
import { FolderOpen } from "lucide-react";
import useProjectStore from "./store/projectStore";
import useThemeStore from "./store/themeStore";
import useKeyboardShortcut from "./hooks/useKeyboardShortcut";
import Sidebar from "./components/layout/Sidebar";
import ProjectForm from "./components/project/ProjectForm";
import ProjectHeader from "./components/project/ProjectHeader";
import TaskList from "./components/task/TaskList";
import EmptyState from "./components/ui/EmptyState";
import { EMPTY_STATE } from "./lib/constants";

export default function App() {
  const view = useProjectStore((s) => s.view);
  const startAddProject = useProjectStore((s) => s.startAddProject);
  const theme = useThemeStore((s) => s.theme);
  const resolvedTheme = useThemeStore((s) => s.resolvedTheme);

  useEffect(() => {
    const resolved = resolvedTheme();
    document.documentElement.classList.toggle("dark", resolved === "dark");
  }, [theme, resolvedTheme]);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (useThemeStore.getState().theme === "system") {
        document.documentElement.classList.toggle("dark", mql.matches);
      }
    };
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  useKeyboardShortcut("n", startAddProject, { ctrl: true });

  let content;
  if (view === "form") {
    content = <ProjectForm />;
  } else if (view === "project") {
    content = (
      <div className="w-full max-w-2xl mx-auto px-5 md:px-8 py-8 md:py-12">
        <ProjectHeader />
        <TaskList />
      </div>
    );
  } else {
    content = (
      <div className="flex items-center justify-center h-full">
        <EmptyState
          icon={FolderOpen}
          title={EMPTY_STATE.noProjects.title}
          description={EMPTY_STATE.noProjects.description}
          actionLabel="Create New Project"
          onAction={startAddProject}
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-surface-alt">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">{content}</main>
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: "!bg-surface-card !text-text !border !border-border !shadow-lg",
        }}
      />
    </div>
  );
}
