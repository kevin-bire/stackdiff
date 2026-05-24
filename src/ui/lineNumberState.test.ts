import {
  createLineNumberState,
  cycleLineNumberMode,
  setLineNumberMode,
  updateTotalLines,
  setCurrentLine,
  formatLineNumber,
  applyLineNumbers,
} from './lineNumberState';

describe('createLineNumberState', () => {
  it('defaults to absolute mode', () => {
    const s = createLineNumberState(100);
    expect(s.mode).toBe('absolute');
    expect(s.totalLines).toBe(100);
    expect(s.gutterWidth).toBe(3);
  });

  it('computes gutter width for large totals', () => {
    const s = createLineNumberState(10000);
    expect(s.gutterWidth).toBe(5);
  });

  it('has minimum gutter width of 3', () => {
    const s = createLineNumberState(5);
    expect(s.gutterWidth).toBe(3);
  });
});

describe('cycleLineNumberMode', () => {
  it('cycles none -> absolute -> relative -> none', () => {
    let s = createLineNumberState();
    s = setLineNumberMode(s, 'none');
    s = cycleLineNumberMode(s);
    expect(s.mode).toBe('absolute');
    s = cycleLineNumberMode(s);
    expect(s.mode).toBe('relative');
    s = cycleLineNumberMode(s);
    expect(s.mode).toBe('none');
  });
});

describe('updateTotalLines', () => {
  it('updates total and recomputes gutter width', () => {
    const s = updateTotalLines(createLineNumberState(10), 9999);
    expect(s.totalLines).toBe(9999);
    expect(s.gutterWidth).toBe(4);
  });
});

describe('formatLineNumber', () => {
  it('returns empty string in none mode', () => {
    const s = setLineNumberMode(createLineNumberState(10), 'none');
    expect(formatLineNumber(s, 0)).toBe('');
  });

  it('returns 1-based absolute number padded', () => {
    const s = createLineNumberState(100);
    expect(formatLineNumber(s, 0)).toBe('  1');
    expect(formatLineNumber(s, 9)).toBe(' 10');
  });

  it('returns relative distance from current line', () => {
    let s = setLineNumberMode(createLineNumberState(20), 'relative');
    s = setCurrentLine(s, 5);
    expect(formatLineNumber(s, 5)).toBe('  6'); // current line shows absolute
    expect(formatLineNumber(s, 3)).toBe('  2'); // 2 lines above
    expect(formatLineNumber(s, 8)).toBe('  3'); // 3 lines below
  });
});

describe('applyLineNumbers', () => {
  it('prepends line numbers to each line', () => {
    const s = createLineNumberState(3);
    const result = applyLineNumbers(s, ['foo', 'bar', 'baz']);
    expect(result[0]).toBe('  1 foo');
    expect(result[2]).toBe('  3 baz');
  });

  it('returns lines unchanged in none mode', () => {
    const s = setLineNumberMode(createLineNumberState(3), 'none');
    const lines = ['a', 'b'];
    expect(applyLineNumbers(s, lines)).toEqual(lines);
  });
});
