import {
  buildCommentGutter,
  buildCommentSidebarText,
  buildCommentStatusText,
  formatCommentCount,
} from "./diffCommentBar";
import { addComment, createDiffCommentState, setEditingComment } from "./diffCommentState";

describe("buildCommentGutter", () => {
  it("prefixes lines with indicator when comment exists", () => {
    let s = createDiffCommentState();
    s = addComment(s, "web:image", "note");
    const lines = ["line A", "line B"];
    const keys = ["web:image", "db:ports"];
    const result = buildCommentGutter(lines, keys, s);
    expect(result[0]).toContain("💬");
    expect(result[1]).not.toContain("💬");
  });

  it("handles missing lineKey gracefully", () => {
    const s = createDiffCommentState();
    const result = buildCommentGutter(["only"], [], s);
    expect(result[0]).toContain("only");
  });
});

describe("buildCommentSidebarText", () => {
  it("returns no-comment message when empty", () => {
    const s = createDiffCommentState();
    expect(buildCommentSidebarText("web:image", s)).toBe("No comments for this line.");
  });

  it("formats multiple comments with index and date", () => {
    let s = createDiffCommentState();
    s = addComment(s, "web:image", "first");
    s = addComment(s, "web:image", "second");
    const text = buildCommentSidebarText("web:image", s);
    expect(text).toContain("[1]");
    expect(text).toContain("[2]");
    expect(text).toContain("first");
    expect(text).toContain("second");
  });
});

describe("buildCommentStatusText", () => {
  it("shows total comment count", () => {
    let s = createDiffCommentState();
    s = addComment(s, "web:image", "hi");
    const text = buildCommentStatusText(s, null);
    expect(text).toContain("Comments: 1");
  });

  it("shows per-line count when lineKey provided", () => {
    let s = createDiffCommentState();
    s = addComment(s, "web:image", "hi");
    const text = buildCommentStatusText(s, "web:image");
    expect(text).toContain("On this line: 1");
  });

  it("shows editing indicator when editingId set", () => {
    let s = createDiffCommentState();
    s = addComment(s, "web:image", "hi");
    const id = Array.from(s.comments.keys())[0];
    s = setEditingComment(s, id);
    expect(buildCommentStatusText(s, null)).toContain("editing");
  });
});

describe("formatCommentCount", () => {
  it("returns empty string when no comments", () => {
    expect(formatCommentCount(createDiffCommentState())).toBe("");
  });

  it("returns singular for one comment", () => {
    const s = addComment(createDiffCommentState(), "web:image", "x");
    expect(formatCommentCount(s)).toContain("1 comment]");
  });

  it("returns plural for multiple comments", () => {
    let s = createDiffCommentState();
    s = addComment(s, "web:image", "a");
    s = addComment(s, "db:ports", "b");
    expect(formatCommentCount(s)).toContain("2 comments]");
  });
});
