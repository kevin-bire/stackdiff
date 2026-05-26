import {
  createDiffTagState,
  defineTag,
  addTag,
  removeTag,
  toggleTag,
  getTagsForService,
  getServicesWithTag,
  formatTagLine,
} from './diffTagState';

describe('createDiffTagState', () => {
  it('initializes with default tags defined', () => {
    const state = createDiffTagState();
    expect(state.defined.has('reviewed')).toBe(true);
    expect(state.defined.has('needs-attention')).toBe(true);
    expect(state.defined.has('wip')).toBe(true);
    expect(state.tags.size).toBe(0);
  });
});

describe('defineTag', () => {
  it('adds a new custom tag', () => {
    const state = createDiffTagState();
    const next = defineTag(state, { label: 'custom', color: 'blue' });
    expect(next.defined.has('custom')).toBe(true);
    expect(next.defined.get('custom')?.color).toBe('blue');
  });

  it('does not mutate original state', () => {
    const state = createDiffTagState();
    defineTag(state, { label: 'custom', color: 'blue' });
    expect(state.defined.has('custom')).toBe(false);
  });
});

describe('addTag', () => {
  it('tags a service with a known label', () => {
    const state = createDiffTagState();
    const next = addTag(state, 'web', 'reviewed');
    expect(next.tags.get('web')?.has('reviewed')).toBe(true);
  });

  it('ignores unknown labels', () => {
    const state = createDiffTagState();
    const next = addTag(state, 'web', 'nonexistent');
    expect(next.tags.has('web')).toBe(false);
  });

  it('accumulates multiple tags on a service', () => {
    let state = createDiffTagState();
    state = addTag(state, 'db', 'reviewed');
    state = addTag(state, 'db', 'wip');
    expect(next => getTagsForService(state, 'db').length).toBeTruthy();
    expect(getTagsForService(state, 'db').map(t => t.label)).toContain('wip');
  });
});

describe('removeTag', () => {
  it('removes a tag from a service', () => {
    let state = createDiffTagState();
    state = addTag(state, 'web', 'reviewed');
    state = removeTag(state, 'web', 'reviewed');
    expect(state.tags.has('web')).toBe(false);
  });
});

describe('toggleTag', () => {
  it('adds tag when not present', () => {
    const state = createDiffTagState();
    const next = toggleTag(state, 'api', 'wip');
    expect(next.tags.get('api')?.has('wip')).toBe(true);
  });

  it('removes tag when already present', () => {
    let state = createDiffTagState();
    state = addTag(state, 'api', 'wip');
    state = toggleTag(state, 'api', 'wip');
    expect(state.tags.has('api')).toBe(false);
  });
});

describe('getServicesWithTag', () => {
  it('returns all services with a given tag', () => {
    let state = createDiffTagState();
    state = addTag(state, 'web', 'reviewed');
    state = addTag(state, 'db', 'reviewed');
    state = addTag(state, 'cache', 'wip');
    const reviewed = getServicesWithTag(state, 'reviewed');
    expect(reviewed).toContain('web');
    expect(reviewed).toContain('db');
    expect(reviewed).not.toContain('cache');
  });
});

describe('formatTagLine', () => {
  it('returns empty string when no tags', () => {
    const state = createDiffTagState();
    expect(formatTagLine(state, 'web')).toBe('');
  });

  it('formats tags as bracketed labels', () => {
    let state = createDiffTagState();
    state = addTag(state, 'web', 'reviewed');
    expect(formatTagLine(state, 'web')).toBe('[reviewed]');
  });
});
