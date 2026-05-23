/**
 * bookmarkState.ts
 * Manages bookmarked service positions for quick navigation.
 */

export interface BookmarkState {
  bookmarks: Set<string>;
  orderedKeys: string[];
}

export function createBookmarkState(): BookmarkState {
  return {
    bookmarks: new Set(),
    orderedKeys: [],
  };
}

export function addBookmark(state: BookmarkState, serviceKey: string): BookmarkState {
  if (state.bookmarks.has(serviceKey)) return state;
  const bookmarks = new Set(state.bookmarks);
  bookmarks.add(serviceKey);
  const orderedKeys = [...state.orderedKeys, serviceKey];
  return { bookmarks, orderedKeys };
}

export function removeBookmark(state: BookmarkState, serviceKey: string): BookmarkState {
  if (!state.bookmarks.has(serviceKey)) return state;
  const bookmarks = new Set(state.bookmarks);
  bookmarks.delete(serviceKey);
  const orderedKeys = state.orderedKeys.filter((k) => k !== serviceKey);
  return { bookmarks, orderedKeys };
}

export function toggleBookmark(state: BookmarkState, serviceKey: string): BookmarkState {
  return state.bookmarks.has(serviceKey)
    ? removeBookmark(state, serviceKey)
    : addBookmark(state, serviceKey);
}

export function hasBookmark(state: BookmarkState, serviceKey: string): boolean {
  return state.bookmarks.has(serviceKey);
}

export function nextBookmark(state: BookmarkState, current: string): string | null {
  const { orderedKeys } = state;
  if (orderedKeys.length === 0) return null;
  const idx = orderedKeys.indexOf(current);
  if (idx === -1) return orderedKeys[0];
  return orderedKeys[(idx + 1) % orderedKeys.length];
}

export function prevBookmark(state: BookmarkState, current: string): string | null {
  const { orderedKeys } = state;
  if (orderedKeys.length === 0) return null;
  const idx = orderedKeys.indexOf(current);
  if (idx === -1) return orderedKeys[orderedKeys.length - 1];
  return orderedKeys[(idx - 1 + orderedKeys.length) % orderedKeys.length];
}

export function clearBookmarks(state: BookmarkState): BookmarkState {
  return { bookmarks: new Set(), orderedKeys: [] };
}

export function getBookmarkCount(state: BookmarkState): number {
  return state.bookmarks.size;
}
