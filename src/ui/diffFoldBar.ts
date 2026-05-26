/**
 * diffFoldBar — UI text helpers for fold controls and status display.
 */

import { DiffFoldState, FoldRegion } from './diffFoldState';

export function buildFoldStatusText(state: DiffFoldState): string {
  if (!state.enabled) return '[Folds: OFF]';
  const count = state.folds.length;
  if (count === 0) return '[Folds: none]';
  return `[Folds: ${count} active]`;
}

export function buildFoldHintText(state: DiffFoldState): string {
  const parts: string[] = ['z:toggle-fold', 'Z:clear-folds'];
  if (!state.enabled) parts.push('(disabled)');
  return parts.join('  ');
}

export function buildFoldSummaryLine(region: FoldRegion): string {
  const lineCount = region.endLine - region.startLine;
  return `  ⋯ ${region.label} — ${lineCount} line${lineCount !== 1 ? 's' : ''} folded`;
}

export function buildFoldGutter(totalLines: number, state: DiffFoldState): string[] {
  const gutter: string[] = [];
  const foldStarts = new Set(state.folds.map(f => f.startLine));
  const foldedLines = new Set<number>();
  for (const f of state.folds) {
    for (let i = f.startLine + 1; i <= f.endLine; i++) foldedLines.add(i);
  }
  for (let i = 0; i < totalLines; i++) {
    if (foldedLines.has(i)) continue;
    if (foldStarts.has(i)) {
      gutter.push('▶');
    } else {
      gutter.push(' ');
    }
  }
  return gutter;
}

export function formatFoldCount(state: DiffFoldState): string {
  const total = state.folds.reduce((acc, f) => acc + (f.endLine - f.startLine), 0);
  return `${total} line${total !== 1 ? 's' : ''} hidden across ${state.folds.length} fold${state.folds.length !== 1 ? 's' : ''}`;
}
