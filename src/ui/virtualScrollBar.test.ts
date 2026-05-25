import { buildScrollBar, buildScrollBarText, buildScrollIndicatorLine } from './virtualScrollBar';

describe('buildScrollBar', () => {
  it('returns empty array when totalLines is 0', () => {
    const result = buildScrollBar(0, 10, 0, 20);
    expect(result).toEqual([]);
  });

  it('returns full bar when content fits in viewport', () => {
    const result = buildScrollBar(5, 10, 0, 20);
    expect(result.length).toBe(20);
    // All lines should be filled when content fits
    expect(result.every(line => line.filled)).toBe(true);
  });

  it('calculates thumb position at top', () => {
    const result = buildScrollBar(100, 10, 0, 20);
    expect(result.length).toBe(20);
    const filledLines = result.filter(l => l.filled);
    expect(filledLines.length).toBeGreaterThan(0);
    // Thumb should start near top
    expect(result[0].filled).toBe(true);
  });

  it('calculates thumb position at bottom', () => {
    const result = buildScrollBar(100, 10, 90, 20);
    expect(result.length).toBe(20);
    const filledLines = result.filter(l => l.filled);
    expect(filledLines.length).toBeGreaterThan(0);
    // Thumb should end at bottom
    expect(result[result.length - 1].filled).toBe(true);
  });

  it('calculates thumb position in middle', () => {
    const result = buildScrollBar(100, 10, 45, 20);
    expect(result.length).toBe(20);
    const filledIndices = result
      .map((l, i) => (l.filled ? i : -1))
      .filter(i => i >= 0);
    const midpoint = filledIndices[Math.floor(filledIndices.length / 2)];
    // Midpoint of thumb should be roughly in the middle of the bar
    expect(midpoint).toBeGreaterThan(5);
    expect(midpoint).toBeLessThan(15);
  });

  it('thumb size is proportional to viewport/total ratio', () => {
    const smallViewport = buildScrollBar(100, 10, 0, 20);
    const largeViewport = buildScrollBar(100, 50, 0, 20);
    const smallFilled = smallViewport.filter(l => l.filled).length;
    const largeFilled = largeViewport.filter(l => l.filled).length;
    expect(largeFilled).toBeGreaterThan(smallFilled);
  });
});

describe('buildScrollBarText', () => {
  it('returns vertical bar string of given height', () => {
    const result = buildScrollBarText(100, 10, 0, 10);
    const lines = result.split('\n');
    expect(lines.length).toBe(10);
  });

  it('uses block character for filled cells', () => {
    const result = buildScrollBarText(100, 10, 0, 20);
    expect(result).toContain('█');
  });

  it('uses light shade for empty cells', () => {
    const result = buildScrollBarText(100, 10, 50, 20);
    expect(result).toContain('░');
  });

  it('returns empty string when totalLines is 0', () => {
    const result = buildScrollBarText(0, 10, 0, 20);
    expect(result).toBe('');
  });
});

describe('buildScrollIndicatorLine', () => {
  it('formats current position as percentage', () => {
    const result = buildScrollIndicatorLine(0, 100);
    expect(result).toContain('0%');
  });

  it('shows 100% at end of content', () => {
    const result = buildScrollIndicatorLine(90, 100);
    expect(result).toContain('100%');
  });

  it('shows 50% at midpoint', () => {
    const result = buildScrollIndicatorLine(50, 100);
    expect(result).toContain('50%');
  });

  it('includes line number info', () => {
    const result = buildScrollIndicatorLine(25, 200);
    expect(result).toContain('25');
  });

  it('handles zero totalLines gracefully', () => {
    const result = buildScrollIndicatorLine(0, 0);
    expect(result).toBeTruthy();
    expect(result).toContain('0%');
  });
});
