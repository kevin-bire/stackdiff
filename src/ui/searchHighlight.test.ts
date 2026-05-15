import {
  escapeRegex,
  highlightMatches,
  highlightLines,
  countMatches,
} from './searchHighlight';

describe('escapeRegex', () => {
  it('escapes special regex characters', () => {
    expect(escapeRegex('foo.bar')).toBe('foo\\.bar');
    expect(escapeRegex('a+b*c?')).toBe('a\\+b\\*c\\?');
    expect(escapeRegex('normal')).toBe('normal');
  });
});

describe('highlightMatches', () => {
  it('returns original line with no match when query is empty', () => {
    const result = highlightMatches('hello world', '');
    expect(result.hasMatch).toBe(false);
    expect(result.line).toBe('hello world');
  });

  it('returns hasMatch false when query not found', () => {
    const result = highlightMatches('hello world', 'xyz');
    expect(result.hasMatch).toBe(false);
    expect(result.line).toBe('hello world');
  });

  it('wraps matched text in color tags', () => {
    const result = highlightMatches('hello world', 'world');
    expect(result.hasMatch).toBe(true);
    expect(result.line).toContain('{yellow-fg}world{/}');
  });

  it('is case-insensitive', () => {
    const result = highlightMatches('Hello World', 'hello');
    expect(result.hasMatch).toBe(true);
    expect(result.line).toContain('{yellow-fg}Hello{/}');
  });

  it('supports custom color tag', () => {
    const result = highlightMatches('foo bar', 'foo', '{red-fg}');
    expect(result.hasMatch).toBe(true);
    expect(result.line).toContain('{red-fg}foo{/}');
  });

  it('highlights multiple occurrences', () => {
    const result = highlightMatches('foo foo foo', 'foo');
    expect(result.hasMatch).toBe(true);
    const matches = result.line.match(/\{yellow-fg\}foo\{\//g) || [];
    expect(matches.length).toBe(3);
  });
});

describe('highlightLines', () => {
  const lines = ['image: nginx', 'ports: 80:80', 'image: redis'];

  it('returns original lines when query is empty', () => {
    expect(highlightLines(lines, '')).toEqual(lines);
  });

  it('highlights matching lines and passes through non-matching', () => {
    const result = highlightLines(lines, 'image');
    expect(result[0]).toContain('{yellow-fg}image{/}');
    expect(result[1]).toBe('ports: 80:80');
    expect(result[2]).toContain('{yellow-fg}image{/}');
  });

  it('filters non-matching lines when filterNonMatching is true', () => {
    const result = highlightLines(lines, 'image', true);
    expect(result.length).toBe(2);
    expect(result.every((l) => l.includes('{yellow-fg}image{/}'))).toBe(true);
  });
});

describe('countMatches', () => {
  const lines = ['image: nginx', 'ports: 80:80', 'image: redis', 'volumes: []'];

  it('returns 0 for empty query', () => {
    expect(countMatches(lines, '')).toBe(0);
  });

  it('counts lines with matches', () => {
    expect(countMatches(lines, 'image')).toBe(2);
  });

  it('returns 0 when no lines match', () => {
    expect(countMatches(lines, 'notfound')).toBe(0);
  });
});
