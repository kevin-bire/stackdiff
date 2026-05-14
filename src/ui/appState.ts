import { createScrollState, ScrollState } from './scrollState';
import { createServiceNavigator, ServiceNavigator } from './serviceNavigator';
import { DiffResult } from '../diff';

export type AppMode = 'diff' | 'help' | 'quit';

export interface AppState {
  mode: AppMode;
  scrollState: ScrollState;
  navigator: ServiceNavigator;
  diff: DiffResult;
  sources: [string, string];
  totalLines: number;
}

export function createAppState(
  diff: DiffResult,
  sources: [string, string],
  viewportHeight: number,
  totalLines: number
): AppState {
  const serviceNames = Object.keys(diff);
  return {
    mode: 'diff',
    scrollState: createScrollState(totalLines, viewportHeight),
    navigator: createServiceNavigator(serviceNames),
    diff,
    sources,
    totalLines,
  };
}

export function setMode(state: AppState, mode: AppMode): AppState {
  return { ...state, mode };
}

export function updateTotalLines(state: AppState, totalLines: number): AppState {
  return {
    ...state,
    totalLines,
    scrollState: {
      ...state.scrollState,
      totalLines,
    },
  };
}

export function isQuit(state: AppState): boolean {
  return state.mode === 'quit';
}

export function isHelp(state: AppState): boolean {
  return state.mode === 'help';
}
