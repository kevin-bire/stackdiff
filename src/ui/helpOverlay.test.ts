import { createHelpOverlay, toggleHelpOverlay, HelpOverlay } from './helpOverlay';

function makeMockScreen() {
  const appended: any[] = [];
  return {
    append: (el: any) => appended.push(el),
    render: jest.fn(),
    _appended: appended,
  };
}

function makeMockBox() {
  let hidden = true;
  return {
    show: jest.fn(() => { hidden = false; }),
    hide: jest.fn(() => { hidden = true; }),
    focus: jest.fn(),
    _hidden: () => hidden,
  };
}

jest.mock('blessed', () => ({
  box: jest.fn(() => makeMockBox()),
}));

jest.mock('./keyBindings', () => ({
  formatHelpText: () => 'j/k - scroll\nq - quit',
}));

describe('createHelpOverlay', () => {
  it('starts hidden', () => {
    const screen = makeMockScreen() as any;
    const overlay = createHelpOverlay(screen);
    expect(overlay.isVisible()).toBe(false);
  });

  it('show() makes overlay visible', () => {
    const screen = makeMockScreen() as any;
    const overlay = createHelpOverlay(screen);
    overlay.show();
    expect(overlay.isVisible()).toBe(true);
    expect(screen.render).toHaveBeenCalled();
  });

  it('hide() makes overlay invisible', () => {
    const screen = makeMockScreen() as any;
    const overlay = createHelpOverlay(screen);
    overlay.show();
    overlay.hide();
    expect(overlay.isVisible()).toBe(false);
  });
});

describe('toggleHelpOverlay', () => {
  it('shows when hidden', () => {
    const screen = makeMockScreen() as any;
    const overlay = createHelpOverlay(screen);
    toggleHelpOverlay(overlay);
    expect(overlay.isVisible()).toBe(true);
  });

  it('hides when visible', () => {
    const screen = makeMockScreen() as any;
    const overlay = createHelpOverlay(screen);
    overlay.show();
    toggleHelpOverlay(overlay);
    expect(overlay.isVisible()).toBe(false);
  });

  it('toggles twice returns to original state', () => {
    const screen = makeMockScreen() as any;
    const overlay = createHelpOverlay(screen);
    toggleHelpOverlay(overlay);
    toggleHelpOverlay(overlay);
    expect(overlay.isVisible()).toBe(false);
  });
});
