import { useRef, useState } from "react";
import { toast } from "sonner";
import useProjectStore from "../../store/projectStore";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Modal from "../ui/Modal";

export default function ProjectForm() {
  const addProject = useProjectStore((s) => s.addProject);
  const cancelAddProject = useProjectStore((s) => s.cancelAddProject);

  const titleRef = useRef();
  const descriptionRef = useRef();
  const dueDateRef = useRef();
  const modal = useRef();

  const [errors, setErrors] = useState({});

  function handleSave() {
    const title = titleRef.current.value.trim();
    const description = descriptionRef.current.value.trim();
    const dueDate = dueDateRef.current.value;
    const newErrors = {};

    if (!title) newErrors.title = "Title is required";
    if (!description) newErrors.description = "Description is required";
    if (!dueDate) newErrors.dueDate = "Due date is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      modal.current.open();
      return;
    }

    addProject({ title, description, dueDate });
    toast.success("Project created");
  }

  return (
    <>
      <Modal ref={modal} title="Invalid Input" buttonCaption="Got it">
        <p>Please fill in all fields before saving.</p>
      </Modal>

      <div className="flex items-start justify-center min-h-full px-5 py-12 md:py-20">
        <div className="w-full max-w-lg bg-surface-card rounded-xl border border-border shadow-sm p-8 md:p-10">
          <h2 className="text-2xl font-bold text-text mb-1">New Project</h2>
          <p className="text-sm text-text-muted mb-8">
            Fill in the details to create a new project.
          </p>

          <div className="space-y-6">
            <Input
              ref={titleRef}
              label="Title"
              type="text"
              placeholder="e.g. Website Redesign"
              error={errors.title}
            />
            <Input
              ref={descriptionRef}
              label="Description"
              isTextArea
              placeholder="What's this project about?"
              error={errors.description}
            />
            <Input
              ref={dueDateRef}
              label="Due Date"
              type="date"
              error={errors.dueDate}
            />
          </div>

          <div className="flex items-center justify-end gap-3 mt-10 pt-6 border-t border-border">
            <Button variant="secondary" onClick={cancelAddProject}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Project</Button>
          </div>
        </div>
      </div>
    </>
  );
}
