/**
 * splitViewRenderer — renders unified or split-pane diff lines for display
 */

import { SplitViewState, isSplitMode } from "./splitViewState";
import { applyThemeToLine } from "./themeState";
import type { ThemeState } from "./themeState";

export interface SplitLine {
  left: string;
  right: string;
}

/**
 * Partition a flat diff line array into left/right columns.
 * Lines starting with '-' go left, '+' go right, context goes both.
 */
export function partitionDiffLines(lines: string[]): SplitLine[] {
  return lines.map((line) => {
    if (line.startsWith("-")) {
      return { left: line, right: "" };
    } else if (line.startsWith("+")) {
      return { left: "", right: line };
    }
    return { left: line, right: line };
  });
}

export function renderSplitLine(
  split: SplitLine,
  colWidth: number,
  theme: ThemeState
): string {
  const pad = (s: string) => s.padEnd(colWidth).slice(0, colWidth);
  const left = applyThemeToLine(theme, pad(split.left));
  const right = applyThemeToLine(theme, pad(split.right));
  return `${left} │ ${right}`;
}

export function renderLines(
  lines: string[],
  state: SplitViewState,
  theme: ThemeState,
  totalWidth: number
): string[] {
  if (!isSplitMode(state)) {
    return lines.map((l) => applyThemeToLine(theme, l));
  }
  const colWidth = Math.floor((totalWidth - 3) / 2);
  const splits = partitionDiffLines(lines);
  return splits.map((s) => renderSplitLine(s, colWidth, theme));
}

export function buildSplitHeader(
  state: SplitViewState,
  totalWidth: number
): string {
  if (!isSplitMode(state)) return "";
  const colWidth = Math.floor((totalWidth - 3) / 2);
  const left = state.leftLabel.padEnd(colWidth).slice(0, colWidth);
  const right = state.rightLabel.padEnd(colWidth).slice(0, colWidth);
  return `${left} │ ${right}`;
}
