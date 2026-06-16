import { useEffect, useId, useRef, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { cn, formatDate, isSameDay, startOfToday, toISODate } from "../../lib/utils";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** Parse a local `YYYY-MM-DD` string into a Date at local midnight. */
function parseISO(str) {
  if (!str) return null;
  const [year, month, day] = str.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function addMonths(date, delta) {
  return new Date(date.getFullYear(), date.getMonth() + delta, 1);
}

function addDays(date, delta) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + delta);
}

/**
 * Themed date picker with a calendar popup.
 * @param {{
 *   label?: string,
 *   value?: string,
 *   onChange?: (value: string) => void,
 *   error?: string,
 *   minDate?: Date,
 * }} props
 */
export default function DatePicker({ label, value, onChange, error, minDate }) {
  const min = minDate ?? startOfToday();
  const selected = parseISO(value);

  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(
    () => selected ?? startOfToday(),
  );
  const [focusedDate, setFocusedDate] = useState(
    () => selected ?? startOfToday(),
  );

  const containerRef = useRef(null);
  const gridRef = useRef(null);
  const inputId = useId();

  useEffect(() => {
    if (!open) return;
    function handlePointer(event) {
      if (!containerRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handlePointer);
    return () => document.removeEventListener("mousedown", handlePointer);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const start = selected ?? startOfToday();
    setViewDate(start);
    setFocusedDate(start);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const iso = toISODate(focusedDate);
    const btn = gridRef.current?.querySelector(`[data-date="${iso}"]`);
    btn?.focus();
  }, [open, focusedDate]);

  function moveFocus(nextDate) {
    setFocusedDate(nextDate);
    if (
      nextDate.getMonth() !== viewDate.getMonth() ||
      nextDate.getFullYear() !== viewDate.getFullYear()
    ) {
      setViewDate(new Date(nextDate.getFullYear(), nextDate.getMonth(), 1));
    }
  }

  function selectDay(day) {
    if (day < min) return;
    onChange?.(toISODate(day));
    setOpen(false);
  }

  function handleGridKeyDown(event) {
    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        moveFocus(addDays(focusedDate, -1));
        break;
      case "ArrowRight":
        event.preventDefault();
        moveFocus(addDays(focusedDate, 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        moveFocus(addDays(focusedDate, -7));
        break;
      case "ArrowDown":
        event.preventDefault();
        moveFocus(addDays(focusedDate, 7));
        break;
      case "PageUp":
        event.preventDefault();
        moveFocus(addMonths(focusedDate, -1));
        break;
      case "PageDown":
        event.preventDefault();
        moveFocus(addMonths(focusedDate, 1));
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        selectDay(focusedDate);
        break;
      case "Escape":
        event.preventDefault();
        setOpen(false);
        break;
      default:
        break;
    }
  }

  const firstOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  const leadingBlanks = firstOfMonth.getDay();
  const daysInMonth = new Date(
    viewDate.getFullYear(),
    viewDate.getMonth() + 1,
    0,
  ).getDate();
  const today = startOfToday();

  const cells = [];
  for (let i = 0; i < leadingBlanks; i += 1) cells.push(null);
  for (let d = 1; d <= daysInMonth; d += 1) {
    cells.push(new Date(viewDate.getFullYear(), viewDate.getMonth(), d));
  }

  const triggerClasses = cn(
    "w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-lg border bg-surface text-sm text-left transition-colors duration-150 cursor-pointer",
    error ? "border-danger" : "border-border focus:border-primary",
    "focus:outline-none focus:ring-2 focus:ring-primary/20",
  );

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-text-muted">
          {label}
        </label>
      )}

      <div ref={containerRef} className="relative">
        <button
          type="button"
          id={inputId}
          className={triggerClasses}
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
        >
          <span className={selected ? "text-text" : "text-text-faint"}>
            {selected ? formatDate(value) : "Select a date"}
          </span>
          <Calendar className="w-4 h-4 text-text-muted shrink-0" />
        </button>

        {open && (
          <div
            role="dialog"
            aria-label="Choose date"
            className="absolute left-0 top-full mt-2 z-20 w-72 p-3 rounded-lg border border-border bg-surface-card shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <button
                type="button"
                aria-label="Previous month"
                className="p-1.5 rounded-md text-text-muted hover:bg-surface-hover hover:text-text transition-colors cursor-pointer"
                onClick={() => setViewDate((v) => addMonths(v, -1))}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-semibold text-text">
                {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
              </span>
              <button
                type="button"
                aria-label="Next month"
                className="p-1.5 rounded-md text-text-muted hover:bg-surface-hover hover:text-text transition-colors cursor-pointer"
                onClick={() => setViewDate((v) => addMonths(v, 1))}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-7 mb-1">
              {WEEKDAYS.map((day) => (
                <span
                  key={day}
                  className="h-8 flex items-center justify-center text-xs font-medium text-text-faint"
                >
                  {day}
                </span>
              ))}
            </div>

            <div
              ref={gridRef}
              role="grid"
              className="grid grid-cols-7 gap-0.5"
              onKeyDown={handleGridKeyDown}
            >
              {cells.map((day, index) => {
                if (!day) return <span key={`blank-${index}`} className="h-9" />;

                const iso = toISODate(day);
                const isSelected = selected && isSameDay(day, selected);
                const isToday = isSameDay(day, today);
                const isDisabled = day < min;
                const isFocusTarget = isSameDay(day, focusedDate);

                return (
                  <button
                    key={iso}
                    type="button"
                    data-date={iso}
                    role="gridcell"
                    aria-selected={isSelected || undefined}
                    aria-label={formatDate(iso)}
                    disabled={isDisabled}
                    tabIndex={isFocusTarget ? 0 : -1}
                    onClick={() => selectDay(day)}
                    className={cn(
                      "h-9 flex items-center justify-center text-sm rounded-md transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40",
                      isDisabled && "opacity-40 pointer-events-none",
                      isSelected && "bg-primary text-white font-semibold",
                      !isSelected && isToday && "border border-primary text-primary",
                      !isSelected && !isToday && "text-text hover:bg-surface-hover",
                    )}
                  >
                    {day.getDate()}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
