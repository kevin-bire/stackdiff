/**
 * mouseState.ts
 * Tracks mouse interaction state for the TUI, including click position,
 * scroll wheel events, and hover tracking.
 */

export type MouseButton = 'left' | 'right' | 'middle' | 'wheelup' | 'wheeldown';

export interface MouseEvent {
  x: number;
  y: number;
  button: MouseButton;
}

export interface MouseState {
  lastClick: MouseEvent | null;
  lastHover: { x: number; y: number } | null;
  clickCount: number;
  scrollDelta: number;
  enabled: boolean;
}

export function createMouseState(): MouseState {
  return {
    lastClick: null,
    lastHover: null,
    clickCount: 0,
    scrollDelta: 0,
    enabled: true,
  };
}

export function recordClick(state: MouseState, event: MouseEvent): MouseState {
  return {
    ...state,
    lastClick: event,
    clickCount: state.lastClick
      ? state.clickCount + 1
      : 1,
  };
}

export function recordHover(state: MouseState, x: number, y: number): MouseState {
  return {
    ...state,
    lastHover: { x, y },
  };
}

export function recordScroll(
  state: MouseState,
  direction: 'up' | 'down',
  amount = 1
): MouseState {
  const delta = direction === 'up' ? -amount : amount;
  return {
    ...state,
    scrollDelta: state.scrollDelta + delta,
    lastClick: {
      x: state.lastHover?.x ?? 0,
      y: state.lastHover?.y ?? 0,
      button: direction === 'up' ? 'wheelup' : 'wheeldown',
    },
  };
}

export function toggleMouse(state: MouseState): MouseState {
  return { ...state, enabled: !state.enabled };
}

export function resetScrollDelta(state: MouseState): MouseState {
  return { ...state, scrollDelta: 0 };
}

export function isDoubleClick(state: MouseState, event: MouseEvent): boolean {
  if (!state.lastClick) return false;
  return (
    state.lastClick.x === event.x &&
    state.lastClick.y === event.y &&
    state.lastClick.button === event.button &&
    state.clickCount >= 1
  );
}

/**
 * Returns true if the given coordinates fall within the specified rectangular
 * region (inclusive on all edges).
 */
export function isWithinBounds(
  x: number,
  y: number,
  region: { x: number; y: number; width: number; height: number }
): boolean {
  return (
    x >= region.x &&
    x < region.x + region.width &&
    y >= region.y &&
    y < region.y + region.height
  );
}
