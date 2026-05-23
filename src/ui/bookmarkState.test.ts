import {
  createBookmarkState,
  addBookmark,
  removeBookmark,
  toggleBookmark,
  hasBookmark,
  nextBookmark,
  prevBookmark,
  clearBookmarks,
  getBookmarkCount,
} from './bookmarkState';

describe('bookmarkState', () => {
  it('creates empty state', () => {
    const s = createBookmarkState();
    expect(s.bookmarks.size).toBe(0);
    expect(s.orderedKeys).toEqual([]);
  });

  it('adds a bookmark', () => {
    const s = addBookmark(createBookmarkState(), 'web');
    expect(hasBookmark(s, 'web')).toBe(true);
    expect(s.orderedKeys).toEqual(['web']);
  });

  it('does not duplicate bookmarks', () => {
    let s = addBookmark(createBookmarkState(), 'web');
    s = addBookmark(s, 'web');
    expect(getBookmarkCount(s)).toBe(1);
    expect(s.orderedKeys).toEqual(['web']);
  });

  it('removes a bookmark', () => {
    let s = addBookmark(createBookmarkState(), 'web');
    s = removeBookmark(s, 'web');
    expect(hasBookmark(s, 'web')).toBe(false);
    expect(s.orderedKeys).toEqual([]);
  });

  it('toggles bookmark on and off', () => {
    let s = createBookmarkState();
    s = toggleBookmark(s, 'db');
    expect(hasBookmark(s, 'db')).toBe(true);
    s = toggleBookmark(s, 'db');
    expect(hasBookmark(s, 'db')).toBe(false);
  });

  it('returns null for nextBookmark when empty', () => {
    expect(nextBookmark(createBookmarkState(), 'web')).toBeNull();
  });

  it('cycles nextBookmark through ordered keys', () => {
    let s = createBookmarkState();
    s = addBookmark(s, 'web');
    s = addBookmark(s, 'db');
    s = addBookmark(s, 'cache');
    expect(nextBookmark(s, 'web')).toBe('db');
    expect(nextBookmark(s, 'cache')).toBe('web');
    expect(nextBookmark(s, 'unknown')).toBe('web');
  });

  it('cycles prevBookmark through ordered keys', () => {
    let s = createBookmarkState();
    s = addBookmark(s, 'web');
    s = addBookmark(s, 'db');
    expect(prevBookmark(s, 'web')).toBe('db');
    expect(prevBookmark(s, 'db')).toBe('web');
    expect(prevBookmark(s, 'unknown')).toBe('db');
  });

  it('clears all bookmarks', () => {
    let s = addBookmark(createBookmarkState(), 'web');
    s = addBookmark(s, 'db');
    s = clearBookmarks(s);
    expect(getBookmarkCount(s)).toBe(0);
    expect(s.orderedKeys).toEqual([]);
  });

  it('immutably updates state', () => {
    const original = createBookmarkState();
    const updated = addBookmark(original, 'web');
    expect(original.bookmarks.size).toBe(0);
    expect(updated.bookmarks.size).toBe(1);
  });
});
