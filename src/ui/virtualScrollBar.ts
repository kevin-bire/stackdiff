/**
 * virtualScrollBar.ts
 * Builds a text-based vertical scroll bar for the virtual scroll state.
 */

import { VirtualScrollState, getScrollPercent } from './virtualScrollState';

export interface ScrollBarOptions {
  height: number;
  trackChar?: string;
  thumbChar?: string;
  topCap?: string;
  bottomCap?: string;
}

export function buildScrollBar(
  state: VirtualScrollState,
  opts: ScrollBarOptions
): string[] {
  const {
    height,
    trackChar = '│',
    thumbChar = '█',
    topCap = '▲',
    bottomCap = '▼',
  } = opts;

  if (height < 3) return Array(height).fill(trackChar);

  const innerHeight = height - 2; // subtract caps
  const thumbSize = Math.max(
    1,
    Math.round((state.viewportHeight / Math.max(1, state.totalLines)) * innerHeight)
  );
  const percent = getScrollPercent(state) / 100;
  const maxThumbTop = innerHeight - thumbSize;
  const thumbTop = Math.round(percent * maxThumbTop);

  const rows: string[] = [topCap];
  for (let i = 0; i < innerHeight; i++) {
    rows.push(i >= thumbTop && i < thumbTop + thumbSize ? thumbChar : trackChar);
  }
  rows.push(bottomCap);
  return rows;
}

export function buildScrollBarText(
  state: VirtualScrollState,
  opts: ScrollBarOptions
): string {
  return buildScrollBar(state, opts).join('\n');
}

export function buildScrollIndicatorLine(
  state: VirtualScrollState,
  width: number
): string {
  const percent = getScrollPercent(state);
  const label = `${percent}%`;
  const bar = `[${'='.repeat(Math.max(0, width - label.length - 3))}]`;
  return `${bar} ${label}`;
}
