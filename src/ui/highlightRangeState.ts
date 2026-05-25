/**
 * highlightRangeState — tracks user-selected line ranges for bulk highlight/copy.
 */

export type HighlightRangeState = {
  anchorLine: number | null;
  activeLine: number | null;
  isSelecting: boolean;
};

export function createHighlightRangeState(): HighlightRangeState {
  return {
    anchorLine: null,
    activeLine: null,
    isSelecting: false,
  };
}

export function beginRange(
  state: HighlightRangeState,
  line: number
): HighlightRangeState {
  return { ...state, anchorLine: line, activeLine: line, isSelecting: true };
}

export function extendRange(
  state: HighlightRangeState,
  line: number
): HighlightRangeState {
  if (!state.isSelecting) return state;
  return { ...state, activeLine: line };
}

export function clearRange(state: HighlightRangeState): HighlightRangeState {
  return { anchorLine: null, activeLine: null, isSelecting: false };
}

export function getSelectedRange(
  state: HighlightRangeState
): [number, number] | null {
  if (state.anchorLine === null || state.activeLine === null) return null;
  const start = Math.min(state.anchorLine, state.activeLine);
  const end = Math.max(state.anchorLine, state.activeLine);
  return [start, end];
}

export function isLineInRange(
  state: HighlightRangeState,
  line: number
): boolean {
  const range = getSelectedRange(state);
  if (!range) return false;
  return line >= range[0] && line <= range[1];
}

export function getRangeLength(state: HighlightRangeState): number {
  const range = getSelectedRange(state);
  if (!range) return 0;
  return range[1] - range[0] + 1;
}
