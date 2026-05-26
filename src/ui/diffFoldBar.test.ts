import {
  buildFoldStatusText,
  buildFoldHintText,
  buildFoldSummaryLine,
  buildFoldGutter,
  formatFoldCount,
} from './diffFoldBar';
import { createDiffFoldState, addFold, toggleFoldEnabled } from './diffFoldState';

describe('buildFoldStatusText', () => {
  it('shows OFF when disabled', () => {
    const s = toggleFoldEnabled(createDiffFoldState());
    expect(buildFoldStatusText(s)).toBe('[Folds: OFF]');
  });

  it('shows none when no folds', () => {
    expect(buildFoldStatusText(createDiffFoldState())).toBe('[Folds: none]');
  });

  it('shows count when folds present', () => {
    const s = addFold(createDiffFoldState(), { startLine: 0, endLine: 3, label: 'x' });
    expect(buildFoldStatusText(s)).toBe('[Folds: 1 active]');
  });
});

describe('buildFoldHintText', () => {
  it('includes key hints', () => {
    const text = buildFoldHintText(createDiffFoldState());
    expect(text).toContain('z:toggle-fold');
    expect(text).toContain('Z:clear-folds');
  });

  it('shows disabled note when off', () => {
    const s = toggleFoldEnabled(createDiffFoldState());
    expect(buildFoldHintText(s)).toContain('disabled');
  });
});

describe('buildFoldSummaryLine', () => {
  it('formats singular line count', () => {
    const line = buildFoldSummaryLine({ startLine: 2, endLine: 3, label: 'ctx' });
    expect(line).toContain('1 line folded');
    expect(line).toContain('ctx');
  });

  it('formats plural line count', () => {
    const line = buildFoldSummaryLine({ startLine: 2, endLine: 6, label: 'ctx' });
    expect(line).toContain('4 lines folded');
  });
});

describe('buildFoldGutter', () => {
  it('marks fold start with arrow', () => {
    const s = addFold(createDiffFoldState(), { startLine: 1, endLine: 3, label: 'f' });
    const gutter = buildFoldGutter(5, s);
    // line 0 => ' ', line 1 => '▶', lines 2-3 skipped, line 4 => ' '
    expect(gutter[1]).toBe('▶');
    expect(gutter[0]).toBe(' ');
  });

  it('returns empty gutter for 0 lines', () => {
    expect(buildFoldGutter(0, createDiffFoldState())).toHaveLength(0);
  });
});

describe('formatFoldCount', () => {
  it('reports total hidden lines and fold count', () => {
    let s = addFold(createDiffFoldState(), { startLine: 0, endLine: 3, label: 'a' });
    s = addFold(s, { startLine: 5, endLine: 7, label: 'b' });
    const text = formatFoldCount(s);
    expect(text).toContain('5 lines hidden');
    expect(text).toContain('2 folds');
  });

  it('uses singular when one fold of one line', () => {
    const s = addFold(createDiffFoldState(), { startLine: 0, endLine: 1, label: 'a' });
    const text = formatFoldCount(s);
    expect(text).toContain('1 line hidden');
    expect(text).toContain('1 fold');
  });
});
