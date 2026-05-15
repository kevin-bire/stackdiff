import {
  createFilterState,
  setFilterMode,
  setSearchQuery,
  setServiceFilter,
  cycleFilterMode,
  matchesFilter,
} from './filterState';

describe('createFilterState', () => {
  it('returns default state', () => {
    const state = createFilterState();
    expect(state.mode).toBe('all');
    expect(state.searchQuery).toBe('');
    expect(state.activeServiceFilter).toBeNull();
  });
});

describe('setFilterMode', () => {
  it('updates mode immutably', () => {
    const state = createFilterState();
    const next = setFilterMode(state, 'added');
    expect(next.mode).toBe('added');
    expect(state.mode).toBe('all');
  });
});

describe('setSearchQuery', () => {
  it('updates search query', () => {
    const state = createFilterState();
    const next = setSearchQuery(state, 'nginx');
    expect(next.searchQuery).toBe('nginx');
  });
});

describe('setServiceFilter', () => {
  it('sets active service filter', () => {
    const state = createFilterState();
    const next = setServiceFilter(state, 'web');
    expect(next.activeServiceFilter).toBe('web');
  });

  it('can clear service filter', () => {
    const state = setServiceFilter(createFilterState(), 'web');
    const next = setServiceFilter(state, null);
    expect(next.activeServiceFilter).toBeNull();
  });
});

describe('cycleFilterMode', () => {
  it('cycles through all modes', () => {
    let state = createFilterState();
    state = cycleFilterMode(state);
    expect(state.mode).toBe('changed');
    state = cycleFilterMode(state);
    expect(state.mode).toBe('added');
    state = cycleFilterMode(state);
    expect(state.mode).toBe('removed');
    state = cycleFilterMode(state);
    expect(state.mode).toBe('all');
  });
});

describe('matchesFilter', () => {
  it('matches all lines in all mode', () => {
    const state = createFilterState();
    expect(matchesFilter(state, '  image: nginx')).toBe(true);
    expect(matchesFilter(state, '+ image: nginx')).toBe(true);
  });

  it('filters by search query case-insensitively', () => {
    const state = setSearchQuery(createFilterState(), 'NGINX');
    expect(matchesFilter(state, '  image: nginx')).toBe(true);
    expect(matchesFilter(state, '  image: redis')).toBe(false);
  });

  it('filters added lines', () => {
    const state = setFilterMode(createFilterState(), 'added');
    expect(matchesFilter(state, '+ image: nginx')).toBe(true);
    expect(matchesFilter(state, '- image: nginx')).toBe(false);
    expect(matchesFilter(state, '  image: nginx')).toBe(false);
  });

  it('filters removed lines', () => {
    const state = setFilterMode(createFilterState(), 'removed');
    expect(matchesFilter(state, '- image: nginx')).toBe(true);
    expect(matchesFilter(state, '+ image: nginx')).toBe(false);
  });
});
