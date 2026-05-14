import { buildStatusText, buildHelpText, updateStatusBar } from './statusBar';
import { DEFAULT_BINDINGS } from './keyBindings';

const baseState = {
  currentService: 'web',
  serviceIndex: 0,
  totalServices: 3,
  scrollLine: 10,
};

describe('buildStatusText', () => {
  it('includes service name and index', () => {
    const text = buildStatusText(baseState);
    expect(text).toContain('web');
    expect(text).toContain('1/3');
  });

  it('includes scroll line number', () => {
    const text = buildStatusText(baseState);
    expect(text).toContain('10');
  });

  it('shows fallback when no service is selected', () => {
    const text = buildStatusText({ ...baseState, currentService: null });
    expect(text).toContain('No services');
  });

  it('reflects serviceIndex correctly', () => {
    const text = buildStatusText({ ...baseState, serviceIndex: 2, totalServices: 5 });
    expect(text).toContain('3/5');
  });
});

describe('buildHelpText', () => {
  it('contains at least one key description from DEFAULT_BINDINGS', () => {
    const help = buildHelpText();
    expect(help).toContain(DEFAULT_BINDINGS[0].description);
  });

  it('is a non-empty string', () => {
    expect(buildHelpText().trim().length).toBeGreaterThan(0);
  });
});

describe('updateStatusBar', () => {
  it('calls setContent and screen.render', () => {
    const render = jest.fn();
    const setContent = jest.fn();
    const mockBar = { setContent, screen: { render } } as any;

    updateStatusBar(mockBar, baseState);

    expect(setContent).toHaveBeenCalledTimes(1);
    expect(render).toHaveBeenCalledTimes(1);
  });
});
