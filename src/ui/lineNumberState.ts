export type LineNumberMode = 'none' | 'absolute' | 'relative';

export interface LineNumberState {
  mode: LineNumberMode;
  totalLines: number;
  currentLine: number;
  gutterWidth: number;
}

export function createLineNumberState(totalLines = 0): LineNumberState {
  return {
    mode: 'absolute',
    totalLines,
    currentLine: 0,
    gutterWidth: computeGutterWidth(totalLines),
  };
}

export function cycleLineNumberMode(state: LineNumberState): LineNumberState {
  const modes: LineNumberMode[] = ['none', 'absolute', 'relative'];
  const next = modes[(modes.indexOf(state.mode) + 1) % modes.length];
  return { ...state, mode: next };
}

export function setLineNumberMode(
  state: LineNumberState,
  mode: LineNumberMode
): LineNumberState {
  return { ...state, mode };
}

export function updateTotalLines(
  state: LineNumberState,
  totalLines: number
): LineNumberState {
  return { ...state, totalLines, gutterWidth: computeGutterWidth(totalLines) };
}

export function setCurrentLine(
  state: LineNumberState,
  currentLine: number
): LineNumberState {
  return { ...state, currentLine };
}

export function formatLineNumber(
  state: LineNumberState,
  absoluteIndex: number
): string {
  if (state.mode === 'none') return '';
  if (state.mode === 'absolute') {
    return String(absoluteIndex + 1).padStart(state.gutterWidth, ' ');
  }
  // relative
  const delta = absoluteIndex - state.currentLine;
  if (delta === 0) return String(absoluteIndex + 1).padStart(state.gutterWidth, ' ');
  return String(Math.abs(delta)).padStart(state.gutterWidth, ' ');
}

export function applyLineNumbers(
  state: LineNumberState,
  lines: string[]
): string[] {
  if (state.mode === 'none') return lines;
  return lines.map((line, i) => `${formatLineNumber(state, i)} ${line}`);
}

function computeGutterWidth(totalLines: number): number {
  return Math.max(3, String(totalLines).length);
}
