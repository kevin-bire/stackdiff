import {
  createLineWrapState,
  toggleWrap,
  setColumnWidth,
  wrapLine,
  applyWrapToLines,
} from './lineWrapState';

describe('createLineWrapState', () => {
  it('creates state with wrap disabled and default column width', () => {
    const s = createLineWrapState();
    expect(s.enabled).toBe(false);
    expect(s.columnWidth).toBe(120);
  });

  it('accepts a custom column width', () => {
    const s = createLineWrapState(80);
    expect(s.columnWidth).toBe(80);
  });
});

describe('toggleWrap', () => {
  it('enables wrap when disabled', () => {
    const s = toggleWrap(createLineWrapState());
    expect(s.enabled).toBe(true);
  });

  it('disables wrap when enabled', () => {
    const s = toggleWrap({ enabled: true, columnWidth: 80 });
    expect(s.enabled).toBe(false);
  });

  it('does not mutate the original state', () => {
    const original = createLineWrapState();
    toggleWrap(original);
    expect(original.enabled).toBe(false);
  });
});

describe('setColumnWidth', () => {
  it('updates the column width', () => {
    const s = setColumnWidth(createLineWrapState(), 60);
    expect(s.columnWidth).toBe(60);
  });

  it('throws for widths below 20', () => {
    expect(() => setColumnWidth(createLineWrapState(), 10)).toThrow(RangeError);
  });
});

describe('wrapLine', () => {
  it('returns the line unchanged when shorter than column width', () => {
    expect(wrapLine('short', 80)).toEqual(['short']);
  });

  it('splits a long line into multiple chunks', () => {
    const line = 'a'.repeat(200);
    const result = wrapLine(line, 80);
    expect(result.length).toBeGreaterThan(1);
    result.forEach((chunk) => expect(chunk.length).toBeLessThanOrEqual(80));
  });

  it('preserves leading indentation on continuation lines', () => {
    const line = '    ' + 'x'.repeat(100);
    const result = wrapLine(line, 40);
    expect(result.length).toBeGreaterThan(1);
    // continuation lines start with at least the original indent
    result.slice(1).forEach((chunk) => expect(chunk).toMatch(/^\s+/));
  });
});

describe('applyWrapToLines', () => {
  it('returns original lines when wrap is disabled', () => {
    const lines = ['a'.repeat(200)];
    const state = createLineWrapState();
    expect(applyWrapToLines(lines, state)).toBe(lines);
  });

  it('wraps lines when wrap is enabled', () => {
    const lines = ['a'.repeat(200), 'short'];
    const state = { enabled: true, columnWidth: 80 };
    const result = applyWrapToLines(lines, state);
    expect(result.length).toBeGreaterThan(lines.length);
  });

  it('leaves short lines untouched even with wrap enabled', () => {
    const lines = ['hello', 'world'];
    const state = { enabled: true, columnWidth: 80 };
    expect(applyWrapToLines(lines, state)).toEqual(lines);
  });
});
