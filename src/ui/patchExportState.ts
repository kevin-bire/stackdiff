/**
 * patchExportState — manages state for exporting diffs as unified patch format
 */

export type PatchExportFormat = 'unified' | 'context' | 'minimal';

export interface PatchExportState {
  format: PatchExportFormat;
  contextLines: number;
  includeHeader: boolean;
  lastExportedAt: number | null;
  lastExportPath: string | null;
  error: string | null;
}

export function createPatchExportState(): PatchExportState {
  return {
    format: 'unified',
    contextLines: 3,
    includeHeader: true,
    lastExportedAt: null,
    lastExportPath: null,
    error: null,
  };
}

export function setFormat(
  state: PatchExportState,
  format: PatchExportFormat
): PatchExportState {
  return { ...state, format, error: null };
}

export function cycleFormat(state: PatchExportState): PatchExportState {
  const order: PatchExportFormat[] = ['unified', 'context', 'minimal'];
  const next = order[(order.indexOf(state.format) + 1) % order.length];
  return setFormat(state, next);
}

export function setContextLines(
  state: PatchExportState,
  lines: number
): PatchExportState {
  const contextLines = Math.max(0, Math.min(10, lines));
  return { ...state, contextLines };
}

export function toggleHeader(state: PatchExportState): PatchExportState {
  return { ...state, includeHeader: !state.includeHeader };
}

export function markExported(
  state: PatchExportState,
  path: string
): PatchExportState {
  return {
    ...state,
    lastExportedAt: Date.now(),
    lastExportPath: path,
    error: null,
  };
}

export function markExportError(
  state: PatchExportState,
  error: string
): PatchExportState {
  return { ...state, error };
}

export function buildPatchLines(
  diffLines: string[],
  format: PatchExportFormat,
  contextLines: number,
  includeHeader: boolean
): string[] {
  const header = includeHeader
    ? [`--- a/compose`, `+++ b/compose`, `@@ diff (${format}, ctx:${contextLines}) @@`]
    : [];
  if (format === 'minimal') {
    return [
      ...header,
      ...diffLines.filter((l) => l.startsWith('+') || l.startsWith('-')),
    ];
  }
  return [...header, ...diffLines];
}
