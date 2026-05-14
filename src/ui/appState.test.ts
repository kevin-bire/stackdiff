import { createAppState, setMode, updateTotalLines, isQuit, isHelp } from './appState';
import { buildMockDiff } from './testHelpers';

const mockSources: [string, string] = ['file1.yml', 'file2.yml'];

describe('createAppState', () => {
  it('initializes with diff mode', () => {
    const diff = buildMockDiff();
    const state = createAppState(diff, mockSources, 20, 100);
    expect(state.mode).toBe('diff');
  });

  it('sets sources correctly', () => {
    const diff = buildMockDiff();
    const state = createAppState(diff, mockSources, 20, 100);
    expect(state.sources).toEqual(mockSources);
  });

  it('creates navigator with service names from diff', () => {
    const diff = buildMockDiff();
    const state = createAppState(diff, mockSources, 20, 100);
    const serviceNames = Object.keys(diff);
    expect(state.navigator.services).toEqual(serviceNames);
  });

  it('creates scroll state with correct total lines', () => {
    const diff = buildMockDiff();
    const state = createAppState(diff, mockSources, 20, 50);
    expect(state.scrollState.totalLines).toBe(50);
  });
});

describe('setMode', () => {
  it('returns new state with updated mode', () => {
    const diff = buildMockDiff();
    const state = createAppState(diff, mockSources, 20, 100);
    const next = setMode(state, 'help');
    expect(next.mode).toBe('help');
    expect(state.mode).toBe('diff');
  });

  it('can set quit mode', () => {
    const diff = buildMockDiff();
    const state = createAppState(diff, mockSources, 20, 100);
    const next = setMode(state, 'quit');
    expect(isQuit(next)).toBe(true);
  });
});

describe('updateTotalLines', () => {
  it('updates totalLines on state and scrollState', () => {
    const diff = buildMockDiff();
    const state = createAppState(diff, mockSources, 20, 50);
    const next = updateTotalLines(state, 200);
    expect(next.totalLines).toBe(200);
    expect(next.scrollState.totalLines).toBe(200);
  });
});

describe('isHelp / isQuit', () => {
  it('isHelp returns true only in help mode', () => {
    const diff = buildMockDiff();
    const state = createAppState(diff, mockSources, 20, 100);
    expect(isHelp(state)).toBe(false);
    expect(isHelp(setMode(state, 'help'))).toBe(true);
  });

  it('isQuit returns true only in quit mode', () => {
    const diff = buildMockDiff();
    const state = createAppState(diff, mockSources, 20, 100);
    expect(isQuit(state)).toBe(false);
    expect(isQuit(setMode(state, 'quit'))).toBe(true);
  });
});
