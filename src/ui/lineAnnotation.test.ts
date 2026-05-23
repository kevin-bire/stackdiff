import {
  buildSourceLabel,
  deriveChangeTag,
  annotateLines,
  formatAnnotatedLine,
  formatAnnotatedLines,
} from './lineAnnotation';

describe('buildSourceLabel', () => {
  it('pads short labels to width', () => {
    expect(buildSourceLabel('main', 12)).toBe('main        ');
  });

  it('truncates long labels with ellipsis', () => {
    expect(buildSourceLabel('feature/very-long-branch', 12)).toBe('feature/very…');
    expect(buildSourceLabel('feature/very-long-branch', 12).length).toBe(13); // ellipsis is 1 char
  });

  it('uses default width of 12', () => {
    expect(buildSourceLabel('abc')).toHaveLength(12);
  });
});

describe('deriveChangeTag', () => {
  it('returns ADD for lines starting with +', () => {
    expect(deriveChangeTag('+ image: nginx')).toBe('ADD');
    expect(deriveChangeTag('  + image: nginx')).toBe('ADD');
  });

  it('returns DEL for lines starting with -', () => {
    expect(deriveChangeTag('- image: redis')).toBe('DEL');
  });

  it('returns MOD for lines starting with ~', () => {
    expect(deriveChangeTag('~ ports: [80]')).toBe('MOD');
  });

  it('returns null for context lines', () => {
    expect(deriveChangeTag('  image: nginx')).toBeNull();
    expect(deriveChangeTag('')).toBeNull();
  });
});

describe('annotateLines', () => {
  const lines = ['+ image: nginx', '- image: redis', '  ports: [80]'];

  it('assigns sequential line numbers starting at startLine', () => {
    const result = annotateLines(lines, 'main', 5);
    expect(result[0].annotation.lineNumber).toBe(5);
    expect(result[1].annotation.lineNumber).toBe(6);
    expect(result[2].annotation.lineNumber).toBe(7);
  });

  it('sets sourceLabel on each annotation', () => {
    const result = annotateLines(lines, 'main');
    result.forEach((al) => {
      expect(al.annotation.sourceLabel).toBe('main        ');
    });
  });

  it('derives correct change tags', () => {
    const result = annotateLines(lines, 'main');
    expect(result[0].annotation.changeTag).toBe('ADD');
    expect(result[1].annotation.changeTag).toBe('DEL');
    expect(result[2].annotation.changeTag).toBeNull();
  });

  it('defaults startLine to 1', () => {
    const result = annotateLines(['foo'], 'src');
    expect(result[0].annotation.lineNumber).toBe(1);
  });
});

describe('formatAnnotatedLine', () => {
  it('formats a line with all annotation fields', () => {
    const al = annotateLines(['+ image: nginx'], 'main', 3)[0];
    const formatted = formatAnnotatedLine(al);
    expect(formatted).toContain('3');
    expect(formatted).toContain('main');
    expect(formatted).toContain('ADD');
    expect(formatted).toContain('+ image: nginx');
  });

  it('hides line numbers when showLineNumbers is false', () => {
    const al = annotateLines(['- port: 80'], 'dev', 10)[0];
    const formatted = formatAnnotatedLine(al, false);
    expect(formatted).not.toMatch(/\b10\b/);
    expect(formatted).toContain('DEL');
  });
});

describe('formatAnnotatedLines', () => {
  it('returns an array of formatted strings', () => {
    const lines = ['+ a', '- b'];
    const annotated = annotateLines(lines, 'branch');
    const result = formatAnnotatedLines(annotated);
    expect(result).toHaveLength(2);
    result.forEach((r) => expect(typeof r).toBe('string'));
  });
});
