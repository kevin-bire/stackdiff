/**
 * zoomState — manages font/zoom level for the diff view
 * Supports discrete zoom steps and clamped min/max levels.
 */

export type ZoomState = {
  level: number;
  minLevel: number;
  maxLevel: number;
  step: number;
};

export function createZoomState(
  initial = 0,
  minLevel = -3,
  maxLevel = 3,
  step = 1
): ZoomState {
  return {
    level: clamp(initial, minLevel, maxLevel),
    minLevel,
    maxLevel,
    step,
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function zoomIn(state: ZoomState): ZoomState {
  return {
    ...state,
    level: clamp(state.level + state.step, state.minLevel, state.maxLevel),
  };
}

export function zoomOut(state: ZoomState): ZoomState {
  return {
    ...state,
    level: clamp(state.level - state.step, state.minLevel, state.maxLevel),
  };
}

export function resetZoom(state: ZoomState): ZoomState {
  return { ...state, level: 0 };
}

export function isAtMin(state: ZoomState): boolean {
  return state.level <= state.minLevel;
}

export function isAtMax(state: ZoomState): boolean {
  return state.level >= state.maxLevel;
}

/**
 * Returns a scaling multiplier based on the zoom level.
 * Level 0 => 1.0, each step adds 0.15.
 */
export function getZoomMultiplier(state: ZoomState): number {
  return 1.0 + state.level * 0.15;
}

/**
 * Given a base column width, returns the adjusted width for the current zoom.
 */
export function applyZoomToWidth(state: ZoomState, baseWidth: number): number {
  return Math.max(10, Math.round(baseWidth * getZoomMultiplier(state)));
}

export function formatZoomLabel(state: ZoomState): string {
  if (state.level === 0) return "Zoom: 100%";
  const pct = Math.round(getZoomMultiplier(state) * 100);
  return `Zoom: ${pct}%`;
}
