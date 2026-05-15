import { buildFilterBarText, buildFilterHintText, applyFilterToLines } from './filterBar';
import { createFilterState, setFilterMode, setSearchQuery, setServiceFilter } from './filterState';

describe('buildFilterBarText', () => {
  it('shows default all mode', () => {
    const state = createFilterState();
    const text = buildFilterBarText(state);
    expect(text).toContain('Filter:');
    expect(text).toContain('All');
  });

  it('shows added mode in green', () => {
    const state = setFilterMode(createFilterState(), 'added');
    const text = buildFilterBarText(state);
    expect(text).toContain('{green-fg}');
    expect(text).toContain('Added');
  });

  it('includes search query when set', () => {
    const state = setSearchQuery(createFilterState(), 'nginx');
    const text = buildFilterBarText(state);
    expect(text).toContain('Search:');
    expect(text).toContain('nginx');
  });

  it('omits search text when query is empty', () => {
    const state = createFilterState();
    const text = buildFilterBarText(state);
    expect(text).not.toContain('Search:');
  });

  it('includes service filter when set', () => {
    const state = setServiceFilter(createFilterState(), 'web');
    const text = buildFilterBarText(state);
    expect(text).toContain('Service:');
    expect(text).toContain('web');
  });
});

describe('buildFilterHintText', () => {
  it('returns hint string with key bindings', () => {
    const text = buildFilterHintText();
    expect(text).toContain('[f]');
    expect(text).toContain('[/]');
    expect(text).toContain('[esc]');
  });
});

describe('applyFilterToLines', () => {
  const lines = [
    'web:',
    '+  image: nginx',
    '   ports: 80:80',
    'db:',
    '-  image: postgres:12',
    '+  image: postgres:14',
  ];

  it('returns all lines when no filter active', () => {
    const state = createFilterState();
    expect(applyFilterToLines(lines, state)).toEqual(lines);
  });

  it('filters to added lines only', () => {
    const state = setFilterMode(createFilterState(), 'added');
    const result = applyFilterToLines(lines, state);
    expect(result.every(l => l.includes('+'))).toBe(true);
  });

  it('filters by search query', () => {
    const state = setSearchQuery(createFilterState(), 'nginx');
    const result = applyFilterToLines(lines, state);
    expect(result.every(l => l.toLowerCase().includes('nginx'))).toBe(true);
  });
});
