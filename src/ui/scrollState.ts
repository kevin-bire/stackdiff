export interface ScrollState {
  offset: number;
  selectedIndex: number;
  totalItems: number;
  visibleLines: number;
}

export function createScrollState(totalItems: number, visibleLines: number): ScrollState {
  return {
    offset: 0,
    selectedIndex: 0,
    totalItems,
    visibleLines,
  };
}

export function scrollUp(state: ScrollState): ScrollState {
  const selectedIndex = Math.max(0, state.selectedIndex - 1);
  const offset = selectedIndex < state.offset ? selectedIndex : state.offset;
  return { ...state, selectedIndex, offset };
}

export function scrollDown(state: ScrollState): ScrollState {
  const selectedIndex = Math.min(state.totalItems - 1, state.selectedIndex + 1);
  const maxOffset = Math.max(0, state.totalItems - state.visibleLines);
  const offset =
    selectedIndex >= state.offset + state.visibleLines
      ? Math.min(maxOffset, state.offset + 1)
      : state.offset;
  return { ...state, selectedIndex, offset };
}

export function scrollToIndex(state: ScrollState, index: number): ScrollState {
  const selectedIndex = Math.max(0, Math.min(state.totalItems - 1, index));
  const maxOffset = Math.max(0, state.totalItems - state.visibleLines);
  const offset = Math.min(maxOffset, Math.max(0, selectedIndex - Math.floor(state.visibleLines / 2)));
  return { ...state, selectedIndex, offset };
}

export function getVisibleRange(state: ScrollState): { start: number; end: number } {
  return {
    start: state.offset,
    end: Math.min(state.totalItems, state.offset + state.visibleLines),
  };
}

export function updateTotalItems(state: ScrollState, totalItems: number): ScrollState {
  const selectedIndex = Math.min(state.selectedIndex, Math.max(0, totalItems - 1));
  const maxOffset = Math.max(0, totalItems - state.visibleLines);
  const offset = Math.min(state.offset, maxOffset);
  return { ...state, totalItems, selectedIndex, offset };
}
