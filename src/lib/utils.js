/**
 * Merge class names, filtering out falsy values.
 * @param  {...(string|false|null|undefined)} classes
 * @returns {string}
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Format a date string using the browser's locale.
 * @param {string} dateStr - ISO date string or parseable date
 * @returns {string}
 */
export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Convert a Date to a local `YYYY-MM-DD` string.
 * Uses local getters (not toISOString) to avoid timezone off-by-one shifts.
 * @param {Date} date
 * @returns {string}
 */
export function toISODate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Whether two dates fall on the same calendar day.
 * @param {Date} a
 * @param {Date} b
 * @returns {boolean}
 */
export function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** @returns {Date} Today at local midnight. */
export function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

/** @returns {string} A UUID v4 string */
export function generateId() {
  return crypto.randomUUID();
}

/**
 * Compute completion stats for a list of tasks.
 * @param {Array<{completed: boolean}>} tasks
 * @returns {{ total: number, done: number, percent: number }}
 */
export function getProgress(tasks) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.completed).length;
  return { total, done, percent: total === 0 ? 0 : Math.round((done / total) * 100) };
}
