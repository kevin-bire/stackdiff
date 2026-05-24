import type { FilterState, FilterMode } from './filterState';

const MODE_LABELS: Record<FilterMode, string> = {
  all: 'All',
  changed: 'Changed',
  added: 'Added',
  removed: 'Removed',
};

const MODE_COLORS: Record<FilterMode, string> = {
  all: '{white-fg}',
  changed: '{yellow-fg}',
  added: '{green-fg}',
  removed: '{red-fg}',
};

export function buildFilterBarText(state: FilterState): string {
  const modeLabel = MODE_LABELS[state.mode];
  const modeColor = MODE_COLORS[state.mode];
  const modeText = `Filter: ${modeColor}${modeLabel}{/}`;

  const searchText = state.searchQuery
    ? ` | Search: {cyan-fg}${state.searchQuery}{/}`
    : '';

  const serviceText = state.activeServiceFilter
    ? ` | Service: {magenta-fg}${state.activeServiceFilter}{/}`
    : '';

  return `${modeText}${searchText}${serviceText}`;
}

export function buildFilterHintText(): string {
  return '{grey-fg}[f] cycle filter  [/] search  [esc] clear{/}';
}

/**
 * Returns the next filter mode in the cycle order:
 * all -> changed -> added -> removed -> all
 */
export function cycleFilterMode(current: FilterMode): FilterMode {
  const order: FilterMode[] = ['all', 'changed', 'added', 'removed'];
  const idx = order.indexOf(current);
  return order[(idx + 1) % order.length];
}

export function applyFilterToLines(lines: string[], state: FilterState): string[] {
  if (state.mode === 'all' && !state.searchQuery && !state.activeServiceFilter) {
    return lines;
  }

  const result: string[] = [];
  let inTargetService = state.activeServiceFilter === null;
  let inServiceBlock = false;

  for (const line of lines) {
    const isServiceHeader = /^\s{0,2}\w/.test(line) && line.endsWith(':');
    if (isServiceHeader) {
      const serviceName = line.trim().replace(':', '');
      inServiceBlock = true;
      inTargetService = state.activeServiceFilter === null || serviceName === state.activeServiceFilter;
    }

    if (!inTargetService || !inServiceBlock) continue;

    const stripped = line.replace(/\{[^}]+\}/g, '');
    if (state.searchQuery && !stripped.toLowerCase().includes(state.searchQuery.toLowerCase())) {
      continue;
    }

    if (state.mode === 'added' && !stripped.startsWith('+')) continue;
    if (state.mode === 'removed' && !stripped.startsWith('-')) continue;
    if (state.mode === 'changed' && !stripped.includes('~')) continue;

    result.push(line);
  }

  return result;
}
