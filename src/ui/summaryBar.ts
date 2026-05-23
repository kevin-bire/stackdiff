import { Widgets } from 'blessed';
import { DiffSummary, formatDiffSummary, formatChangeSummary } from './diffSummary';

export interface SummaryBar {
  box: Widgets.BoxElement;
  update: (summary: DiffSummary) => void;
}

export function createSummaryBar(screen: Widgets.Screen): SummaryBar {
  const blessed = require('blessed');

  const box = blessed.box({
    top: 1,
    left: 0,
    width: '100%',
    height: 1,
    tags: true,
    style: {
      fg: 'white',
      bg: 'black',
    },
  });

  screen.append(box);

  function update(summary: DiffSummary): void {
    const left = formatDiffSummary(summary);
    const right = formatChangeSummary(summary);
    const padding = ' '.repeat(2);
    box.setContent(`${padding}${left}{|}${right}${padding}`);
    screen.render();
  }

  return { box, update };
}

export function buildSummaryText(summary: DiffSummary): string {
  const left = formatDiffSummary(summary);
  const right = formatChangeSummary(summary);
  return `${left} | ${right}`;
}
