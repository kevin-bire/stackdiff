/**
 * diffGroupState.ts
 * Manages grouping of diff services by a chosen field (e.g., image, network, status).
 */

export type GroupField = 'none' | 'image' | 'network' | 'status';

export interface DiffGroupState {
  field: GroupField;
  groups: Map<string, string[]>; // group key -> service names
  order: string[];               // ordered list of group keys
}

const GROUP_FIELDS: GroupField[] = ['none', 'image', 'network', 'status'];

export function createDiffGroupState(): DiffGroupState {
  return {
    field: 'none',
    groups: new Map(),
    order: [],
  };
}

export function setGroupField(state: DiffGroupState, field: GroupField): DiffGroupState {
  return { ...state, field };
}

export function cycleGroupField(state: DiffGroupState): DiffGroupState {
  const idx = GROUP_FIELDS.indexOf(state.field);
  const next = GROUP_FIELDS[(idx + 1) % GROUP_FIELDS.length];
  return { ...state, field: next };
}

export function buildGroups(
  state: DiffGroupState,
  services: string[],
  getField: (service: string, field: GroupField) => string
): DiffGroupState {
  if (state.field === 'none') {
    const groups = new Map<string, string[]>();
    groups.set('all', services);
    return { ...state, groups, order: ['all'] };
  }

  const groups = new Map<string, string[]>();
  for (const service of services) {
    const key = getField(service, state.field) || '(unset)';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(service);
  }

  const order = Array.from(groups.keys()).sort();
  return { ...state, groups, order };
}

export function getServicesInGroup(state: DiffGroupState, groupKey: string): string[] {
  return state.groups.get(groupKey) ?? [];
}

export function getAllGroupKeys(state: DiffGroupState): string[] {
  return state.order;
}

export function formatGroupHeader(field: GroupField, key: string): string {
  if (field === 'none') return '';
  return `[${field.toUpperCase()}: ${key}]`;
}
