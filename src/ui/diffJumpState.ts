/**
 * diffJumpState — track and navigate between diff change positions
 */

export type JumpEntry = {
  lineIndex: number;
  serviceKey: string;
  changeType: 'added' | 'removed' | 'changed';
};

export type DiffJumpState = {
  entries: JumpEntry[];
  currentIndex: number;
};

export function createDiffJumpState(): DiffJumpState {
  return { entries: [], currentIndex: -1 };
}

export function buildJumpEntries(
  lines: string[],
  serviceKeys: string[]
): JumpEntry[] {
  const entries: JumpEntry[] = [];
  let currentService = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const serviceMatch = serviceKeys.find((k) => line.includes(`[${k}]`));
    if (serviceMatch) currentService = serviceMatch;

    if (line.startsWith('+') && !line.startsWith('+++')) {
      entries.push({ lineIndex: i, serviceKey: currentService, changeType: 'added' });
    } else if (line.startsWith('-') && !line.startsWith('---')) {
      entries.push({ lineIndex: i, serviceKey: currentService, changeType: 'removed' });
    } else if (line.startsWith('~')) {
      entries.push({ lineIndex: i, serviceKey: currentService, changeType: 'changed' });
    }
  }

  return entries;
}

export function jumpToNext(state: DiffJumpState): DiffJumpState {
  if (state.entries.length === 0) return state;
  const next = Math.min(state.currentIndex + 1, state.entries.length - 1);
  return { ...state, currentIndex: next };
}

export function jumpToPrev(state: DiffJumpState): DiffJumpState {
  if (state.entries.length === 0) return state;
  const prev = Math.max(state.currentIndex - 1, 0);
  return { ...state, currentIndex: prev };
}

export function jumpToFirst(state: DiffJumpState): DiffJumpState {
  if (state.entries.length === 0) return state;
  return { ...state, currentIndex: 0 };
}

export function jumpToLast(state: DiffJumpState): DiffJumpState {
  if (state.entries.length === 0) return state;
  return { ...state, currentIndex: state.entries.length - 1 };
}

export function getCurrentJumpEntry(state: DiffJumpState): JumpEntry | null {
  if (state.currentIndex < 0 || state.currentIndex >= state.entries.length) return null;
  return state.entries[state.currentIndex];
}

export function canJumpNext(state: DiffJumpState): boolean {
  return state.currentIndex < state.entries.length - 1;
}

export function canJumpPrev(state: DiffJumpState): boolean {
  return state.currentIndex > 0;
}

export function formatJumpStatus(state: DiffJumpState): string {
  if (state.entries.length === 0) return 'No changes';
  const pos = state.currentIndex + 1;
  const total = state.entries.length;
  const entry = getCurrentJumpEntry(state);
  const tag = entry ? `[${entry.changeType}]` : '';
  return `Change ${pos}/${total} ${tag}`;
}
