import { DiffResult } from '../diff';
import { FilterState } from './filterState';
import { ScrollState, getVisibleRange } from './scrollState';
import { applyFilterToLines } from './filterBar';
import { highlightLines } from './searchHighlight';

export interface ComparePanel {
  leftLabel: string;
  rightLabel: string;
  lines: string[];
  filteredLines: string[];
  totalFiltered: number;
}

export function createComparePanel(
  diff: DiffResult,
  leftLabel: string,
  rightLabel: string,
  formattedLines: string[]
): ComparePanel {
  return {
    leftLabel,
    rightLabel,
    lines: formattedLines,
    filteredLines: formattedLines,
    totalFiltered: formattedLines.length,
  };
}

export function applyPanelFilter(
  panel: ComparePanel,
  filter: FilterState
): ComparePanel {
  let filtered = applyFilterToLines(panel.lines, filter);
  if (filter.searchQuery) {
    filtered = highlightLines(filtered, filter.searchQuery);
  }
  return {
    ...panel,
    filteredLines: filtered,
    totalFiltered: filtered.length,
  };
}

export function getPanelHeader(panel: ComparePanel): string {
  const left = `{bold}${panel.leftLabel}{/bold}`;
  const right = `{bold}${panel.rightLabel}{/bold}`;
  return `  ${left}  {|}  ${right}  `;
}

export function getVisibleLines(
  panel: ComparePanel,
  scroll: ScrollState
): string[] {
  const { start, end } = getVisibleRange(scroll);
  return panel.filteredLines.slice(start, end);
}

export function getPanelSummary(panel: ComparePanel): string {
  const total = panel.lines.length;
  const filtered = panel.totalFiltered;
  if (filtered === total) {
    return `${total} lines`;
  }
  return `${filtered}/${total} lines (filtered)`;
}
