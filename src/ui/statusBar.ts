import { Widgets } from 'blessed';
import { formatHelpText } from './keyBindings';

export interface StatusBarState {
  currentService: string | null;
  serviceIndex: number;
  totalServices: number;
  scrollLine: number;
}

export function buildStatusText(state: StatusBarState): string {
  const { currentService, serviceIndex, totalServices, scrollLine } = state;
  const servicePart = currentService
    ? ` Service: {bold}${currentService}{/bold} (${serviceIndex + 1}/${totalServices})`
    : ' No services';
  const scrollPart = ` | Line: ${scrollLine}`;
  return servicePart + scrollPart;
}

export function buildHelpText(): string {
  return ' ' + formatHelpText();
}

export function updateStatusBar(
  bar: Widgets.BoxElement,
  state: StatusBarState
): void {
  bar.setContent(buildStatusText(state));
  bar.screen.render();
}

export function updateHelpBar(
  bar: Widgets.BoxElement
): void {
  bar.setContent(buildHelpText());
  bar.screen.render();
}
