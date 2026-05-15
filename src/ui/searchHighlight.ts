/**
 * searchHighlight.ts
 * Utilities for highlighting search query matches within diff lines.
 */

export interface HighlightResult {
  line: string;
  hasMatch: boolean;
}

/**
 * Escapes special regex characters in a string.
 */
export function escapeRegex(query: string): string {
  return query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Wraps matched substrings in a blessed-compatible color tag.
 */
export function highlightMatches(
  line: string,
  query: string,
  colorTag: string = '{yellow-fg}'
): HighlightResult {
  if (!query || query.trim() === '') {
    return { line, hasMatch: false };
  }

  const escaped = escapeRegex(query);
  const regex = new RegExp(`(${escaped})`, 'gi');

  if (!regex.test(line)) {
    return { line, hasMatch: false };
  }

  // Reset regex lastIndex after test()
  regex.lastIndex = 0;

  const highlighted = line.replace(regex, `${colorTag}$1{/}`);
  return { line: highlighted, hasMatch: true };
}

/**
 * Applies search highlighting to an array of lines.
 * Returns only lines with matches if filterNonMatching is true.
 */
export function highlightLines(
  lines: string[],
  query: string,
  filterNonMatching: boolean = false
): string[] {
  if (!query || query.trim() === '') {
    return lines;
  }

  const results = lines.map((line) => highlightMatches(line, query));

  if (filterNonMatching) {
    return results
      .filter((r) => r.hasMatch)
      .map((r) => r.line);
  }

  return results.map((r) => r.line);
}

/**
 * Counts the number of lines that match the given query.
 */
export function countMatches(lines: string[], query: string): number {
  if (!query || query.trim() === '') return 0;
  return lines.filter((line) => highlightMatches(line, query).hasMatch).length;
}
