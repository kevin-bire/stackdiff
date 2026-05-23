export type ThemeMode = "dark" | "light" | "high-contrast";

export interface ThemeColors {
  added: string;
  removed: string;
  unchanged: string;
  header: string;
  border: string;
  statusBg: string;
  statusFg: string;
  highlight: string;
}

export interface ThemeState {
  mode: ThemeMode;
  colors: ThemeColors;
}

const THEMES: Record<ThemeMode, ThemeColors> = {
  dark: {
    added: "{green-fg}",
    removed: "{red-fg}",
    unchanged: "{white-fg}",
    header: "{cyan-fg}",
    border: "{blue-fg}",
    statusBg: "{blue-bg}",
    statusFg: "{white-fg}",
    highlight: "{yellow-fg}",
  },
  light: {
    added: "{green-fg}",
    removed: "{magenta-fg}",
    unchanged: "{black-fg}",
    header: "{blue-fg}",
    border: "{black-fg}",
    statusBg: "{white-bg}",
    statusFg: "{black-fg}",
    highlight: "{red-fg}",
  },
  "high-contrast": {
    added: "{bright-green-fg}",
    removed: "{bright-red-fg}",
    unchanged: "{bright-white-fg}",
    header: "{bright-cyan-fg}",
    border: "{bright-yellow-fg}",
    statusBg: "{black-bg}",
    statusFg: "{bright-white-fg}",
    highlight: "{bright-yellow-fg}",
  },
};

export function createThemeState(initial: ThemeMode = "dark"): ThemeState {
  return {
    mode: initial,
    colors: THEMES[initial],
  };
}

export function cycleTheme(state: ThemeState): ThemeState {
  const order: ThemeMode[] = ["dark", "light", "high-contrast"];
  const next = order[(order.indexOf(state.mode) + 1) % order.length];
  return setTheme(state, next);
}

export function setTheme(state: ThemeState, mode: ThemeMode): ThemeState {
  return { mode, colors: THEMES[mode] };
}

export function getThemeColor(
  state: ThemeState,
  key: keyof ThemeColors
): string {
  return state.colors[key];
}

export function applyThemeToLine(
  line: string,
  state: ThemeState
): string {
  if (line.startsWith("+")) return `${state.colors.added}${line}{/}`;
  if (line.startsWith("-")) return `${state.colors.removed}${line}{/}`;
  if (line.startsWith("#") || line.startsWith("["))
    return `${state.colors.header}${line}{/}`;
  return `${state.colors.unchanged}${line}{/}`;
}
