import {
  createSortState,
  setSort,
  cycleSortField,
  toggleSortDirection,
  sortServices,
  formatSortLabel,
  SortableService,
} from './sortState';

const services: SortableService[] = [
  { name: 'web', changeCount: 3, status: 'modified' },
  { name: 'api', changeCount: 0, status: 'unchanged' },
  { name: 'db', changeCount: 5, status: 'added' },
  { name: 'cache', changeCount: 1, status: 'removed' },
];

describe('createSortState', () => {
  it('defaults to name asc', () => {
    const s = createSortState();
    expect(s.field).toBe('name');
    expect(s.direction).toBe('asc');
  });

  it('accepts custom initial values', () => {
    const s = createSortState('changeCount', 'desc');
    expect(s.field).toBe('changeCount');
    expect(s.direction).toBe('desc');
  });
});

describe('setSort', () => {
  it('sets new field with asc direction', () => {
    const s = createSortState();
    const next = setSort(s, 'changeCount');
    expect(next.field).toBe('changeCount');
    expect(next.direction).toBe('asc');
  });

  it('toggles direction when same field', () => {
    const s = createSortState('name', 'asc');
    const next = setSort(s, 'name');
    expect(next.direction).toBe('desc');
  });
});

describe('cycleSortField', () => {
  it('cycles through fields', () => {
    let s = createSortState('name');
    s = cycleSortField(s);
    expect(s.field).toBe('changeCount');
    s = cycleSortField(s);
    expect(s.field).toBe('status');
    s = cycleSortField(s);
    expect(s.field).toBe('name');
  });
});

describe('toggleSortDirection', () => {
  it('flips asc to desc', () => {
    expect(toggleSortDirection(createSortState('name', 'asc')).direction).toBe('desc');
  });
  it('flips desc to asc', () => {
    expect(toggleSortDirection(createSortState('name', 'desc')).direction).toBe('asc');
  });
});

describe('sortServices', () => {
  it('sorts by name asc', () => {
    const result = sortServices(services, createSortState('name', 'asc'));
    expect(result.map(s => s.name)).toEqual(['api', 'cache', 'db', 'web']);
  });

  it('sorts by name desc', () => {
    const result = sortServices(services, createSortState('name', 'desc'));
    expect(result.map(s => s.name)).toEqual(['web', 'db', 'cache', 'api']);
  });

  it('sorts by changeCount asc', () => {
    const result = sortServices(services, createSortState('changeCount', 'asc'));
    expect(result[0].changeCount).toBe(0);
    expect(result[result.length - 1].changeCount).toBe(5);
  });

  it('sorts by status asc', () => {
    const result = sortServices(services, createSortState('status', 'asc'));
    expect(result[0].status).toBe('added');
    expect(result[result.length - 1].status).toBe('unchanged');
  });
});

describe('formatSortLabel', () => {
  it('formats asc label', () => {
    expect(formatSortLabel(createSortState('name', 'asc'))).toBe('Sort: name ↑');
  });
  it('formats desc label', () => {
    expect(formatSortLabel(createSortState('changeCount', 'desc'))).toBe('Sort: changeCount ↓');
  });
});
