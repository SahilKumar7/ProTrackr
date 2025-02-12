import { forwardRef, useImperativeHandle, useRef, useId } from "react";
import { createPortal } from "react-dom";
import Button from "./Button";

const Modal = forwardRef(function Modal(
  { children, title, buttonCaption = "Close" },
  ref,
) {
  const dialog = useRef();
  const titleId = useId();

  useImperativeHandle(ref, () => ({
    open: () => dialog.current?.showModal(),
    close: () => dialog.current?.close(),
  }));

  return createPortal(
    <dialog
      ref={dialog}
      aria-labelledby={titleId}
      className="backdrop:bg-black/50 backdrop:backdrop-blur-sm p-0 rounded-xl shadow-2xl bg-surface border border-border max-w-md w-[calc(100%-2rem)] mx-auto"
    >
      <div className="p-6">
        {title && (
          <h2 id={titleId} className="text-lg font-semibold text-text mb-2">
            {title}
          </h2>
        )}
        <div className="text-text-muted text-sm">{children}</div>
      </div>
      <form method="dialog" className="px-6 pb-5 flex justify-end">
        <Button variant="secondary" size="sm">
          {buttonCaption}
        </Button>
      </form>
    </dialog>,
    document.getElementById("modal-root"),
  );
});

export default Modal;
