import {
  createUndoState,
  pushAction,
  undo,
  redo,
  canUndo,
  canRedo,
  clearHistory,
  getUndoStatusText,
  UndoAction,
} from './undoState';

const filterAction = (prev: string, next: string): UndoAction => ({
  type: 'filter',
  prev,
  next,
});

describe('createUndoState', () => {
  it('creates empty state with default maxHistory', () => {
    const s = createUndoState();
    expect(s.past).toHaveLength(0);
    expect(s.future).toHaveLength(0);
    expect(s.maxHistory).toBe(50);
  });

  it('respects custom maxHistory', () => {
    const s = createUndoState(10);
    expect(s.maxHistory).toBe(10);
  });
});

describe('pushAction', () => {
  it('adds action to past and clears future', () => {
    let s = createUndoState();
    s = pushAction(s, filterAction('', 'web'));
    expect(s.past).toHaveLength(1);
    expect(s.future).toHaveLength(0);
  });

  it('trims past to maxHistory', () => {
    let s = createUndoState(3);
    s = pushAction(s, filterAction('', 'a'));
    s = pushAction(s, filterAction('a', 'b'));
    s = pushAction(s, filterAction('b', 'c'));
    s = pushAction(s, filterAction('c', 'd'));
    expect(s.past).toHaveLength(3);
    expect(s.past[0].type).toBe('filter');
  });
});

describe('undo', () => {
  it('returns null action when nothing to undo', () => {
    const s = createUndoState();
    const { action } = undo(s);
    expect(action).toBeNull();
  });

  it('moves last past entry to future', () => {
    let s = createUndoState();
    s = pushAction(s, filterAction('', 'web'));
    const { state: s2, action } = undo(s);
    expect(action).not.toBeNull();
    expect(s2.past).toHaveLength(0);
    expect(s2.future).toHaveLength(1);
  });
});

describe('redo', () => {
  it('returns null action when nothing to redo', () => {
    const s = createUndoState();
    const { action } = redo(s);
    expect(action).toBeNull();
  });

  it('moves first future entry back to past', () => {
    let s = createUndoState();
    s = pushAction(s, filterAction('', 'web'));
    const { state: undone } = undo(s);
    const { state: redone, action } = redo(undone);
    expect(action).not.toBeNull();
    expect(redone.past).toHaveLength(1);
    expect(redone.future).toHaveLength(0);
  });
});

describe('canUndo / canRedo', () => {
  it('returns false for empty state', () => {
    const s = createUndoState();
    expect(canUndo(s)).toBe(false);
    expect(canRedo(s)).toBe(false);
  });

  it('returns true after push', () => {
    const s = pushAction(createUndoState(), filterAction('', 'db'));
    expect(canUndo(s)).toBe(true);
  });
});

describe('clearHistory', () => {
  it('empties past and future', () => {
    let s = pushAction(createUndoState(), filterAction('', 'x'));
    s = clearHistory(s);
    expect(s.past).toHaveLength(0);
    expect(s.future).toHaveLength(0);
  });
});

describe('getUndoStatusText', () => {
  it('returns empty string when no history', () => {
    expect(getUndoStatusText(createUndoState())).toBe('');
  });

  it('shows undo count when past has entries', () => {
    const s = pushAction(createUndoState(), filterAction('', 'web'));
    expect(getUndoStatusText(s)).toContain('u:undo(1)');
  });

  it('shows redo count after undo', () => {
    let s = pushAction(createUndoState(), filterAction('', 'web'));
    const { state: s2 } = undo(s);
    expect(getUndoStatusText(s2)).toContain('r:redo(1)');
  });
});
