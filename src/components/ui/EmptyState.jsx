import Button from "./Button";

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-8 py-24">
      {Icon && (
        <div className="w-20 h-20 rounded-2xl bg-primary-soft flex items-center justify-center mb-8 shadow-sm">
          <Icon className="w-10 h-10 text-primary" strokeWidth={1.5} />
        </div>
      )}
      <h2 className="text-2xl font-semibold text-text mb-3">{title}</h2>
      <p className="text-sm text-text-muted max-w-sm mb-10 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button size="lg" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
