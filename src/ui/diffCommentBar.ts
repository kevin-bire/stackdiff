import { DiffCommentState, getCommentsForLine, hasComments } from "./diffCommentState";

const COMMENT_INDICATOR = "{yellow-fg}💬{/yellow-fg}";
const NO_COMMENT_INDICATOR = "  ";

export function buildCommentGutter(
  lines: string[],
  lineKeys: string[],
  state: DiffCommentState
): string[] {
  return lines.map((line, i) => {
    const key = lineKeys[i] ?? "";
    const indicator = key && hasComments(state, key) ? COMMENT_INDICATOR : NO_COMMENT_INDICATOR;
    return `${indicator} ${line}`;
  });
}

export function buildCommentSidebarText(
  lineKey: string,
  state: DiffCommentState
): string {
  const comments = getCommentsForLine(state, lineKey);
  if (comments.length === 0) return "No comments for this line.";
  return comments
    .map((c, i) => {
      const date = new Date(c.createdAt).toISOString().slice(0, 16).replace("T", " ");
      return `[${i + 1}] ${date}\n    ${c.text}`;
    })
    .join("\n");
}

export function buildCommentStatusText(
  state: DiffCommentState,
  lineKey: string | null
): string {
  const total = state.comments.size;
  const lineCount = lineKey ? getCommentsForLine(state, lineKey).length : 0;
  const parts: string[] = [`Comments: ${total}`];
  if (lineKey) parts.push(`On this line: ${lineCount}`);
  if (state.editingId) parts.push("{cyan-fg}[editing]{/cyan-fg}");
  return parts.join("  ");
}

export function formatCommentCount(state: DiffCommentState): string {
  const n = state.comments.size;
  if (n === 0) return "";
  return `{yellow-fg}[${n} comment${n !== 1 ? "s" : ""}]{/yellow-fg}`;
}
