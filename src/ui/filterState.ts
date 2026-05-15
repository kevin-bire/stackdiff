export type FilterMode = 'all' | 'changed' | 'added' | 'removed';

export interface FilterState {
  mode: FilterMode;
  searchQuery: string;
  activeServiceFilter: string | null;
}

export function createFilterState(): FilterState {
  return {
    mode: 'all',
    searchQuery: '',
    activeServiceFilter: null,
  };
}

export function setFilterMode(state: FilterState, mode: FilterMode): FilterState {
  return { ...state, mode };
}

export function setSearchQuery(state: FilterState, query: string): FilterState {
  return { ...state, searchQuery: query };
}

export function setServiceFilter(state: FilterState, service: string | null): FilterState {
  return { ...state, activeServiceFilter: service };
}

export function cycleFilterMode(state: FilterState): FilterState {
  const modes: FilterMode[] = ['all', 'changed', 'added', 'removed'];
  const currentIndex = modes.indexOf(state.mode);
  const nextMode = modes[(currentIndex + 1) % modes.length];
  return { ...state, mode: nextMode };
}

export function matchesFilter(state: FilterState, line: string): boolean {
  if (state.searchQuery && !line.toLowerCase().includes(state.searchQuery.toLowerCase())) {
    return false;
  }
  if (state.mode === 'changed') return line.includes('~');
  if (state.mode === 'added') return line.startsWith('+');
  if (state.mode === 'removed') return line.startsWith('-');
  return true;
}
