/**
 * sidebarState.ts
 * Manages the sidebar panel showing a list of services for quick navigation.
 */

export type SidebarState = {
  visible: boolean;
  services: string[];
  selectedIndex: number;
  width: number;
};

export function createSidebarState(services: string[] = [], width = 24): SidebarState {
  return {
    visible: false,
    services,
    selectedIndex: 0,
    width,
  };
}

export function toggleSidebar(state: SidebarState): SidebarState {
  return { ...state, visible: !state.visible };
}

export function showSidebar(state: SidebarState): SidebarState {
  return { ...state, visible: true };
}

export function hideSidebar(state: SidebarState): SidebarState {
  return { ...state, visible: false };
}

export function selectNextService(state: SidebarState): SidebarState {
  if (state.services.length === 0) return state;
  const next = (state.selectedIndex + 1) % state.services.length;
  return { ...state, selectedIndex: next };
}

export function selectPrevService(state: SidebarState): SidebarState {
  if (state.services.length === 0) return state;
  const prev = (state.selectedIndex - 1 + state.services.length) % state.services.length;
  return { ...state, selectedIndex: prev };
}

export function selectServiceByName(state: SidebarState, name: string): SidebarState {
  const idx = state.services.indexOf(name);
  if (idx === -1) return state;
  return { ...state, selectedIndex: idx };
}

export function getSelectedService(state: SidebarState): string | undefined {
  return state.services[state.selectedIndex];
}

export function setSidebarServices(state: SidebarState, services: string[]): SidebarState {
  return { ...state, services, selectedIndex: 0 };
}

export function renderSidebarLines(state: SidebarState): string[] {
  return state.services.map((name, i) => {
    const prefix = i === state.selectedIndex ? '> ' : '  ';
    const truncated = name.length > state.width - 3 ? name.slice(0, state.width - 5) + '..' : name;
    return `${prefix}${truncated}`;
  });
}
