import { cn } from "../../lib/utils";

const colorMap = {
  default: "bg-surface-alt text-text-muted",
  primary: "bg-primary-soft text-primary",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
};

export default function Badge({ color = "default", children, className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
        colorMap[color],
        className,
      )}
    >
      {children}
    </span>
  );
}
