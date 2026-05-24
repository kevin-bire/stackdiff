/**
 * progressState.ts
 * Tracks loading/processing progress for async operations like file parsing and git branch resolution.
 */

export type ProgressPhase = 'idle' | 'loading' | 'parsing' | 'diffing' | 'rendering' | 'done' | 'error';

export interface ProgressState {
  phase: ProgressPhase;
  message: string;
  percent: number; // 0-100
  error: string | null;
}

export function createProgressState(): ProgressState {
  return {
    phase: 'idle',
    message: '',
    percent: 0,
    error: null,
  };
}

export function setPhase(
  state: ProgressState,
  phase: ProgressPhase,
  message = '',
  percent = 0
): ProgressState {
  return { ...state, phase, message, percent, error: null };
}

export function setProgress(
  state: ProgressState,
  percent: number,
  message?: string
): ProgressState {
  const clamped = Math.max(0, Math.min(100, percent));
  return {
    ...state,
    percent: clamped,
    message: message !== undefined ? message : state.message,
  };
}

export function setError(state: ProgressState, error: string): ProgressState {
  return { ...state, phase: 'error', error, message: error };
}

export function markDone(state: ProgressState): ProgressState {
  return { ...state, phase: 'done', percent: 100, error: null };
}

export function isActive(state: ProgressState): boolean {
  return state.phase !== 'idle' && state.phase !== 'done' && state.phase !== 'error';
}

export function formatProgressText(state: ProgressState): string {
  if (state.phase === 'idle') return '';
  if (state.phase === 'error') return `{red-fg}Error: ${state.error}{/red-fg}`;
  if (state.phase === 'done') return '{green-fg}Ready{/green-fg}';
  const bar = buildProgressBar(state.percent, 20);
  return `{cyan-fg}[${state.phase}]{/cyan-fg} ${bar} ${state.percent}%  ${state.message}`;
}

export function buildProgressBar(percent: number, width: number): string {
  const filled = Math.round((percent / 100) * width);
  const empty = width - filled;
  return '[' + '='.repeat(filled) + ' '.repeat(empty) + ']';
}
