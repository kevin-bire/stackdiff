/**
 * splitViewState — manages side-by-side vs unified diff view layout
 */

export type ViewMode = "unified" | "split";

export interface SplitViewState {
  mode: ViewMode;
  leftLabel: string;
  rightLabel: string;
  focusedPane: "left" | "right";
}

export function createSplitViewState(
  leftLabel = "Source A",
  rightLabel = "Source B"
): SplitViewState {
  return {
    mode: "unified",
    leftLabel,
    rightLabel,
    focusedPane: "left",
  };
}

export function toggleViewMode(state: SplitViewState): SplitViewState {
  return {
    ...state,
    mode: state.mode === "unified" ? "split" : "unified",
  };
}

export function setViewMode(state: SplitViewState, mode: ViewMode): SplitViewState {
  return { ...state, mode };
}

export function focusPane(
  state: SplitViewState,
  pane: "left" | "right"
): SplitViewState {
  return { ...state, focusedPane: pane };
}

export function toggleFocusedPane(state: SplitViewState): SplitViewState {
  return {
    ...state,
    focusedPane: state.focusedPane === "left" ? "right" : "left",
  };
}

export function isSplitMode(state: SplitViewState): boolean {
  return state.mode === "split";
}

export function getPaneLabels(
  state: SplitViewState
): { left: string; right: string } {
  return { left: state.leftLabel, right: state.rightLabel };
}
