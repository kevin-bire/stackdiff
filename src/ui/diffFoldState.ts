/**
 * diffFoldState — track folded/unfolded regions within a diff view.
 * A "fold" collapses a contiguous range of lines into a single summary line.
 */

export interface FoldRegion {
  startLine: number;
  endLine: number;
  label: string;
}

export interface DiffFoldState {
  folds: FoldRegion[];
  enabled: boolean;
}

export function createDiffFoldState(): DiffFoldState {
  return { folds: [], enabled: true };
}

export function addFold(state: DiffFoldState, region: FoldRegion): DiffFoldState {
  const overlapping = state.folds.some(
    f => f.startLine <= region.endLine && f.endLine >= region.startLine
  );
  if (overlapping) return state;
  return { ...state, folds: [...state.folds, region] };
}

export function removeFold(state: DiffFoldState, startLine: number): DiffFoldState {
  return { ...state, folds: state.folds.filter(f => f.startLine !== startLine) };
}

export function toggleFold(state: DiffFoldState, region: FoldRegion): DiffFoldState {
  const exists = state.folds.some(f => f.startLine === region.startLine);
  return exists ? removeFold(state, region.startLine) : addFold(state, region);
}

export function isFolded(state: DiffFoldState, lineIndex: number): boolean {
  if (!state.enabled) return false;
  return state.folds.some(f => lineIndex > f.startLine && lineIndex <= f.endLine);
}

export function getFoldAt(state: DiffFoldState, startLine: number): FoldRegion | undefined {
  return state.folds.find(f => f.startLine === startLine);
}

export function clearFolds(state: DiffFoldState): DiffFoldState {
  return { ...state, folds: [] };
}

export function toggleFoldEnabled(state: DiffFoldState): DiffFoldState {
  return { ...state, enabled: !state.enabled };
}

export function applyFoldsToLines(state: DiffFoldState, lines: string[]): string[] {
  if (!state.enabled || state.folds.length === 0) return lines;
  const result: string[] = [];
  let skip = false;
  let skipUntil = -1;
  for (let i = 0; i < lines.length; i++) {
    const fold = getFoldAt(state, i);
    if (fold) {
      result.push(`  … ${fold.label} (${fold.endLine - fold.startLine} lines folded)`);
      skipUntil = fold.endLine;
      skip = true;
    } else if (skip && i <= skipUntil) {
      continue;
    } else {
      skip = false;
      result.push(lines[i]);
    }
  }
  return result;
}
