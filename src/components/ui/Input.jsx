import { forwardRef, useId } from "react";
import { cn } from "../../lib/utils";

const Input = forwardRef(function Input(
  { label, isTextArea, error, className, ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = props.id ?? generatedId;

  const inputClasses = cn(
    "w-full px-4 py-2.5 rounded-lg border bg-surface text-text placeholder:text-text-faint transition-colors duration-150 text-sm",
    error ? "border-danger" : "border-border focus:border-primary",
    "focus:outline-none focus:ring-2 focus:ring-primary/20",
    className,
  );

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-text-muted"
        >
          {label}
        </label>
      )}
      {isTextArea ? (
        <textarea
          ref={ref}
          id={inputId}
          className={cn(inputClasses, "min-h-[100px] resize-y")}
          {...props}
        />
      ) : (
        <input ref={ref} id={inputId} className={inputClasses} {...props} />
      )}
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
});

export default Input;
