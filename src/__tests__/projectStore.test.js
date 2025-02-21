import { describe, it, expect, beforeEach } from "vitest";
import useProjectStore from "../store/projectStore";

describe("projectStore", () => {
  beforeEach(() => {
    useProjectStore.setState({
      projects: [],
      tasks: [],
      selectedProjectId: undefined,
      view: "default",
    });
  });

  it("adds a project and selects it", () => {
    const id = useProjectStore.getState().addProject({
      title: "Test",
      description: "Desc",
      dueDate: "2026-12-31",
    });

    const state = useProjectStore.getState();
    expect(state.projects).toHaveLength(1);
    expect(state.projects[0].title).toBe("Test");
    expect(state.selectedProjectId).toBe(id);
    expect(state.view).toBe("project");
  });

  it("deletes a project and its tasks", () => {
    const id = useProjectStore.getState().addProject({
      title: "To Delete",
      description: "x",
      dueDate: "2026-01-01",
    });

    useProjectStore.getState().addTask(id, "Task A");
    useProjectStore.getState().addTask(id, "Task B");
    expect(useProjectStore.getState().tasks).toHaveLength(2);

    useProjectStore.getState().deleteProject(id);
    const state = useProjectStore.getState();
    expect(state.projects).toHaveLength(0);
    expect(state.tasks).toHaveLength(0);
    expect(state.selectedProjectId).toBeUndefined();
    expect(state.view).toBe("default");
  });

  it("scopes tasks to their project", () => {
    const id1 = useProjectStore.getState().addProject({
      title: "P1",
      description: "x",
      dueDate: "2026-01-01",
    });
    const id2 = useProjectStore.getState().addProject({
      title: "P2",
      description: "y",
      dueDate: "2026-01-01",
    });

    useProjectStore.getState().addTask(id1, "P1 Task");
    useProjectStore.getState().addTask(id2, "P2 Task");

    const p1Tasks = useProjectStore.getState().getTasksForProject(id1);
    const p2Tasks = useProjectStore.getState().getTasksForProject(id2);

    expect(p1Tasks).toHaveLength(1);
    expect(p1Tasks[0].text).toBe("P1 Task");
    expect(p2Tasks).toHaveLength(1);
    expect(p2Tasks[0].text).toBe("P2 Task");
  });

  it("toggles task completion", () => {
    const id = useProjectStore.getState().addProject({
      title: "P",
      description: "x",
      dueDate: "2026-01-01",
    });
    useProjectStore.getState().addTask(id, "Do thing");

    const taskId = useProjectStore.getState().tasks[0].id;
    expect(useProjectStore.getState().tasks[0].completed).toBe(false);

    useProjectStore.getState().toggleTask(taskId);
    expect(useProjectStore.getState().tasks[0].completed).toBe(true);

    useProjectStore.getState().toggleTask(taskId);
    expect(useProjectStore.getState().tasks[0].completed).toBe(false);
  });

  it("edits task text", () => {
    const id = useProjectStore.getState().addProject({
      title: "P",
      description: "x",
      dueDate: "2026-01-01",
    });
    useProjectStore.getState().addTask(id, "Original");

    const taskId = useProjectStore.getState().tasks[0].id;
    useProjectStore.getState().editTask(taskId, "Updated");
    expect(useProjectStore.getState().tasks[0].text).toBe("Updated");
  });

  it("reorders tasks", () => {
    const id = useProjectStore.getState().addProject({
      title: "P",
      description: "x",
      dueDate: "2026-01-01",
    });
    useProjectStore.getState().addTask(id, "A");
    useProjectStore.getState().addTask(id, "B");
    useProjectStore.getState().addTask(id, "C");

    const tasks = useProjectStore.getState().getTasksForProject(id);
    const ids = tasks.map((t) => t.id);
    // Reverse order
    useProjectStore.getState().reorderTasks(id, [ids[2], ids[1], ids[0]]);

    const reordered = useProjectStore.getState().getTasksForProject(id);
    expect(reordered[0].text).toBe("C");
    expect(reordered[1].text).toBe("B");
    expect(reordered[2].text).toBe("A");
  });

  it("getSelectedProject returns null for unknown ID", () => {
    useProjectStore.setState({ selectedProjectId: "nonexistent" });
    expect(useProjectStore.getState().getSelectedProject()).toBeNull();
  });
});
