import {
  createInlineEditState,
  beginEdit,
  updateEditValue,
  commitEdit,
  cancelEdit,
  resetEdit,
  getEditSummary,
} from './inlineEditState';

describe('createInlineEditState', () => {
  it('returns idle state with null fields', () => {
    const state = createInlineEditState();
    expect(state.status).toBe('idle');
    expect(state.serviceName).toBeNull();
    expect(state.fieldPath).toBeNull();
    expect(state.isDirty).toBe(false);
  });
});

describe('beginEdit', () => {
  it('transitions to editing with provided values', () => {
    const state = createInlineEditState();
    const next = beginEdit(state, 'web', 'image', 'nginx:latest');
    expect(next.status).toBe('editing');
    expect(next.serviceName).toBe('web');
    expect(next.fieldPath).toBe('image');
    expect(next.originalValue).toBe('nginx:latest');
    expect(next.currentValue).toBe('nginx:latest');
    expect(next.isDirty).toBe(false);
  });
});

describe('updateEditValue', () => {
  it('updates currentValue and marks dirty when changed', () => {
    const state = beginEdit(createInlineEditState(), 'web', 'image', 'nginx:latest');
    const next = updateEditValue(state, 'nginx:1.25');
    expect(next.currentValue).toBe('nginx:1.25');
    expect(next.isDirty).toBe(true);
  });

  it('marks not dirty when value equals original', () => {
    const state = beginEdit(createInlineEditState(), 'web', 'image', 'nginx:latest');
    const next = updateEditValue(state, 'nginx:latest');
    expect(next.isDirty).toBe(false);
  });

  it('does nothing if not in editing status', () => {
    const state = createInlineEditState();
    const next = updateEditValue(state, 'value');
    expect(next.status).toBe('idle');
  });
});

describe('commitEdit', () => {
  it('transitions to saved and clears dirty flag', () => {
    const state = updateEditValue(
      beginEdit(createInlineEditState(), 'db', 'ports', '5432'),
      '5433'
    );
    const next = commitEdit(state);
    expect(next.status).toBe('saved');
    expect(next.isDirty).toBe(false);
    expect(next.currentValue).toBe('5433');
  });

  it('does nothing if not editing', () => {
    const state = createInlineEditState();
    expect(commitEdit(state).status).toBe('idle');
  });
});

describe('cancelEdit', () => {
  it('restores original value and transitions to cancelled', () => {
    const state = updateEditValue(
      beginEdit(createInlineEditState(), 'db', 'image', 'postgres:14'),
      'postgres:15'
    );
    const next = cancelEdit(state);
    expect(next.status).toBe('cancelled');
    expect(next.currentValue).toBe('postgres:14');
    expect(next.isDirty).toBe(false);
  });
});

describe('resetEdit', () => {
  it('returns a fresh idle state', () => {
    const state = beginEdit(createInlineEditState(), 'web', 'image', 'nginx');
    const next = resetEdit(state);
    expect(next.status).toBe('idle');
    expect(next.serviceName).toBeNull();
  });
});

describe('getEditSummary', () => {
  it('returns idle message when idle', () => {
    expect(getEditSummary(createInlineEditState())).toBe('No active edit');
  });

  it('includes modified indicator when dirty', () => {
    const state = updateEditValue(
      beginEdit(createInlineEditState(), 'web', 'image', 'nginx'),
      'apache'
    );
    expect(getEditSummary(state)).toContain('(modified)');
  });

  it('returns saved summary after commit', () => {
    const state = commitEdit(beginEdit(createInlineEditState(), 'web', 'image', 'nginx'));
    expect(getEditSummary(state)).toContain('Saved');
  });

  it('returns cancelled summary after cancel', () => {
    const state = cancelEdit(beginEdit(createInlineEditState(), 'web', 'image', 'nginx'));
    expect(getEditSummary(state)).toContain('Cancelled');
  });
});
