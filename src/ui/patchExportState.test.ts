import {
  createPatchExportState,
  setFormat,
  cycleFormat,
  setContextLines,
  toggleHeader,
  markExported,
  markExportError,
  buildPatchLines,
} from './patchExportState';

describe('createPatchExportState', () => {
  it('returns default state', () => {
    const s = createPatchExportState();
    expect(s.format).toBe('unified');
    expect(s.contextLines).toBe(3);
    expect(s.includeHeader).toBe(true);
    expect(s.lastExportedAt).toBeNull();
    expect(s.error).toBeNull();
  });
});

describe('setFormat', () => {
  it('sets the format and clears error', () => {
    const s = markExportError(createPatchExportState(), 'oops');
    const next = setFormat(s, 'context');
    expect(next.format).toBe('context');
    expect(next.error).toBeNull();
  });
});

describe('cycleFormat', () => {
  it('cycles through formats', () => {
    let s = createPatchExportState();
    s = cycleFormat(s); expect(s.format).toBe('context');
    s = cycleFormat(s); expect(s.format).toBe('minimal');
    s = cycleFormat(s); expect(s.format).toBe('unified');
  });
});

describe('setContextLines', () => {
  it('clamps to 0–10', () => {
    const s = createPatchExportState();
    expect(setContextLines(s, -1).contextLines).toBe(0);
    expect(setContextLines(s, 15).contextLines).toBe(10);
    expect(setContextLines(s, 5).contextLines).toBe(5);
  });
});

describe('toggleHeader', () => {
  it('toggles includeHeader', () => {
    const s = createPatchExportState();
    expect(toggleHeader(s).includeHeader).toBe(false);
    expect(toggleHeader(toggleHeader(s)).includeHeader).toBe(true);
  });
});

describe('markExported', () => {
  it('records path and timestamp', () => {
    const before = Date.now();
    const s = markExported(createPatchExportState(), '/tmp/out.patch');
    expect(s.lastExportPath).toBe('/tmp/out.patch');
    expect(s.lastExportedAt).toBeGreaterThanOrEqual(before);
    expect(s.error).toBeNull();
  });
});

describe('markExportError', () => {
  it('stores error message', () => {
    const s = markExportError(createPatchExportState(), 'write failed');
    expect(s.error).toBe('write failed');
  });
});

describe('buildPatchLines', () => {
  const lines = [' ctx', '+added', '-removed', ' ctx2'];

  it('includes header when requested', () => {
    const out = buildPatchLines(lines, 'unified', 3, true);
    expect(out[0]).toBe('--- a/compose');
    expect(out).toContain('+added');
  });

  it('excludes header when not requested', () => {
    const out = buildPatchLines(lines, 'unified', 3, false);
    expect(out[0]).toBe(' ctx');
  });

  it('minimal format keeps only + and - lines', () => {
    const out = buildPatchLines(lines, 'minimal', 3, false);
    expect(out).toEqual(['+added', '-removed']);
  });
});
