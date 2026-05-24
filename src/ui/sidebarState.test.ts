import {
  createSidebarState,
  toggleSidebar,
  showSidebar,
  hideSidebar,
  selectNextService,
  selectPrevService,
  selectServiceByName,
  getSelectedService,
  setSidebarServices,
  renderSidebarLines,
} from './sidebarState';

const services = ['web', 'api', 'db', 'redis'];

describe('createSidebarState', () => {
  it('creates with defaults', () => {
    const s = createSidebarState();
    expect(s.visible).toBe(false);
    expect(s.services).toEqual([]);
    expect(s.selectedIndex).toBe(0);
    expect(s.width).toBe(24);
  });

  it('accepts initial services and width', () => {
    const s = createSidebarState(services, 32);
    expect(s.services).toEqual(services);
    expect(s.width).toBe(32);
  });
});

describe('toggleSidebar', () => {
  it('toggles visibility', () => {
    const s = createSidebarState();
    expect(toggleSidebar(s).visible).toBe(true);
    expect(toggleSidebar(toggleSidebar(s)).visible).toBe(false);
  });
});

describe('showSidebar / hideSidebar', () => {
  it('shows and hides', () => {
    const s = createSidebarState();
    expect(showSidebar(s).visible).toBe(true);
    expect(hideSidebar(showSidebar(s)).visible).toBe(false);
  });
});

describe('selectNextService', () => {
  it('advances index', () => {
    const s = createSidebarState(services);
    expect(selectNextService(s).selectedIndex).toBe(1);
  });

  it('wraps around', () => {
    const s = { ...createSidebarState(services), selectedIndex: 3 };
    expect(selectNextService(s).selectedIndex).toBe(0);
  });

  it('is a no-op for empty list', () => {
    const s = createSidebarState([]);
    expect(selectNextService(s).selectedIndex).toBe(0);
  });
});

describe('selectPrevService', () => {
  it('decrements index', () => {
    const s = { ...createSidebarState(services), selectedIndex: 2 };
    expect(selectPrevService(s).selectedIndex).toBe(1);
  });

  it('wraps around to end', () => {
    const s = createSidebarState(services);
    expect(selectPrevService(s).selectedIndex).toBe(3);
  });
});

describe('selectServiceByName', () => {
  it('selects by name', () => {
    const s = createSidebarState(services);
    expect(selectServiceByName(s, 'db').selectedIndex).toBe(2);
  });

  it('returns unchanged state for unknown name', () => {
    const s = createSidebarState(services);
    expect(selectServiceByName(s, 'unknown').selectedIndex).toBe(0);
  });
});

describe('getSelectedService', () => {
  it('returns current service name', () => {
    const s = { ...createSidebarState(services), selectedIndex: 1 };
    expect(getSelectedService(s)).toBe('api');
  });

  it('returns undefined for empty list', () => {
    expect(getSelectedService(createSidebarState([]))).toBeUndefined();
  });
});

describe('setSidebarServices', () => {
  it('resets index and sets services', () => {
    const s = { ...createSidebarState(services), selectedIndex: 3 };
    const updated = setSidebarServices(s, ['x', 'y']);
    expect(updated.services).toEqual(['x', 'y']);
    expect(updated.selectedIndex).toBe(0);
  });
});

describe('renderSidebarLines', () => {
  it('marks selected with >', () => {
    const s = createSidebarState(services);
    const lines = renderSidebarLines(s);
    expect(lines[0]).toMatch(/^> web/);
    expect(lines[1]).toMatch(/^  api/);
  });

  it('truncates long names', () => {
    const long = 'a-very-long-service-name-that-overflows';
    const s = createSidebarState([long], 20);
    const lines = renderSidebarLines(s);
    expect(lines[0].length).toBeLessThanOrEqual(20);
    expect(lines[0]).toContain('..');
  });
});
