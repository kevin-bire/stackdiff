import {
  createClipboardState,
  copyToClipboard,
  copyDiffToClipboard,
  getClipboardStatusText,
  hasRecentCopy,
} from './clipboardState';
import { buildMockDiff } from './testHelpers';

describe('createClipboardState', () => {
  it('initializes with null values and zero count', () => {
    const state = createClipboardState();
    expect(state.lastCopied).toBeNull();
    expect(state.lastFormat).toBeNull();
    expect(state.lastCopiedAt).toBeNull();
    expect(state.copyCount).toBe(0);
  });
});

describe('copyToClipboard', () => {
  it('stores content, format, and increments copyCount', () => {
    const state = createClipboardState();
    const next = copyToClipboard(state, 'hello world', 'text');
    expect(next.lastCopied).toBe('hello world');
    expect(next.lastFormat).toBe('text');
    expect(next.copyCount).toBe(1);
    expect(next.lastCopiedAt).toBeInstanceOf(Date);
  });

  it('does not mutate original state', () => {
    const state = createClipboardState();
    copyToClipboard(state, 'data', 'markdown');
    expect(state.lastCopied).toBeNull();
    expect(state.copyCount).toBe(0);
  });

  it('increments copyCount on each call', () => {
    let state = createClipboardState();
    state = copyToClipboard(state, 'a', 'text');
    state = copyToClipboard(state, 'b', 'text');
    expect(state.copyCount).toBe(2);
  });
});

describe('copyDiffToClipboard', () => {
  const diff = buildMockDiff();

  it('returns content as text format', () => {
    const state = createClipboardState();
    const { content, state: next } = copyDiffToClipboard(state, diff, 'text');
    expect(typeof content).toBe('string');
    expect(content.length).toBeGreaterThan(0);
    expect(next.lastFormat).toBe('text');
  });

  it('returns content as markdown format', () => {
    const state = createClipboardState();
    const { content } = copyDiffToClipboard(state, diff, 'markdown');
    expect(content).toContain('#');
  });

  it('returns content as json format', () => {
    const state = createClipboardState();
    const { content } = copyDiffToClipboard(state, diff, 'json');
    expect(() => JSON.parse(content)).not.toThrow();
  });
});

describe('getClipboardStatusText', () => {
  it('returns default message when nothing copied', () => {
    const state = createClipboardState();
    expect(getClipboardStatusText(state)).toBe('Nothing copied yet');
  });

  it('includes format in status text', () => {
    const state = copyToClipboard(createClipboardState(), 'data', 'markdown');
    expect(getClipboardStatusText(state)).toContain('markdown');
  });
});

describe('hasRecentCopy', () => {
  it('returns false when nothing copied', () => {
    expect(hasRecentCopy(createClipboardState())).toBe(false);
  });

  it('returns true immediately after copy', () => {
    const state = copyToClipboard(createClipboardState(), 'x', 'text');
    expect(hasRecentCopy(state, 3000)).toBe(true);
  });

  it('returns false when copy is older than window', () => {
    const state = copyToClipboard(createClipboardState(), 'x', 'text');
    expect(hasRecentCopy(state, 0)).toBe(false);
  });
});
