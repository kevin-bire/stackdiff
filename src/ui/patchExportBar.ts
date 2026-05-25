/**
 * patchExportBar — builds status/hint text for the patch export UI bar
 */

import type { PatchExportState, PatchExportFormat } from './patchExportState';

const FORMAT_LABELS: Record<PatchExportFormat, string> = {
  unified: 'Unified',
  context: 'Context',
  minimal: 'Minimal',
};

export function buildExportStatusText(state: PatchExportState): string {
  const fmt = FORMAT_LABELS[state.format];
  const ctx = `ctx:${state.contextLines}`;
  const hdr = state.includeHeader ? 'hdr:on' : 'hdr:off';
  const parts = [`Format: ${fmt}`, ctx, hdr];
  if (state.error) {
    parts.push(`Error: ${state.error}`);
  } else if (state.lastExportPath) {
    parts.push(`Saved: ${state.lastExportPath}`);
  }
  return parts.join('  |  ');
}

export function buildExportHintText(): string {
  return [
    '[f] cycle format',
    '[+/-] context lines',
    '[h] toggle header',
    '[e] export',
    '[q] close',
  ].join('  ');
}

export function buildExportPreviewHeader(
  state: PatchExportState,
  serviceCount: number
): string {
  const fmt = FORMAT_LABELS[state.format];
  return `Patch Export — ${fmt} — ${serviceCount} service(s) — ctx:${state.contextLines}`;
}

export function formatExportTimestamp(ts: number | null): string {
  if (ts === null) return 'never';
  return new Date(ts).toISOString().replace('T', ' ').slice(0, 19);
}
