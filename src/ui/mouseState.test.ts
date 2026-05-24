import {
  createMouseState,
  recordClick,
  recordHover,
  recordScroll,
  toggleMouse,
  resetScrollDelta,
  isDoubleClick,
  MouseEvent,
} from './mouseState';

describe('createMouseState', () => {
  it('creates default state', () => {
    const state = createMouseState();
    expect(state.lastClick).toBeNull();
    expect(state.lastHover).toBeNull();
    expect(state.clickCount).toBe(0);
    expect(state.scrollDelta).toBe(0);
    expect(state.enabled).toBe(true);
  });
});

describe('recordClick', () => {
  it('records a click event', () => {
    const state = createMouseState();
    const event: MouseEvent = { x: 10, y: 5, button: 'left' };
    const next = recordClick(state, event);
    expect(next.lastClick).toEqual(event);
    expect(next.clickCount).toBe(1);
  });

  it('increments click count on subsequent clicks', () => {
    let state = createMouseState();
    const event: MouseEvent = { x: 10, y: 5, button: 'left' };
    state = recordClick(state, event);
    state = recordClick(state, event);
    expect(state.clickCount).toBe(2);
  });
});

describe('recordHover', () => {
  it('updates hover position', () => {
    const state = createMouseState();
    const next = recordHover(state, 20, 8);
    expect(next.lastHover).toEqual({ x: 20, y: 8 });
  });
});

describe('recordScroll', () => {
  it('decrements scrollDelta on up', () => {
    const state = createMouseState();
    const next = recordScroll(state, 'up', 3);
    expect(next.scrollDelta).toBe(-3);
    expect(next.lastClick?.button).toBe('wheelup');
  });

  it('increments scrollDelta on down', () => {
    const state = createMouseState();
    const next = recordScroll(state, 'down', 2);
    expect(next.scrollDelta).toBe(2);
    expect(next.lastClick?.button).toBe('wheeldown');
  });

  it('accumulates scroll delta', () => {
    let state = createMouseState();
    state = recordScroll(state, 'down', 1);
    state = recordScroll(state, 'down', 1);
    state = recordScroll(state, 'up', 1);
    expect(state.scrollDelta).toBe(1);
  });
});

describe('toggleMouse', () => {
  it('disables mouse when enabled', () => {
    const state = createMouseState();
    expect(toggleMouse(state).enabled).toBe(false);
  });

  it('enables mouse when disabled', () => {
    const state = { ...createMouseState(), enabled: false };
    expect(toggleMouse(state).enabled).toBe(true);
  });
});

describe('resetScrollDelta', () => {
  it('resets scroll delta to zero', () => {
    let state = createMouseState();
    state = recordScroll(state, 'down', 5);
    expect(resetScrollDelta(state).scrollDelta).toBe(0);
  });
});

describe('isDoubleClick', () => {
  it('returns true for same position click after first click', () => {
    let state = createMouseState();
    const event: MouseEvent = { x: 5, y: 3, button: 'left' };
    state = recordClick(state, event);
    expect(isDoubleClick(state, event)).toBe(true);
  });

  it('returns false when no previous click', () => {
    const state = createMouseState();
    const event: MouseEvent = { x: 5, y: 3, button: 'left' };
    expect(isDoubleClick(state, event)).toBe(false);
  });

  it('returns false for different position', () => {
    let state = createMouseState();
    state = recordClick(state, { x: 5, y: 3, button: 'left' });
    expect(isDoubleClick(state, { x: 6, y: 3, button: 'left' })).toBe(false);
  });
});
