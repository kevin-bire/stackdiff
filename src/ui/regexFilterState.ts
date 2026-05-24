/**
 * regexFilterState — manages regex-based line filtering for the diff view.
 * Allows toggling regex mode, compiling patterns safely, and testing lines.
 */

export interface RegexFilterState {
  enabled: boolean;
  pattern: string;
  compiled: RegExp | null;
  error: string | null;
  invertMatch: boolean;
}

export function createRegexFilterState(): RegexFilterState {
  return {
    enabled: false,
    pattern: "",
    compiled: null,
    error: null,
    invertMatch: false,
  };
}

export function setRegexPattern(
  state: RegexFilterState,
  pattern: string
): RegexFilterState {
  if (!pattern) {
    return { ...state, pattern: "", compiled: null, error: null };
  }
  try {
    const compiled = new RegExp(pattern, "i");
    return { ...state, pattern, compiled, error: null };
  } catch (e) {
    return {
      ...state,
      pattern,
      compiled: null,
      error: e instanceof Error ? e.message : "Invalid regex",
    };
  }
}

export function toggleRegexFilter(state: RegexFilterState): RegexFilterState {
  return { ...state, enabled: !state.enabled };
}

export function toggleInvertMatch(state: RegexFilterState): RegexFilterState {
  return { ...state, invertMatch: !state.invertMatch };
}

export function testLine(state: RegexFilterState, line: string): boolean {
  if (!state.enabled || !state.compiled) return true;
  const matches = state.compiled.test(line);
  return state.invertMatch ? !matches : matches;
}

export function applyRegexFilter(
  state: RegexFilterState,
  lines: string[]
): string[] {
  if (!state.enabled || !state.compiled) return lines;
  return lines.filter((line) => testLine(state, line));
}

export function getRegexStatusText(state: RegexFilterState): string {
  if (!state.enabled) return "regex:off";
  if (state.error) return `regex:error(${state.error})`;
  if (!state.pattern) return "regex:on (no pattern)";
  const inv = state.invertMatch ? " [inverted]" : "";
  return `regex:/${state.pattern}/${inv}`;
}
