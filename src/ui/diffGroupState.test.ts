import {
  createDiffGroupState,
  setGroupField,
  cycleGroupField,
  buildGroups,
  getServicesInGroup,
  getAllGroupKeys,
  formatGroupHeader,
} from './diffGroupState';

const services = ['web', 'api', 'db', 'cache'];

function mockGetField(service: string, field: string): string {
  const data: Record<string, Record<string, string>> = {
    web:   { image: 'nginx', network: 'frontend', status: 'changed' },
    api:   { image: 'node',  network: 'backend',  status: 'changed' },
    db:    { image: 'postgres', network: 'backend', status: 'unchanged' },
    cache: { image: 'redis', network: 'backend', status: 'added' },
  };
  return data[service]?.[field] ?? '';
}

describe('createDiffGroupState', () => {
  it('defaults to none grouping', () => {
    const s = createDiffGroupState();
    expect(s.field).toBe('none');
    expect(s.groups.size).toBe(0);
  });
});

describe('setGroupField', () => {
  it('updates the group field', () => {
    const s = setGroupField(createDiffGroupState(), 'image');
    expect(s.field).toBe('image');
  });
});

describe('cycleGroupField', () => {
  it('cycles through all fields', () => {
    let s = createDiffGroupState();
    s = cycleGroupField(s); expect(s.field).toBe('image');
    s = cycleGroupField(s); expect(s.field).toBe('network');
    s = cycleGroupField(s); expect(s.field).toBe('status');
    s = cycleGroupField(s); expect(s.field).toBe('none');
  });
});

describe('buildGroups', () => {
  it('groups all under "all" when field is none', () => {
    const s = buildGroups(createDiffGroupState(), services, mockGetField);
    expect(s.order).toEqual(['all']);
    expect(getServicesInGroup(s, 'all')).toEqual(services);
  });

  it('groups by network correctly', () => {
    let s = setGroupField(createDiffGroupState(), 'network');
    s = buildGroups(s, services, mockGetField);
    expect(getAllGroupKeys(s).sort()).toEqual(['backend', 'frontend']);
    expect(getServicesInGroup(s, 'backend').sort()).toEqual(['api', 'cache', 'db']);
    expect(getServicesInGroup(s, 'frontend')).toEqual(['web']);
  });

  it('groups by status correctly', () => {
    let s = setGroupField(createDiffGroupState(), 'status');
    s = buildGroups(s, services, mockGetField);
    expect(getAllGroupKeys(s)).toContain('changed');
    expect(getServicesInGroup(s, 'changed').sort()).toEqual(['api', 'web']);
  });
});

describe('formatGroupHeader', () => {
  it('returns empty string for none', () => {
    expect(formatGroupHeader('none', 'all')).toBe('');
  });

  it('formats header for a field', () => {
    expect(formatGroupHeader('image', 'nginx')).toBe('[IMAGE: nginx]');
  });
});
