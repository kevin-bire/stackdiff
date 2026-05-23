/**
 * diffNavigationHistory.ts
 * Tracks navigation history for diff views, enabling back/forward movement
 * between previously visited services or positions.
 */

export interface NavigationEntry {
  serviceIndex: number;
  scrollOffset: number;
  timestamp: number;
}

export interface DiffNavigationHistory {
  entries: NavigationEntry[];
  cursor: number;
  maxSize: number;
}

export function createDiffNavigationHistory(maxSize = 50): DiffNavigationHistory {
  return { entries: [], cursor: -1, maxSize };
}

export function pushEntry(
  history: DiffNavigationHistory,
  serviceIndex: number,
  scrollOffset: number
): DiffNavigationHistory {
  const entry: NavigationEntry = { serviceIndex, scrollOffset, timestamp: Date.now() };
  // Discard any forward entries when pushing a new one
  const entries = history.entries.slice(0, history.cursor + 1);
  entries.push(entry);
  const trimmed = entries.length > history.maxSize ? entries.slice(entries.length - history.maxSize) : entries;
  return { ...history, entries: trimmed, cursor: trimmed.length - 1 };
}

export function goBack(
  history: DiffNavigationHistory
): { history: DiffNavigationHistory; entry: NavigationEntry | null } {
  if (history.cursor <= 0) {
    return { history, entry: null };
  }
  const cursor = history.cursor - 1;
  return { history: { ...history, cursor }, entry: history.entries[cursor] };
}

export function goForward(
  history: DiffNavigationHistory
): { history: DiffNavigationHistory; entry: NavigationEntry | null } {
  if (history.cursor >= history.entries.length - 1) {
    return { history, entry: null };
  }
  const cursor = history.cursor + 1;
  return { history: { ...history, cursor }, entry: history.entries[cursor] };
}

export function canGoBack(history: DiffNavigationHistory): boolean {
  return history.cursor > 0;
}

export function canGoForward(history: DiffNavigationHistory): boolean {
  return history.cursor < history.entries.length - 1;
}

export function currentEntry(history: DiffNavigationHistory): NavigationEntry | null {
  if (history.cursor < 0 || history.cursor >= history.entries.length) return null;
  return history.entries[history.cursor];
}

export function clearHistory(history: DiffNavigationHistory): DiffNavigationHistory {
  return { ...history, entries: [], cursor: -1 };
}
