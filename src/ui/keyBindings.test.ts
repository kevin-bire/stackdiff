import { getBindingMap, formatHelpText, DEFAULT_BINDINGS, registerKeyBindings } from './keyBindings';

describe('getBindingMap', () => {
  it('maps every key from DEFAULT_BINDINGS to its action', () => {
    const map = getBindingMap();
    for (const binding of DEFAULT_BINDINGS) {
      for (const key of binding.keys) {
        expect(map.get(key)).toBe(binding.action);
      }
    }
  });

  it('returns a Map instance', () => {
    expect(getBindingMap()).toBeInstanceOf(Map);
  });
});

describe('formatHelpText', () => {
  it('includes all action descriptions', () => {
    const help = formatHelpText();
    for (const binding of DEFAULT_BINDINGS) {
      expect(help).toContain(binding.description);
    }
  });

  it('is a non-empty string', () => {
    expect(typeof formatHelpText()).toBe('string');
    expect(formatHelpText().length).toBeGreaterThan(0);
  });
});

describe('registerKeyBindings', () => {
  it('calls screen.key for each key that has a handler', () => {
    const registeredKeys: string[][] = [];
    const mockScreen = {
      key: (keys: string[], _cb: () => void) => { registeredKeys.push(keys); },
    } as any;

    registerKeyBindings(mockScreen, {
      quit: jest.fn(),
      'scroll-up': jest.fn(),
    });

    const flat = registeredKeys.flat();
    expect(flat).toContain('q');
    expect(flat).toContain('C-c');
    expect(flat).toContain('up');
    expect(flat).toContain('k');
  });

  it('does not register keys for actions without handlers', () => {
    const registeredKeys: string[][] = [];
    const mockScreen = {
      key: (keys: string[], _cb: () => void) => { registeredKeys.push(keys); },
    } as any;

    registerKeyBindings(mockScreen, { quit: jest.fn() });

    const flat = registeredKeys.flat();
    expect(flat).not.toContain('tab');
  });
});
