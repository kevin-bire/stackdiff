/**
 * highlightRangeBar — builds status/hint text for the active highlight range.
 */

import type { HighlightRangeState } from "./highlightRangeState";
import { getSelectedRange, getRangeLength } from "./highlightRangeState";

export function buildRangeStatusText(state: HighlightRangeState): string {
  if (!state.isSelecting) return "";
  const range = getSelectedRange(state);
  if (!range) return "";
  const [start, end] = range;
  const count = getRangeLength(state);
  if (start === end) {
    return `Range: line ${start + 1} (1 line selected)`;
  }
  return `Range: lines ${start + 1}–${end + 1} (${count} lines selected)`;
}

export function buildRangeHintText(state: HighlightRangeState): string {
  if (!state.isSelecting) {
    return "Shift+↑/↓ to start range selection";
  }
  return "Shift+↑/↓ extend  |  y copy  |  Esc clear";
}

export function applyHighlightToLines(
  lines: string[],
  state: HighlightRangeState,
  highlightTag: string = "\x1b[7m",
  resetTag: string = "\x1b[0m"
): string[] {
  if (!state.isSelecting) return lines;
  return lines.map((line, idx) => {
    const range = getSelectedRange(state);
    if (!range) return line;
    const [start, end] = range;
    if (idx >= start && idx <= end) {
      return `${highlightTag}${line}${resetTag}`;
    }
    return line;
  });
}

export function buildRangeCopyText(
  lines: string[],
  state: HighlightRangeState
): string {
  const range = getSelectedRange(state);
  if (!range) return "";
  const [start, end] = range;
  return lines
    .slice(start, end + 1)
    .map((l) => l.replace(/\x1b\[[\d;]*m/g, ""))
    .join("\n");
}
