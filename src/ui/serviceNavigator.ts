/**
 * serviceNavigator.ts
 * Manages navigation between services in the diff view.
 */

export interface ServiceNavigatorState {
  serviceNames: string[];
  currentIndex: number;
}

export function createServiceNavigator(
  serviceNames: string[]
): ServiceNavigatorState {
  return {
    serviceNames: [...serviceNames],
    currentIndex: serviceNames.length > 0 ? 0 : -1,
  };
}

export function nextService(
  state: ServiceNavigatorState
): ServiceNavigatorState {
  if (state.serviceNames.length === 0) return state;
  const nextIndex = (state.currentIndex + 1) % state.serviceNames.length;
  return { ...state, currentIndex: nextIndex };
}

export function prevService(
  state: ServiceNavigatorState
): ServiceNavigatorState {
  if (state.serviceNames.length === 0) return state;
  const prevIndex =
    (state.currentIndex - 1 + state.serviceNames.length) %
    state.serviceNames.length;
  return { ...state, currentIndex: prevIndex };
}

export function jumpToService(
  state: ServiceNavigatorState,
  name: string
): ServiceNavigatorState {
  const index = state.serviceNames.indexOf(name);
  if (index === -1) return state;
  return { ...state, currentIndex: index };
}

export function getCurrentService(
  state: ServiceNavigatorState
): string | null {
  if (state.currentIndex < 0 || state.serviceNames.length === 0) return null;
  return state.serviceNames[state.currentIndex];
}

export function getTotalServices(state: ServiceNavigatorState): number {
  return state.serviceNames.length;
}

/**
 * Returns a human-readable position string for the current service,
 * e.g. "2 / 5". Returns null if there are no services.
 */
export function getPositionLabel(state: ServiceNavigatorState): string | null {
  if (state.serviceNames.length === 0 || state.currentIndex < 0) return null;
  return `${state.currentIndex + 1} / ${state.serviceNames.length}`;
}
