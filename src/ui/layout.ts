import blessed from 'blessed';

export interface LayoutOptions {
  title?: string;
}

export function createScreen(options: LayoutOptions = {}): blessed.Widgets.Screen {
  const screen = blessed.screen({
    smartCSR: true,
    title: options.title ?? 'stackdiff',
    fullUnicode: true,
  });

  screen.key(['q', 'C-c'], () => process.exit(0));

  return screen;
}

export function createHeaderBox(screen: blessed.Widgets.Screen, title: string): blessed.Widgets.BoxElement {
  return blessed.box({
    parent: screen,
    top: 0,
    left: 0,
    width: '100%',
    height: 3,
    content: ` {bold}${title}{/bold}`,
    tags: true,
    style: {
      fg: 'white',
      bg: 'blue',
    },
  });
}

export function createDiffBox(screen: blessed.Widgets.Screen): blessed.Widgets.ScrollableBoxElement {
  return blessed.scrollablebox({
    parent: screen,
    top: 3,
    left: 0,
    width: '100%',
    height: '100%-6',
    scrollable: true,
    alwaysScroll: true,
    scrollbar: {
      ch: '│',
      style: { fg: 'cyan' },
    },
    keys: true,
    vi: true,
    tags: true,
    border: { type: 'line' },
    style: {
      fg: 'white',
      bg: 'black',
      border: { fg: 'gray' },
    },
  });
}

export function createStatusBar(screen: blessed.Widgets.Screen): blessed.Widgets.BoxElement {
  return blessed.box({
    parent: screen,
    bottom: 0,
    left: 0,
    width: '100%',
    height: 3,
    content: ' {gray-fg}[q]{/gray-fg} Quit  {gray-fg}[↑/↓]{/gray-fg} Scroll  {gray-fg}[Tab]{/gray-fg} Next service',
    tags: true,
    style: {
      fg: 'white',
      bg: 'black',
    },
  });
}
