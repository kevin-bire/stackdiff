import {
  buildExportStatusText,
  buildExportHintText,
  buildExportPreviewHeader,
  formatExportTimestamp,
} from './patchExportBar';
import {
  createPatchExportState,
  markExported,
  markExportError,
  setFormat,
  toggleHeader,
} from './patchExportState';

describe('buildExportStatusText', () => {
  it('shows format, ctx, and hdr defaults', () => {
    const s = createPatchExportState();
    const text = buildExportStatusText(s);
    expect(text).toContain('Unified');
    expect(text).toContain('ctx:3');
    expect(text).toContain('hdr:on');
  });

  it('reflects hdr:off when header disabled', () => {
    const s = toggleHeader(createPatchExportState());
    expect(buildExportStatusText(s)).toContain('hdr:off');
  });

  it('shows saved path after export', () => {
    const s = markExported(createPatchExportState(), '/out/diff.patch');
    expect(buildExportStatusText(s)).toContain('Saved: /out/diff.patch');
  });

  it('shows error message on failure', () => {
    const s = markExportError(createPatchExportState(), 'disk full');
    expect(buildExportStatusText(s)).toContain('Error: disk full');
  });

  it('reflects context format label', () => {
    const s = setFormat(createPatchExportState(), 'context');
    expect(buildExportStatusText(s)).toContain('Context');
  });
});

describe('buildExportHintText', () => {
  it('contains key hints', () => {
    const hint = buildExportHintText();
    expect(hint).toContain('[f]');
    expect(hint).toContain('[e] export');
    expect(hint).toContain('[q] close');
  });
});

describe('buildExportPreviewHeader', () => {
  it('includes format and service count', () => {
    const s = createPatchExportState();
    const h = buildExportPreviewHeader(s, 4);
    expect(h).toContain('Unified');
    expect(h).toContain('4 service(s)');
    expect(h).toContain('ctx:3');
  });
});

describe('formatExportTimestamp', () => {
  it('returns never for null', () => {
    expect(formatExportTimestamp(null)).toBe('never');
  });

  it('returns ISO-like string for a timestamp', () => {
    const ts = new Date('2024-06-01T12:00:00Z').getTime();
    const result = formatExportTimestamp(ts);
    expect(result).toMatch(/2024-06-01/);
    expect(result.length).toBe(19);
  });
});
