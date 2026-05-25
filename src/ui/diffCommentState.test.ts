import {
  createDiffCommentState,
  addComment,
  updateComment,
  removeComment,
  getCommentsForLine,
  setEditingComment,
  hasComments,
} from "./diffCommentState";

describe("createDiffCommentState", () => {
  it("starts empty", () => {
    const s = createDiffCommentState();
    expect(s.comments.size).toBe(0);
    expect(s.editingId).toBeNull();
  });
});

describe("addComment", () => {
  it("adds a comment and returns new state", () => {
    const s = addComment(createDiffCommentState(), "web:image", "check this");
    expect(s.comments.size).toBe(1);
    const entry = Array.from(s.comments.values())[0];
    expect(entry.lineKey).toBe("web:image");
    expect(entry.text).toBe("check this");
  });

  it("assigns unique ids", () => {
    let s = createDiffCommentState();
    s = addComment(s, "web:image", "a");
    s = addComment(s, "web:image", "b");
    const ids = Array.from(s.comments.keys());
    expect(new Set(ids).size).toBe(2);
  });
});

describe("updateComment", () => {
  it("updates text of existing comment", () => {
    let s = addComment(createDiffCommentState(), "db:ports", "old");
    const id = Array.from(s.comments.keys())[0];
    s = updateComment(s, id, "new");
    expect(s.comments.get(id)!.text).toBe("new");
  });

  it("returns unchanged state for unknown id", () => {
    const s = createDiffCommentState();
    const s2 = updateComment(s, "nope", "text");
    expect(s2).toBe(s);
  });
});

describe("removeComment", () => {
  it("removes the comment", () => {
    let s = addComment(createDiffCommentState(), "web:image", "hi");
    const id = Array.from(s.comments.keys())[0];
    s = removeComment(s, id);
    expect(s.comments.size).toBe(0);
  });
});

describe("getCommentsForLine", () => {
  it("returns only comments for the given lineKey", () => {
    let s = createDiffCommentState();
    s = addComment(s, "web:image", "a");
    s = addComment(s, "db:ports", "b");
    s = addComment(s, "web:image", "c");
    const results = getCommentsForLine(s, "web:image");
    expect(results).toHaveLength(2);
    expect(results.every((r) => r.lineKey === "web:image")).toBe(true);
  });
});

describe("setEditingComment", () => {
  it("sets editingId", () => {
    const s = setEditingComment(createDiffCommentState(), "comment-1");
    expect(s.editingId).toBe("comment-1");
  });

  it("clears editingId", () => {
    const s = setEditingComment(
      setEditingComment(createDiffCommentState(), "comment-1"),
      null
    );
    expect(s.editingId).toBeNull();
  });
});

describe("hasComments", () => {
  it("returns true when comments exist for a line", () => {
    const s = addComment(createDiffCommentState(), "web:image", "note");
    expect(hasComments(s, "web:image")).toBe(true);
  });

  it("returns false when no comments for a line", () => {
    const s = createDiffCommentState();
    expect(hasComments(s, "web:image")).toBe(false);
  });
});
