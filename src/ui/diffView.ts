import blessed from 'blessed';
import { ServiceDiff } from '../diff/serviceDiffer';
import { formatDiff } from '../diff/formatDiff';
import { createScreen, createHeaderBox, createDiffBox, createStatusBar } from './layout';

export interface DiffViewOptions {
  fileA: string;
  fileB: string;
  diffs: Record<string, ServiceDiff>;
}

export function renderDiffView(options: DiffViewOptions): void {
  const { fileA, fileB, diffs } = options;
  const screen = createScreen({ title: 'stackdiff' });

  const title = `stackdiff  {cyan-fg}${fileA}{/cyan-fg}  vs  {yellow-fg}${fileB}{/yellow-fg}`;
  createHeaderBox(screen, title);

  const diffBox = createDiffBox(screen);
  const statusBar = createStatusBar(screen);

  const serviceNames = Object.keys(diffs);
  let currentServiceIndex = 0;

  function renderContent(): void {
    const lines = formatDiff(diffs)
      .split('\n')
      .map(colorize)
      .join('\n');
    diffBox.setContent(lines);
    screen.render();
  }

  function scrollToService(index: number): void {
    const name = serviceNames[index];
    if (!name) return;
    const content = diffBox.getContent();
    const lines = content.split('\n');
    const lineIndex = lines.findIndex((l) => l.includes(`service: ${name}`));
    if (lineIndex >= 0) {
      (diffBox as any).scrollTo(lineIndex);
      screen.render();
    }
  }

  screen.key(['tab'], () => {
    currentServiceIndex = (currentServiceIndex + 1) % serviceNames.length;
    scrollToService(currentServiceIndex);
  });

  screen.key(['S-tab'], () => {
    currentServiceIndex = (currentServiceIndex - 1 + serviceNames.length) % serviceNames.length;
    scrollToService(currentServiceIndex);
  });

  renderContent();
  screen.render();
}

function colorize(line: string): string {
  if (line.startsWith('+')) return `{green-fg}${line}{/green-fg}`;
  if (line.startsWith('-')) return `{red-fg}${line}{/red-fg}`;
  if (line.startsWith('~')) return `{yellow-fg}${line}{/yellow-fg}`;
  if (line.startsWith('=')) return `{gray-fg}${line}{/gray-fg}`;
  return line;
}
