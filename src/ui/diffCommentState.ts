export type CommentEntry = {
  id: string;
  lineKey: string; // e.g. "serviceName:fieldPath"
  text: string;
  createdAt: number;
  updatedAt: number;
};

export type DiffCommentState = {
  comments: Map<string, CommentEntry>;
  editingId: string | null;
};

let _nextId = 1;

export function createDiffCommentState(): DiffCommentState {
  return { comments: new Map(), editingId: null };
}

export function addComment(
  state: DiffCommentState,
  lineKey: string,
  text: string
): DiffCommentState {
  const id = `comment-${_nextId++}`;
  const now = Date.now();
  const entry: CommentEntry = { id, lineKey, text, createdAt: now, updatedAt: now };
  const comments = new Map(state.comments);
  comments.set(id, entry);
  return { ...state, comments };
}

export function updateComment(
  state: DiffCommentState,
  id: string,
  text: string
): DiffCommentState {
  const existing = state.comments.get(id);
  if (!existing) return state;
  const comments = new Map(state.comments);
  comments.set(id, { ...existing, text, updatedAt: Date.now() });
  return { ...state, comments };
}

export function removeComment(state: DiffCommentState, id: string): DiffCommentState {
  const comments = new Map(state.comments);
  comments.delete(id);
  return { ...state, comments };
}

export function getCommentsForLine(
  state: DiffCommentState,
  lineKey: string
): CommentEntry[] {
  return Array.from(state.comments.values()).filter((c) => c.lineKey === lineKey);
}

export function setEditingComment(
  state: DiffCommentState,
  id: string | null
): DiffCommentState {
  return { ...state, editingId: id };
}

export function hasComments(state: DiffCommentState, lineKey: string): boolean {
  return getCommentsForLine(state, lineKey).length > 0;
}
