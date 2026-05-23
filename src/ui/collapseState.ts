/**
 * collapseState.ts
 * Tracks which services are collapsed/expanded in the diff view.
 */

export interface CollapseState {
  collapsed: Set<string>;
  allCollapsed: boolean;
}

export function createCollapseState(): CollapseState {
  return {
    collapsed: new Set<string>(),
    allCollapsed: false,
  };
}

export function collapseService(state: CollapseState, serviceName: string): CollapseState {
  const collapsed = new Set(state.collapsed);
  collapsed.add(serviceName);
  return { ...state, collapsed };
}

export function expandService(state: CollapseState, serviceName: string): CollapseState {
  const collapsed = new Set(state.collapsed);
  collapsed.delete(serviceName);
  return { ...state, collapsed };
}

export function toggleCollapse(state: CollapseState, serviceName: string): CollapseState {
  return isCollapsed(state, serviceName)
    ? expandService(state, serviceName)
    : collapseService(state, serviceName);
}

export function isCollapsed(state: CollapseState, serviceName: string): boolean {
  return state.collapsed.has(serviceName);
}

export function collapseAll(state: CollapseState, serviceNames: string[]): CollapseState {
  const collapsed = new Set(serviceNames);
  return { ...state, collapsed, allCollapsed: true };
}

export function expandAll(state: CollapseState): CollapseState {
  return { collapsed: new Set<string>(), allCollapsed: false };
}

export function applyCollapseToLines(
  lines: string[],
  state: CollapseState,
  serviceNames: string[]
): string[] {
  if (state.collapsed.size === 0) return lines;

  const result: string[] = [];
  let currentService: string | null = null;
  let skipping = false;

  for (const line of lines) {
    const matchedService = serviceNames.find((svc) => line.includes(`[${svc}]`) || line.startsWith(`  ${svc}`) || line === svc);
    if (matchedService) {
      currentService = matchedService;
      skipping = isCollapsed(state, matchedService);
      result.push(line + (skipping ? ' {collapsed}' : ''));
      continue;
    }
    if (!skipping) {
      result.push(line);
    }
  }

  return result;
}
