import {
  createProgressState,
  setPhase,
  setProgress,
  setError,
  markDone,
  isActive,
  formatProgressText,
  buildProgressBar,
} from './progressState';

describe('createProgressState', () => {
  it('initializes with idle phase and zero percent', () => {
    const s = createProgressState();
    expect(s.phase).toBe('idle');
    expect(s.percent).toBe(0);
    expect(s.error).toBeNull();
    expect(s.message).toBe('');
  });
});

describe('setPhase', () => {
  it('updates phase, message, and percent', () => {
    const s = setPhase(createProgressState(), 'loading', 'Fetching sources', 10);
    expect(s.phase).toBe('loading');
    expect(s.message).toBe('Fetching sources');
    expect(s.percent).toBe(10);
    expect(s.error).toBeNull();
  });

  it('clears error on phase change', () => {
    const errState = setError(createProgressState(), 'oops');
    const recovered = setPhase(errState, 'parsing');
    expect(recovered.error).toBeNull();
  });
});

describe('setProgress', () => {
  it('clamps percent to 0-100', () => {
    const s = createProgressState();
    expect(setProgress(s, 150).percent).toBe(100);
    expect(setProgress(s, -10).percent).toBe(0);
    expect(setProgress(s, 55).percent).toBe(55);
  });

  it('updates message when provided', () => {
    const s = setProgress(createProgressState(), 40, 'Parsing YAML');
    expect(s.message).toBe('Parsing YAML');
  });

  it('preserves message when not provided', () => {
    const s = setPhase(createProgressState(), 'parsing', 'original', 0);
    const updated = setProgress(s, 50);
    expect(updated.message).toBe('original');
  });
});

describe('setError', () => {
  it('sets error phase and message', () => {
    const s = setError(createProgressState(), 'File not found');
    expect(s.phase).toBe('error');
    expect(s.error).toBe('File not found');
    expect(s.message).toBe('File not found');
  });
});

describe('markDone', () => {
  it('sets done phase and 100 percent', () => {
    const s = markDone(setPhase(createProgressState(), 'diffing', 'Computing diff', 80));
    expect(s.phase).toBe('done');
    expect(s.percent).toBe(100);
    expect(s.error).toBeNull();
  });
});

describe('isActive', () => {
  it('returns true for active phases', () => {
    expect(isActive(setPhase(createProgressState(), 'loading'))).toBe(true);
    expect(isActive(setPhase(createProgressState(), 'parsing'))).toBe(true);
  });

  it('returns false for terminal phases', () => {
    expect(isActive(createProgressState())).toBe(false);
    expect(isActive(markDone(createProgressState()))).toBe(false);
    expect(isActive(setError(createProgressState(), 'err'))).toBe(false);
  });
});

describe('buildProgressBar', () => {
  it('builds a bar of correct width', () => {
    const bar = buildProgressBar(50, 10);
    expect(bar.length).toBe(12); // includes brackets
    expect(bar).toBe('[=====     ]');
  });

  it('builds full bar at 100%', () => {
    expect(buildProgressBar(100, 4)).toBe('[====]');
  });
});

describe('formatProgressText', () => {
  it('returns empty string for idle', () => {
    expect(formatProgressText(createProgressState())).toBe('');
  });

  it('returns green Ready for done', () => {
    expect(formatProgressText(markDone(createProgressState()))).toContain('Ready');
  });

  it('returns red error text for error phase', () => {
    const text = formatProgressText(setError(createProgressState(), 'bad file'));
    expect(text).toContain('bad file');
    expect(text).toContain('red-fg');
  });

  it('includes phase and percent for active states', () => {
    const s = setProgress(setPhase(createProgressState(), 'diffing', 'Comparing', 60), 60);
    const text = formatProgressText(s);
    expect(text).toContain('diffing');
    expect(text).toContain('60%');
  });
});
