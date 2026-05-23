import { DiffResult } from '../diff';
import { formatAsText, formatAsMarkdown } from './exportState';

export type ClipboardFormat = 'text' | 'markdown' | 'json';

export interface ClipboardState {
  lastCopied: string | null;
  lastFormat: ClipboardFormat | null;
  lastCopiedAt: Date | null;
  copyCount: number;
}

export function createClipboardState(): ClipboardState {
  return {
    lastCopied: null,
    lastFormat: null,
    lastCopiedAt: null,
    copyCount: 0,
  };
}

export function copyToClipboard(
  state: ClipboardState,
  content: string,
  format: ClipboardFormat
): ClipboardState {
  return {
    ...state,
    lastCopied: content,
    lastFormat: format,
    lastCopiedAt: new Date(),
    copyCount: state.copyCount + 1,
  };
}

export function copyDiffToClipboard(
  state: ClipboardState,
  diff: DiffResult,
  format: ClipboardFormat
): { state: ClipboardState; content: string } {
  let content: string;
  switch (format) {
    case 'markdown':
      content = formatAsMarkdown(diff);
      break;
    case 'json':
      content = JSON.stringify(diff, null, 2);
      break;
    case 'text':
    default:
      content = formatAsText(diff);
      break;
  }
  const newState = copyToClipboard(state, content, format);
  return { state: newState, content };
}

export function getClipboardStatusText(state: ClipboardState): string {
  if (!state.lastCopied || !state.lastFormat || !state.lastCopiedAt) {
    return 'Nothing copied yet';
  }
  const timeAgo = Math.floor(
    (Date.now() - state.lastCopiedAt.getTime()) / 1000
  );
  const timeStr = timeAgo < 5 ? 'just now' : `${timeAgo}s ago`;
  return `Copied as ${state.lastFormat} (${timeStr})`;
}

export function hasRecentCopy(state: ClipboardState, withinMs = 3000): boolean {
  if (!state.lastCopiedAt) return false;
  return Date.now() - state.lastCopiedAt.getTime() < withinMs;
}
