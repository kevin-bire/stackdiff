/**
 * diffTagState — manage user-defined tags on diff services
 */

export interface DiffTag {
  label: string;
  color: string;
}

export interface DiffTagState {
  tags: Map<string, Set<string>>; // serviceName -> Set of tag labels
  defined: Map<string, DiffTag>;  // label -> DiffTag definition
}

const DEFAULT_TAGS: DiffTag[] = [
  { label: 'reviewed', color: 'green' },
  { label: 'needs-attention', color: 'red' },
  { label: 'wip', color: 'yellow' },
];

export function createDiffTagState(): DiffTagState {
  const defined = new Map<string, DiffTag>();
  for (const tag of DEFAULT_TAGS) {
    defined.set(tag.label, tag);
  }
  return { tags: new Map(), defined };
}

export function defineTag(state: DiffTagState, tag: DiffTag): DiffTagState {
  return {
    ...state,
    defined: new Map(state.defined).set(tag.label, tag),
  };
}

export function addTag(state: DiffTagState, service: string, label: string): DiffTagState {
  if (!state.defined.has(label)) return state;
  const next = new Map(state.tags);
  const existing = new Set(next.get(service) ?? []);
  existing.add(label);
  next.set(service, existing);
  return { ...state, tags: next };
}

export function removeTag(state: DiffTagState, service: string, label: string): DiffTagState {
  const next = new Map(state.tags);
  const existing = new Set(next.get(service) ?? []);
  existing.delete(label);
  if (existing.size === 0) next.delete(service);
  else next.set(service, existing);
  return { ...state, tags: next };
}

export function toggleTag(state: DiffTagState, service: string, label: string): DiffTagState {
  const current = state.tags.get(service);
  if (current?.has(label)) return removeTag(state, service, label);
  return addTag(state, service, label);
}

export function getTagsForService(state: DiffTagState, service: string): DiffTag[] {
  const labels = state.tags.get(service);
  if (!labels) return [];
  return Array.from(labels)
    .map(l => state.defined.get(l))
    .filter((t): t is DiffTag => t !== undefined);
}

export function getServicesWithTag(state: DiffTagState, label: string): string[] {
  const result: string[] = [];
  for (const [service, labels] of state.tags) {
    if (labels.has(label)) result.push(service);
  }
  return result;
}

export function formatTagLine(state: DiffTagState, service: string): string {
  const tags = getTagsForService(state, service);
  if (tags.length === 0) return '';
  return tags.map(t => `[${t.label}]`).join(' ');
}
