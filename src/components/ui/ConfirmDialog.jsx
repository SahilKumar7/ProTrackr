import { forwardRef, useImperativeHandle, useRef, useId } from "react";
import { createPortal } from "react-dom";
import Button from "./Button";

const ConfirmDialog = forwardRef(function ConfirmDialog(
  { title, description, confirmLabel = "Delete", onConfirm },
  ref,
) {
  const dialog = useRef();
  const titleId = useId();

  useImperativeHandle(ref, () => ({
    open: () => dialog.current?.showModal(),
    close: () => dialog.current?.close(),
  }));

  function handleConfirm() {
    onConfirm?.();
    dialog.current?.close();
  }

  return createPortal(
    <dialog
      ref={dialog}
      aria-labelledby={titleId}
      className="backdrop:bg-black/50 backdrop:backdrop-blur-sm p-0 rounded-xl shadow-2xl bg-surface border border-border max-w-sm w-[calc(100%-2rem)] mx-auto"
    >
      <div className="p-6">
        <h2 id={titleId} className="text-lg font-semibold text-text mb-1">
          {title}
        </h2>
        <p className="text-sm text-text-muted">{description}</p>
      </div>
      <div className="px-6 pb-5 flex justify-end gap-3">
        <form method="dialog">
          <Button variant="secondary" size="sm">
            Cancel
          </Button>
        </form>
        <Button variant="danger" size="sm" onClick={handleConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </dialog>,
    document.getElementById("modal-root"),
  );
});

export default ConfirmDialog;
