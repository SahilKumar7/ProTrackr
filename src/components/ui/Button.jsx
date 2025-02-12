import { cn } from "../../lib/utils";

const variants = {
  primary:
    "bg-primary text-white hover:bg-primary-hover shadow-sm active:scale-[0.97]",
  secondary:
    "bg-surface-alt text-text-muted border border-border hover:bg-surface-hover active:scale-[0.97]",
  danger:
    "bg-danger text-white hover:bg-danger-hover shadow-sm active:scale-[0.97]",
  ghost:
    "text-text-muted hover:bg-surface-hover hover:text-text",
  icon:
    "p-2 text-text-muted hover:bg-surface-hover hover:text-text rounded-lg",
};

const sizes = {
  sm: "px-3.5 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

/**
 * @param {{ variant?: keyof variants, size?: keyof sizes, className?: string } & React.ButtonHTMLAttributes} props
 */
export default function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        variant !== "icon" && sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
