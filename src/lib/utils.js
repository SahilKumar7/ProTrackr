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
