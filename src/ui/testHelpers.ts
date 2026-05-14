/**
 * Exported helpers that mirror internal logic from diffView.ts
 * so tests can exercise colorization without spinning up a blessed screen.
 */
export function colorizeLines(lines: string[]): string[] {
  return lines.map((line) => {
    if (line.startsWith('+')) return `{green-fg}${line}{/green-fg}`;
    if (line.startsWith('-')) return `{red-fg}${line}{/red-fg}`;
    if (line.startsWith('~')) return `{yellow-fg}${line}{/yellow-fg}`;
    if (line.startsWith('=')) return `{gray-fg}${line}{/gray-fg}`;
    return line;
  });
}

/**
 * Build a minimal ServiceDiff-shaped object for use in view tests.
 */
export function buildMockDiff(
  added: string[] = [],
  removed: string[] = [],
  changed: Array<{ key: string; from: unknown; to: unknown }> = [],
  unchanged: string[] = []
) {
  return {
    added: Object.fromEntries(added.map((k) => [k, 'value'])),
    removed: Object.fromEntries(removed.map((k) => [k, 'value'])),
    changed: Object.fromEntries(changed.map(({ key, from, to }) => [key, { from, to }])),
    unchanged: Object.fromEntries(unchanged.map((k) => [k, 'value'])),
  };
}
