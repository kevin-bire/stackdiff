/**
 * virtualScrollState.ts
 * Manages virtual scrolling for large diffs — only renders visible lines.
 */

export interface VirtualScrollState {
  totalLines: number;
  viewportHeight: number;
  scrollOffset: number;
  overscan: number;
}

export interface VisibleWindow {
  startIndex: number;
  endIndex: number;
  lines: string[];
  paddingTop: number;
  paddingBottom: number;
}

export function createVirtualScrollState(
  totalLines: number,
  viewportHeight: number,
  overscan = 3
): VirtualScrollState {
  return {
    totalLines,
    viewportHeight,
    scrollOffset: 0,
    overscan,
  };
}

export function setTotalLines(state: VirtualScrollState, total: number): VirtualScrollState {
  const maxOffset = Math.max(0, total - state.viewportHeight);
  return {
    ...state,
    totalLines: total,
    scrollOffset: Math.min(state.scrollOffset, maxOffset),
  };
}

export function setViewportHeight(state: VirtualScrollState, height: number): VirtualScrollState {
  const maxOffset = Math.max(0, state.totalLines - height);
  return {
    ...state,
    viewportHeight: height,
    scrollOffset: Math.min(state.scrollOffset, maxOffset),
  };
}

export function virtualScrollTo(state: VirtualScrollState, index: number): VirtualScrollState {
  const clamped = Math.max(0, Math.min(index, Math.max(0, state.totalLines - state.viewportHeight)));
  return { ...state, scrollOffset: clamped };
}

export function virtualScrollBy(state: VirtualScrollState, delta: number): VirtualScrollState {
  return virtualScrollTo(state, state.scrollOffset + delta);
}

export function getVisibleWindow(state: VirtualScrollState, allLines: string[]): VisibleWindow {
  const { scrollOffset, viewportHeight, overscan, totalLines } = state;
  const startIndex = Math.max(0, scrollOffset - overscan);
  const endIndex = Math.min(totalLines, scrollOffset + viewportHeight + overscan);
  const lines = allLines.slice(startIndex, endIndex);
  const paddingTop = startIndex;
  const paddingBottom = Math.max(0, totalLines - endIndex);
  return { startIndex, endIndex, lines, paddingTop, paddingBottom };
}

export function getScrollPercent(state: VirtualScrollState): number {
  const max = Math.max(1, state.totalLines - state.viewportHeight);
  return Math.round((state.scrollOffset / max) * 100);
}
