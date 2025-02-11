import { create } from "zustand";
import { persist } from "zustand/middleware";
import { generateId } from "../lib/utils";

/**
 * @typedef {{ id: string, title: string, description: string, dueDate: string, createdAt: string }} Project
 * @typedef {{ id: string, projectId: string, text: string, completed: boolean, order: number }} Task
 */

const useProjectStore = create(
  persist(
    (set, get) => ({
      projects: [],
      tasks: [],
      selectedProjectId: undefined,
      view: "default", // "default" | "form" | "project"

      // ── Selectors ──────────────────────────────────
      getSelectedProject: () => {
        const { projects, selectedProjectId } = get();
        return projects.find((p) => p.id === selectedProjectId) ?? null;
      },

      getTasksForProject: (projectId) => {
        return get()
          .tasks.filter((t) => t.projectId === projectId)
          .sort((a, b) => a.order - b.order);
      },

      // ── Project actions ────────────────────────────
      startAddProject: () => set({ view: "form", selectedProjectId: undefined }),

      cancelAddProject: () => set({ view: "default" }),

      addProject: ({ title, description, dueDate }) => {
        const id = generateId();
        set((s) => ({
          projects: [
            ...s.projects,
            { id, title, description, dueDate, createdAt: new Date().toISOString() },
          ],
          selectedProjectId: id,
          view: "project",
        }));
        return id;
      },

      selectProject: (id) => set({ selectedProjectId: id, view: "project" }),

      deleteProject: (id) =>
        set((s) => ({
          projects: s.projects.filter((p) => p.id !== id),
          tasks: s.tasks.filter((t) => t.projectId !== id),
          selectedProjectId:
            s.selectedProjectId === id ? undefined : s.selectedProjectId,
          view: s.selectedProjectId === id ? "default" : s.view,
        })),

      // ── Task actions ───────────────────────────────
      addTask: (projectId, text) => {
        const existingTasks = get().tasks.filter((t) => t.projectId === projectId);
        const order = existingTasks.length;
        set((s) => ({
          tasks: [
            ...s.tasks,
            { id: generateId(), projectId, text, completed: false, order },
          ],
        }));
      },

      deleteTask: (taskId) =>
        set((s) => ({ tasks: s.tasks.filter((t) => t.id !== taskId) })),

      toggleTask: (taskId) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === taskId ? { ...t, completed: !t.completed } : t,
          ),
        })),

      editTask: (taskId, newText) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === taskId ? { ...t, text: newText } : t,
          ),
        })),

      reorderTasks: (projectId, orderedIds) =>
        set((s) => ({
          tasks: s.tasks.map((t) => {
            if (t.projectId !== projectId) return t;
            const idx = orderedIds.indexOf(t.id);
            return idx >= 0 ? { ...t, order: idx } : t;
          }),
        })),
    }),
    {
      name: "protrackr-projects",
      version: 1,
    },
  ),
);

export default useProjectStore;
