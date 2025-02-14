import { Sun, Moon, Monitor } from "lucide-react";
import useThemeStore from "../../store/themeStore";

const icons = { light: Sun, dark: Moon, system: Monitor };
const labels = { light: "Light", dark: "Dark", system: "System" };

export default function ThemeToggle() {
  const theme = useThemeStore((s) => s.theme);
  const cycleTheme = useThemeStore((s) => s.cycleTheme);
  const Icon = icons[theme];

  return (
    <button
      onClick={cycleTheme}
      aria-label={`Theme: ${labels[theme]}. Click to cycle.`}
      title={`Theme: ${labels[theme]}`}
      className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm text-sidebar-muted hover:text-sidebar-text hover:bg-sidebar-hover transition-colors cursor-pointer"
    >
      <Icon className="w-4 h-4" />
      <span>{labels[theme]}</span>
    </button>
  );
}
