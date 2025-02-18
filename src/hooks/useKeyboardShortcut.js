import { useEffect } from "react";

/**
 * Register a global keyboard shortcut.
 * @param {string} key - The key to listen for (e.g. "n")
 * @param {() => void} callback
 * @param {{ ctrl?: boolean, shift?: boolean }} opts
 */
export default function useKeyboardShortcut(key, callback, opts = {}) {
  useEffect(() => {
    function handler(e) {
      const ctrlMatch = opts.ctrl ? e.ctrlKey || e.metaKey : true;
      const shiftMatch = opts.shift ? e.shiftKey : true;

      if (e.key.toLowerCase() === key.toLowerCase() && ctrlMatch && shiftMatch) {
        const tag = e.target.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
        e.preventDefault();
        callback();
      }
    }

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [key, callback, opts.ctrl, opts.shift]);
}
