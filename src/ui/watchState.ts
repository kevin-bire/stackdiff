export type WatchStatus = 'idle' | 'watching' | 'changed' | 'error';

export interface WatchState {
  status: WatchStatus;
  watchedPaths: string[];
  lastChangedPath: string | null;
  lastChangedAt: number | null;
  errorMessage: string | null;
  pollIntervalMs: number;
}

export function createWatchState(pollIntervalMs = 1000): WatchState {
  return {
    status: 'idle',
    watchedPaths: [],
    lastChangedPath: null,
    lastChangedAt: null,
    errorMessage: null,
    pollIntervalMs,
  };
}

export function startWatching(state: WatchState, paths: string[]): WatchState {
  return { ...state, status: 'watching', watchedPaths: paths, errorMessage: null };
}

export function stopWatching(state: WatchState): WatchState {
  return { ...state, status: 'idle', watchedPaths: [] };
}

export function markChanged(state: WatchState, changedPath: string): WatchState {
  return {
    ...state,
    status: 'changed',
    lastChangedPath: changedPath,
    lastChangedAt: Date.now(),
  };
}

export function markError(state: WatchState, message: string): WatchState {
  return { ...state, status: 'error', errorMessage: message };
}

export function resetChanged(state: WatchState): WatchState {
  if (state.status !== 'changed') return state;
  return { ...state, status: 'watching', lastChangedPath: null, lastChangedAt: null };
}

export function isWatching(state: WatchState): boolean {
  return state.status === 'watching' || state.status === 'changed';
}

export function getWatchStatusText(state: WatchState): string {
  switch (state.status) {
    case 'idle': return 'Watch: off';
    case 'watching': return `Watch: ${state.watchedPaths.length} file(s)`;
    case 'changed': return `Watch: changed — ${state.lastChangedPath ?? ''}`;
    case 'error': return `Watch: error — ${state.errorMessage ?? 'unknown'}`;
  }
}
