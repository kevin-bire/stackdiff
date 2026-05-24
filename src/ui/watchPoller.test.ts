import * as fs from 'fs';
import { createWatchPoller } from './watchPoller';
import { createWatchState, startWatching, WatchState } from './watchState';

jest.mock('fs');
const mockStatSync = fs.statSync as jest.Mock;

function setup(paths: string[] = ['a.yml']) {
  let state: WatchState = startWatching(createWatchState(50), paths);
  const setState = jest.fn((s: WatchState) => { state = s; });
  const onChange = jest.fn();
  const onError = jest.fn();
  const poller = createWatchPoller(() => state, setState, onChange, onError);
  return { getState: () => state, setState, onChange, onError, poller };
}

beforeEach(() => jest.useFakeTimers());
afterEach(() => { jest.useRealTimers(); jest.clearAllMocks(); });

describe('createWatchPoller', () => {
  it('starts and marks isRunning', () => {
    mockStatSync.mockReturnValue({ mtimeMs: 100 });
    const { poller } = setup();
    poller.start();
    expect(poller.isRunning()).toBe(true);
    poller.stop();
  });

  it('stops and clears timer', () => {
    mockStatSync.mockReturnValue({ mtimeMs: 100 });
    const { poller } = setup();
    poller.start();
    poller.stop();
    expect(poller.isRunning()).toBe(false);
  });

  it('calls onChange when mtime changes', () => {
    let mtime = 100;
    mockStatSync.mockImplementation(() => ({ mtimeMs: mtime }));
    const { poller, onChange } = setup();
    poller.start();
    jest.advanceTimersByTime(60);
    mtime = 200;
    jest.advanceTimersByTime(60);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][1]).toBe('a.yml');
    poller.stop();
  });

  it('calls onError when statSync throws', () => {
    mockStatSync.mockImplementation(() => { throw new Error('ENOENT'); });
    const { poller, onError } = setup();
    poller.start();
    jest.advanceTimersByTime(60);
    expect(onError).toHaveBeenCalledTimes(1);
    poller.stop();
  });

  it('does not call onChange if mtime unchanged', () => {
    mockStatSync.mockReturnValue({ mtimeMs: 100 });
    const { poller, onChange } = setup();
    poller.start();
    jest.advanceTimersByTime(200);
    expect(onChange).not.toHaveBeenCalled();
    poller.stop();
  });
});
