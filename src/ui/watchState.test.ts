import {
  createWatchState,
  startWatching,
  stopWatching,
  markChanged,
  markError,
  resetChanged,
  isWatching,
  getWatchStatusText,
} from './watchState';

describe('watchState', () => {
  it('creates idle state', () => {
    const s = createWatchState();
    expect(s.status).toBe('idle');
    expect(s.watchedPaths).toEqual([]);
    expect(s.pollIntervalMs).toBe(1000);
  });

  it('starts watching with paths', () => {
    const s = startWatching(createWatchState(), ['a.yml', 'b.yml']);
    expect(s.status).toBe('watching');
    expect(s.watchedPaths).toEqual(['a.yml', 'b.yml']);
  });

  it('stops watching', () => {
    const s = stopWatching(startWatching(createWatchState(), ['a.yml']));
    expect(s.status).toBe('idle');
    expect(s.watchedPaths).toEqual([]);
  });

  it('marks a path as changed', () => {
    const s = markChanged(startWatching(createWatchState(), ['a.yml']), 'a.yml');
    expect(s.status).toBe('changed');
    expect(s.lastChangedPath).toBe('a.yml');
    expect(s.lastChangedAt).toBeGreaterThan(0);
  });

  it('marks error', () => {
    const s = markError(createWatchState(), 'ENOENT');
    expect(s.status).toBe('error');
    expect(s.errorMessage).toBe('ENOENT');
  });

  it('resets changed back to watching', () => {
    const s = resetChanged(markChanged(startWatching(createWatchState(), ['a.yml']), 'a.yml'));
    expect(s.status).toBe('watching');
    expect(s.lastChangedPath).toBeNull();
  });

  it('does not reset if not changed', () => {
    const s = createWatchState();
    expect(resetChanged(s).status).toBe('idle');
  });

  it('isWatching returns true for watching and changed', () => {
    expect(isWatching(startWatching(createWatchState(), []))).toBe(true);
    expect(isWatching(markChanged(startWatching(createWatchState(), ['f']), 'f'))).toBe(true);
    expect(isWatching(createWatchState())).toBe(false);
  });

  it('getWatchStatusText for all statuses', () => {
    expect(getWatchStatusText(createWatchState())).toBe('Watch: off');
    expect(getWatchStatusText(startWatching(createWatchState(), ['a.yml', 'b.yml']))).toBe('Watch: 2 file(s)');
    expect(getWatchStatusText(markChanged(startWatching(createWatchState(), ['a.yml']), 'a.yml'))).toContain('changed');
    expect(getWatchStatusText(markError(createWatchState(), 'fail'))).toContain('error');
  });
});
