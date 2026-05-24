/**
 * multiSelectState — manages multi-selection of services for bulk operations
 */

export interface MultiSelectState {
  selected: Set<string>;
  anchorService: string | null;
  active: boolean;
}

export function createMultiSelectState(): MultiSelectState {
  return {
    selected: new Set(),
    anchorService: null,
    active: false,
  };
}

export function toggleSelectService(
  state: MultiSelectState,
  serviceName: string
): MultiSelectState {
  const selected = new Set(state.selected);
  if (selected.has(serviceName)) {
    selected.delete(serviceName);
  } else {
    selected.add(serviceName);
  }
  return {
    ...state,
    selected,
    anchorService: serviceName,
    active: selected.size > 0,
  };
}

export function selectRange(
  state: MultiSelectState,
  allServices: string[],
  targetService: string
): MultiSelectState {
  const anchor = state.anchorService;
  if (!anchor) {
    return toggleSelectService(state, targetService);
  }
  const anchorIdx = allServices.indexOf(anchor);
  const targetIdx = allServices.indexOf(targetService);
  if (anchorIdx === -1 || targetIdx === -1) return state;
  const [from, to] = anchorIdx < targetIdx
    ? [anchorIdx, targetIdx]
    : [targetIdx, anchorIdx];
  const selected = new Set(state.selected);
  for (let i = from; i <= to; i++) {
    selected.add(allServices[i]);
  }
  return { ...state, selected, active: selected.size > 0 };
}

export function clearSelection(state: MultiSelectState): MultiSelectState {
  return { ...state, selected: new Set(), anchorService: null, active: false };
}

export function selectAll(
  state: MultiSelectState,
  allServices: string[]
): MultiSelectState {
  return {
    ...state,
    selected: new Set(allServices),
    anchorService: allServices[allServices.length - 1] ?? null,
    active: allServices.length > 0,
  };
}

export function getSelectedServices(state: MultiSelectState): string[] {
  return Array.from(state.selected);
}

export function isSelected(state: MultiSelectState, serviceName: string): boolean {
  return state.selected.has(serviceName);
}
