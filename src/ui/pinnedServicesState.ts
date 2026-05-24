/**
 * pinnedServicesState.ts
 * Manages a set of pinned (always-visible) services in the diff view.
 */

export interface PinnedServicesState {
  pinned: Set<string>;
  maxPins: number;
}

export function createPinnedServicesState(maxPins = 10): PinnedServicesState {
  return {
    pinned: new Set(),
    maxPins,
  };
}

export function pinService(
  state: PinnedServicesState,
  serviceName: string
): PinnedServicesState {
  if (state.pinned.has(serviceName) || state.pinned.size >= state.maxPins) {
    return state;
  }
  const pinned = new Set(state.pinned);
  pinned.add(serviceName);
  return { ...state, pinned };
}

export function unpinService(
  state: PinnedServicesState,
  serviceName: string
): PinnedServicesState {
  if (!state.pinned.has(serviceName)) {
    return state;
  }
  const pinned = new Set(state.pinned);
  pinned.delete(serviceName);
  return { ...state, pinned };
}

export function togglePin(
  state: PinnedServicesState,
  serviceName: string
): PinnedServicesState {
  return state.pinned.has(serviceName)
    ? unpinService(state, serviceName)
    : pinService(state, serviceName);
}

export function isPinned(
  state: PinnedServicesState,
  serviceName: string
): boolean {
  return state.pinned.has(serviceName);
}

export function getPinnedServices(state: PinnedServicesState): string[] {
  return Array.from(state.pinned);
}

export function clearPins(state: PinnedServicesState): PinnedServicesState {
  return { ...state, pinned: new Set() };
}

export function reorderLines(
  lines: string[],
  serviceLineMap: Map<string, number[]>,
  pinned: Set<string>
): string[] {
  const pinnedLines: string[] = [];
  const otherLines: string[] = [];
  const seen = new Set<number>();

  for (const svc of pinned) {
    const indices = serviceLineMap.get(svc) ?? [];
    for (const idx of indices) {
      if (!seen.has(idx)) {
        seen.add(idx);
        pinnedLines.push(lines[idx]);
      }
    }
  }

  lines.forEach((line, idx) => {
    if (!seen.has(idx)) otherLines.push(line);
  });

  return [...pinnedLines, ...otherLines];
}
