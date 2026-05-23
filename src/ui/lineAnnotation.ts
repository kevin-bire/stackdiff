/**
 * lineAnnotation.ts
 * Provides inline annotations for diff lines (e.g. line numbers, change counts, source labels).
 */

export interface LineAnnotation {
  lineNumber: number;
  sourceLabel: string;
  changeTag: string | null;
}

export interface AnnotatedLine {
  content: string;
  annotation: LineAnnotation;
}

/**
 * Build a source label string truncated/padded to a fixed width.
 */
export function buildSourceLabel(source: string, width = 12): string {
  if (source.length > width) {
    return source.slice(0, width - 1) + '…';
  }
  return source.padEnd(width);
}

/**
 * Derive a change tag from the leading character of a diff line.
 * '+' => 'ADD', '-' => 'DEL', '~' => 'MOD', else null.
 */
export function deriveChangeTag(line: string): string | null {
  const ch = line.trimStart().charAt(0);
  if (ch === '+') return 'ADD';
  if (ch === '-') return 'DEL';
  if (ch === '~') return 'MOD';
  return null;
}

/**
 * Annotate an array of diff lines with line numbers, source label, and change tags.
 */
export function annotateLines(
  lines: string[],
  sourceLabel: string,
  startLine = 1
): AnnotatedLine[] {
  return lines.map((content, idx) => ({
    content,
    annotation: {
      lineNumber: startLine + idx,
      sourceLabel: buildSourceLabel(sourceLabel),
      changeTag: deriveChangeTag(content),
    },
  }));
}

/**
 * Format a single annotated line for display in the terminal.
 * Example: "  42 | main         | + image: nginx"
 */
export function formatAnnotatedLine(al: AnnotatedLine, showLineNumbers = true): string {
  const { lineNumber, sourceLabel, changeTag } = al.annotation;
  const lineNum = showLineNumbers ? String(lineNumber).padStart(4) : '    ';
  const tag = changeTag ? changeTag.padEnd(3) : '   ';
  return `${lineNum} | ${sourceLabel} | ${tag} ${al.content}`;
}

/**
 * Format all annotated lines into an array of display strings.
 */
export function formatAnnotatedLines(
  annotated: AnnotatedLine[],
  showLineNumbers = true
): string[] {
  return annotated.map((al) => formatAnnotatedLine(al, showLineNumbers));
}
