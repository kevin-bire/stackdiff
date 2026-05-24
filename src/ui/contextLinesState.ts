/**
 * contextLinesState — controls how many lines of context are shown
 * around each diff hunk in the unified diff view.
 */

export interface ContextLinesState {
  count: number;
  min: number;
  max: number;
}

export function createContextLinesState(
  initial = 3,
  min = 0,
  max = 10
): ContextLinesState {
  return { count: clamp(initial, min, max), min, max };
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function increaseContext(state: ContextLinesState): ContextLinesState {
  return { ...state, count: clamp(state.count + 1, state.min, state.max) };
}

export function decreaseContext(state: ContextLinesState): ContextLinesState {
  return { ...state, count: clamp(state.count - 1, state.min, state.max) };
}

export function setContextLines(
  state: ContextLinesState,
  count: number
): ContextLinesState {
  return { ...state, count: clamp(count, state.min, state.max) };
}

export function resetContextLines(state: ContextLinesState): ContextLinesState {
  return { ...state, count: 3 };
}

/**
 * Given an array of line indices that are "changed" and the total number of
 * lines, returns a Set of line indices that should be visible (changed lines
 * plus `count` lines of context on either side).
 */
export function computeVisibleIndices(
  changedIndices: number[],
  totalLines: number,
  count: number
): Set<number> {
  const visible = new Set<number>();
  for (const idx of changedIndices) {
    for (let i = idx - count; i <= idx + count; i++) {
      if (i >= 0 && i < totalLines) {
        visible.add(i);
      }
    }
  }
  return visible;
}

/**
 * Filters an array of lines to only those that are visible given the context
 * state, inserting a "..." separator line between non-contiguous hunks.
 */
export function applyContextToLines(
  lines: string[],
  changedIndices: number[],
  state: ContextLinesState
): string[] {
  if (lines.length === 0) return [];
  const visible = computeVisibleIndices(changedIndices, lines.length, state.count);
  const result: string[] = [];
  let lastIncluded = -1;
  for (let i = 0; i < lines.length; i++) {
    if (visible.has(i)) {
      if (lastIncluded !== -1 && i > lastIncluded + 1) {
        result.push("...");
      }
      result.push(lines[i]);
      lastIncluded = i;
    }
  }
  return result;
}
