/**
 * lineWrapState.ts
 * Manages line-wrapping behaviour for the diff view.
 * When wrap is enabled, long lines are broken at a configurable column width.
 */

export type LineWrapState = {
  enabled: boolean;
  columnWidth: number;
};

export function createLineWrapState(columnWidth = 120): LineWrapState {
  return { enabled: false, columnWidth };
}

export function toggleWrap(state: LineWrapState): LineWrapState {
  return { ...state, enabled: !state.enabled };
}

export function setColumnWidth(state: LineWrapState, width: number): LineWrapState {
  if (width < 20) throw new RangeError(`columnWidth must be >= 20, got ${width}`);
  return { ...state, columnWidth: width };
}

/**
 * Wraps a single line at `columnWidth` characters.
 * Preserves a leading indent on continuation lines equal to the original
 * indentation so diffs remain readable.
 */
export function wrapLine(line: string, columnWidth: number): string[] {
  if (line.length <= columnWidth) return [line];

  const indent = line.match(/^(\s*)/)?.[1] ?? '';
  const continuation = indent + '  ';
  const result: string[] = [];
  let remaining = line;

  while (remaining.length > columnWidth) {
    result.push(remaining.slice(0, columnWidth));
    remaining = continuation + remaining.slice(columnWidth).trimStart();
  }
  if (remaining.length > 0) result.push(remaining);
  return result;
}

/**
 * Applies wrapping to every line in the array when the state has wrap enabled.
 * Returns the original array unchanged when wrap is disabled.
 */
export function applyWrapToLines(lines: string[], state: LineWrapState): string[] {
  if (!state.enabled) return lines;
  return lines.flatMap((line) => wrapLine(line, state.columnWidth));
}
