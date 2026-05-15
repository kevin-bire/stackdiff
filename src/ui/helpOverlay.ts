import * as blessed from 'blessed';
import { formatHelpText } from './keyBindings';

export interface HelpOverlay {
  box: blessed.Widgets.BoxElement;
  show: () => void;
  hide: () => void;
  isVisible: () => boolean;
}

export function createHelpOverlay(
  screen: blessed.Widgets.Screen
): HelpOverlay {
  const helpText = formatHelpText();

  const box = blessed.box({
    top: 'center',
    left: 'center',
    width: '50%',
    height: '60%',
    content: helpText,
    tags: true,
    border: { type: 'line' },
    style: {
      border: { fg: 'cyan' },
      bg: 'black',
      fg: 'white',
    },
    label: ' Help ',
    scrollable: true,
    alwaysScroll: true,
    keys: true,
    hidden: true,
    padding: { left: 1, right: 1, top: 0, bottom: 0 },
  });

  screen.append(box);

  let visible = false;

  function show(): void {
    visible = true;
    box.show();
    box.focus();
    screen.render();
  }

  function hide(): void {
    visible = false;
    box.hide();
    screen.render();
  }

  function isVisible(): boolean {
    return visible;
  }

  return { box, show, hide, isVisible };
}

export function toggleHelpOverlay(overlay: HelpOverlay): void {
  if (overlay.isVisible()) {
    overlay.hide();
  } else {
    overlay.show();
  }
}
