/**
 * undoState.ts
 * Tracks undo/redo history for user actions (filter changes, collapse toggles, etc.)
 */

export type UndoAction =
  | { type: 'filter'; prev: string; next: string }
  | { type: 'collapse'; serviceId: string; prev: boolean; next: boolean }
  | { type: 'bookmark'; serviceId: string; prev: boolean; next: boolean };

export interface UndoState {
  past: UndoAction[];
  future: UndoAction[];
  maxHistory: number;
}

export function createUndoState(maxHistory = 50): UndoState {
  return { past: [], future: [], maxHistory };
}

export function pushAction(state: UndoState, action: UndoAction): UndoState {
  const past = [...state.past, action].slice(-state.maxHistory);
  return { ...state, past, future: [] };
}

export function undo(state: UndoState): { state: UndoState; action: UndoAction | null } {
  if (state.past.length === 0) return { state, action: null };
  const past = [...state.past];
  const action = past.pop()!;
  const future = [action, ...state.future];
  return { state: { ...state, past, future }, action };
}

export function redo(state: UndoState): { state: UndoState; action: UndoAction | null } {
  if (state.future.length === 0) return { state, action: null };
  const future = [...state.future];
  const action = future.shift()!;
  const past = [...state.past, action];
  return { state: { ...state, past, future }, action };
}

export function canUndo(state: UndoState): boolean {
  return state.past.length > 0;
}

export function canRedo(state: UndoState): boolean {
  return state.future.length > 0;
}

export function clearHistory(state: UndoState): UndoState {
  return { ...state, past: [], future: [] };
}

export function getUndoStatusText(state: UndoState): string {
  const parts: string[] = [];
  if (canUndo(state)) parts.push(`u:undo(${state.past.length})`);
  if (canRedo(state)) parts.push(`r:redo(${state.future.length})`);
  return parts.join('  ');
}
