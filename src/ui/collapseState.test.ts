import {
  createCollapseState,
  collapseService,
  expandService,
  toggleCollapse,
  isCollapsed,
  collapseAll,
  expandAll,
  applyCollapseToLines,
} from './collapseState';

describe('collapseState', () => {
  it('creates empty collapse state', () => {
    const state = createCollapseState();
    expect(state.collapsed.size).toBe(0);
    expect(state.allCollapsed).toBe(false);
  });

  it('collapses a service', () => {
    const state = createCollapseState();
    const next = collapseService(state, 'web');
    expect(isCollapsed(next, 'web')).toBe(true);
    expect(isCollapsed(next, 'db')).toBe(false);
  });

  it('expands a collapsed service', () => {
    const state = collapseService(createCollapseState(), 'web');
    const next = expandService(state, 'web');
    expect(isCollapsed(next, 'web')).toBe(false);
  });

  it('toggles collapse on a service', () => {
    const state = createCollapseState();
    const collapsed = toggleCollapse(state, 'api');
    expect(isCollapsed(collapsed, 'api')).toBe(true);
    const expanded = toggleCollapse(collapsed, 'api');
    expect(isCollapsed(expanded, 'api')).toBe(false);
  });

  it('does not mutate original state', () => {
    const original = createCollapseState();
    collapseService(original, 'web');
    expect(original.collapsed.size).toBe(0);
  });

  it('collapses all services', () => {
    const state = createCollapseState();
    const next = collapseAll(state, ['web', 'db', 'cache']);
    expect(next.allCollapsed).toBe(true);
    expect(isCollapsed(next, 'web')).toBe(true);
    expect(isCollapsed(next, 'db')).toBe(true);
    expect(isCollapsed(next, 'cache')).toBe(true);
  });

  it('expands all services', () => {
    const state = collapseAll(createCollapseState(), ['web', 'db']);
    const next = expandAll(state);
    expect(next.collapsed.size).toBe(0);
    expect(next.allCollapsed).toBe(false);
  });

  it('returns lines unchanged when nothing is collapsed', () => {
    const state = createCollapseState();
    const lines = ['  web', '    image: nginx', '  db', '    image: postgres'];
    expect(applyCollapseToLines(lines, state, ['web', 'db'])).toEqual(lines);
  });

  it('appends {collapsed} marker to collapsed service header line', () => {
    const state = collapseService(createCollapseState(), 'web');
    const lines = ['  web', '    image: nginx', '  db', '    image: postgres'];
    const result = applyCollapseToLines(lines, state, ['web', 'db']);
    expect(result[0]).toContain('{collapsed}');
    expect(result).not.toContain('    image: nginx');
    expect(result).toContain('    image: postgres');
  });
});
