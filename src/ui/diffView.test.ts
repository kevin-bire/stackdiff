import { colorizeLines } from './testHelpers';

describe('colorizeLines (diffView helper)', () => {
  it('marks added lines with green tag', () => {
    const result = colorizeLines(['+   image: nginx']);
    expect(result[0]).toContain('{green-fg}');
    expect(result[0]).toContain('{/green-fg}');
  });

  it('marks removed lines with red tag', () => {
    const result = colorizeLines(['-   image: alpine']);
    expect(result[0]).toContain('{red-fg}');
    expect(result[0]).toContain('{/red-fg}');
  });

  it('marks changed lines with yellow tag', () => {
    const result = colorizeLines(['~   ports: changed']);
    expect(result[0]).toContain('{yellow-fg}');
  });

  it('marks unchanged lines with gray tag', () => {
    const result = colorizeLines(['=   restart: always']);
    expect(result[0]).toContain('{gray-fg}');
  });

  it('leaves header lines uncolored', () => {
    const result = colorizeLines(['service: web']);
    expect(result[0]).toBe('service: web');
  });

  it('handles empty input', () => {
    expect(colorizeLines([])).toEqual([]);
  });

  it('processes multiple lines', () => {
    const lines = ['+add', '-remove', '=same', 'header'];
    const result = colorizeLines(lines);
    expect(result).toHaveLength(4);
    expect(result[0]).toContain('{green-fg}');
    expect(result[1]).toContain('{red-fg}');
    expect(result[2]).toContain('{gray-fg}');
    expect(result[3]).toBe('header');
  });
});
