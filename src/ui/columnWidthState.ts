/**
 * columnWidthState.ts
 * Manages dynamic column width allocation for the side-by-side diff panel view.
 */

export interface ColumnWidthState {
  totalWidth: number;
  leftRatio: number; // 0.0 – 1.0
  minColumnWidth: number;
}

export interface ColumnWidths {
  left: number;
  right: number;
  separator: number;
}

const DEFAULT_RATIO = 0.5;
const MIN_COLUMN_WIDTH = 10;
const SEPARATOR_WIDTH = 1;

export function createColumnWidthState(
  totalWidth: number,
  leftRatio = DEFAULT_RATIO,
  minColumnWidth = MIN_COLUMN_WIDTH
): ColumnWidthState {
  return {
    totalWidth: Math.max(totalWidth, minColumnWidth * 2 + SEPARATOR_WIDTH),
    leftRatio: clampRatio(leftRatio),
    minColumnWidth,
  };
}

export function getColumnWidths(state: ColumnWidthState): ColumnWidths {
  const usable = state.totalWidth - SEPARATOR_WIDTH;
  const rawLeft = Math.floor(usable * state.leftRatio);
  const left = Math.max(rawLeft, state.minColumnWidth);
  const right = Math.max(usable - left, state.minColumnWidth);
  return { left, right, separator: SEPARATOR_WIDTH };
}

export function setTotalWidth(
  state: ColumnWidthState,
  totalWidth: number
): ColumnWidthState {
  return {
    ...state,
    totalWidth: Math.max(totalWidth, state.minColumnWidth * 2 + SEPARATOR_WIDTH),
  };
}

export function adjustRatio(
  state: ColumnWidthState,
  delta: number
): ColumnWidthState {
  return {
    ...state,
    leftRatio: clampRatio(state.leftRatio + delta),
  };
}

export function resetRatio(state: ColumnWidthState): ColumnWidthState {
  return { ...state, leftRatio: DEFAULT_RATIO };
}

export function formatColumnDivider(width: number, char = "│"): string {
  return char.padStart(1).padEnd(1);
}

function clampRatio(ratio: number): number {
  return Math.min(1, Math.max(0, ratio));
}
