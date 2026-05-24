import * as fs from 'fs';
import { WatchState, markChanged, markError } from './watchState';

export type OnChangeCallback = (updatedState: WatchState, changedPath: string) => void;
export type OnErrorCallback = (updatedState: WatchState, error: Error) => void;

export interface WatchPoller {
  start: () => void;
  stop: () => void;
  isRunning: () => boolean;
}

export function createWatchPoller(
  getState: () => WatchState,
  setState: (s: WatchState) => void,
  onChange: OnChangeCallback,
  onError: OnErrorCallback
): WatchPoller {
  let timer: ReturnType<typeof setInterval> | null = null;
  const mtimeCache: Map<string, number> = new Map();

  function poll() {
    const state = getState();
    for (const filePath of state.watchedPaths) {
      try {
        const stat = fs.statSync(filePath);
        const mtime = stat.mtimeMs;
        const prev = mtimeCache.get(filePath);
        if (prev !== undefined && mtime !== prev) {
          mtimeCache.set(filePath, mtime);
          const next = markChanged(state, filePath);
          setState(next);
          onChange(next, filePath);
          return;
        }
        mtimeCache.set(filePath, mtime);
      } catch (err) {
        const next = markError(state, (err as Error).message);
        setState(next);
        onError(next, err as Error);
        return;
      }
    }
  }

  return {
    start() {
      if (timer) return;
      const state = getState();
      mtimeCache.clear();
      timer = setInterval(poll, state.pollIntervalMs);
    },
    stop() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    },
    isRunning() {
      return timer !== null;
    },
  };
}
