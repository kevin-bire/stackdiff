import {
  createComparePanel,
  applyPanelFilter,
  getPanelHeader,
  getVisibleLines,
  getPanelSummary,
} from './comparePanel';
import { createFilterState, setSearchQuery, setFilterMode } from './filterState';
import { createScrollState } from './scrollState';

const mockLines = [
  '  image: nginx',
  '+ image: alpine',
  '  ports: 80:80',
  '- ports: 8080:80',
  '  env: NODE_ENV=prod',
];

describe('createComparePanel', () => {
  it('initializes with provided labels and lines', () => {
    const panel = createComparePanel({} as any, 'main', 'feature', mockLines);
    expect(panel.leftLabel).toBe('main');
    expect(panel.rightLabel).toBe('feature');
    expect(panel.lines).toEqual(mockLines);
    expect(panel.filteredLines).toEqual(mockLines);
    expect(panel.totalFiltered).toBe(mockLines.length);
  });
});

describe('applyPanelFilter', () => {
  it('filters lines by diff mode (added only)', () => {
    const panel = createComparePanel({} as any, 'a', 'b', mockLines);
    const filter = setFilterMode(createFilterState(), 'added');
    const result = applyPanelFilter(panel, filter);
    expect(result.filteredLines.every(l => l.startsWith('+'))).toBe(true);
  });

  it('highlights search query in lines', () => {
    const panel = createComparePanel({} as any, 'a', 'b', mockLines);
    const filter = setSearchQuery(createFilterState(), 'image');
    const result = applyPanelFilter(panel, filter);
    const hasHighlight = result.filteredLines.some(l => l.includes('{yellow-fg}'));
    expect(hasHighlight).toBe(true);
  });

  it('returns all lines when filter is default', () => {
    const panel = createComparePanel({} as any, 'a', 'b', mockLines);
    const filter = createFilterState();
    const result = applyPanelFilter(panel, filter);
    expect(result.totalFiltered).toBe(mockLines.length);
  });
});

describe('getPanelHeader', () => {
  it('includes both labels', () => {
    const panel = createComparePanel({} as any, 'main', 'dev', mockLines);
    const header = getPanelHeader(panel);
    expect(header).toContain('main');
    expect(header).toContain('dev');
  });
});

describe('getVisibleLines', () => {
  it('returns slice based on scroll state', () => {
    const panel = createComparePanel({} as any, 'a', 'b', mockLines);
    const scroll = createScrollState(3, mockLines.length);
    const visible = getVisibleLines(panel, scroll);
    expect(visible.length).toBeLessThanOrEqual(3);
  });
});

describe('getPanelSummary', () => {
  it('shows total when unfiltered', () => {
    const panel = createComparePanel({} as any, 'a', 'b', mockLines);
    expect(getPanelSummary(panel)).toBe('5 lines');
  });

  it('shows filtered count when filtered', () => {
    const panel = createComparePanel({} as any, 'a', 'b', mockLines);
    const filter = setFilterMode(createFilterState(), 'added');
    const filtered = applyPanelFilter(panel, filter);
    expect(getPanelSummary(filtered)).toContain('filtered');
  });
});
