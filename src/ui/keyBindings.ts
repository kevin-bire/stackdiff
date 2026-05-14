import { Widgets } from 'blessed';

export type KeyAction =
  | 'scroll-up'
  | 'scroll-down'
  | 'page-up'
  | 'page-down'
  | 'next-service'
  | 'prev-service'
  | 'quit';

export interface KeyBinding {
  keys: string[];
  action: KeyAction;
  description: string;
}

export const DEFAULT_BINDINGS: KeyBinding[] = [
  { keys: ['up', 'k'],       action: 'scroll-up',      description: 'Scroll up one line' },
  { keys: ['down', 'j'],     action: 'scroll-down',    description: 'Scroll down one line' },
  { keys: ['pageup', 'u'],   action: 'page-up',        description: 'Scroll up one page' },
  { keys: ['pagedown', 'd'], action: 'page-down',      description: 'Scroll down one page' },
  { keys: ['tab'],           action: 'next-service',   description: 'Jump to next service' },
  { keys: ['S-tab'],         action: 'prev-service',   description: 'Jump to previous service' },
  { keys: ['q', 'C-c'],      action: 'quit',           description: 'Quit the application' },
];

export function getBindingMap(): Map<string, KeyAction> {
  const map = new Map<string, KeyAction>();
  for (const binding of DEFAULT_BINDINGS) {
    for (const key of binding.keys) {
      map.set(key, binding.action);
    }
  }
  return map;
}

export function registerKeyBindings(
  screen: Widgets.Screen,
  handlers: Partial<Record<KeyAction, () => void>>
): void {
  const bindingMap = getBindingMap();

  for (const [key, action] of bindingMap.entries()) {
    const handler = handlers[action];
    if (handler) {
      screen.key([key], handler);
    }
  }
}

export function formatHelpText(): string {
  return DEFAULT_BINDINGS
    .map(b => `${b.keys.join('/')}`.padEnd(14) + b.description)
    .join('  |  ');
}
