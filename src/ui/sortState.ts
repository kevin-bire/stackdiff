export type SortField = 'name' | 'changeCount' | 'status';
export type SortDirection = 'asc' | 'desc';

export interface SortState {
  field: SortField;
  direction: SortDirection;
}

export function createSortState(field: SortField = 'name', direction: SortDirection = 'asc'): SortState {
  return { field, direction };
}

export function setSort(state: SortState, field: SortField): SortState {
  if (state.field === field) {
    return { ...state, direction: state.direction === 'asc' ? 'desc' : 'asc' };
  }
  return { field, direction: 'asc' };
}

export function cycleSortField(state: SortState): SortState {
  const fields: SortField[] = ['name', 'changeCount', 'status'];
  const idx = fields.indexOf(state.field);
  const next = fields[(idx + 1) % fields.length];
  return { field: next, direction: 'asc' };
}

export function toggleSortDirection(state: SortState): SortState {
  return { ...state, direction: state.direction === 'asc' ? 'desc' : 'asc' };
}

export interface SortableService {
  name: string;
  changeCount: number;
  status: 'added' | 'removed' | 'modified' | 'unchanged';
}

const STATUS_ORDER: Record<SortableService['status'], number> = {
  added: 0,
  removed: 1,
  modified: 2,
  unchanged: 3,
};

export function sortServices(services: SortableService[], state: SortState): SortableService[] {
  const sorted = [...services].sort((a, b) => {
    let cmp = 0;
    if (state.field === 'name') {
      cmp = a.name.localeCompare(b.name);
    } else if (state.field === 'changeCount') {
      cmp = a.changeCount - b.changeCount;
    } else if (state.field === 'status') {
      cmp = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
    }
    return state.direction === 'asc' ? cmp : -cmp;
  });
  return sorted;
}

export function formatSortLabel(state: SortState): string {
  const arrow = state.direction === 'asc' ? '↑' : '↓';
  return `Sort: ${state.field} ${arrow}`;
}
