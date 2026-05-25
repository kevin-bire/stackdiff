import {
  buildRangeStatusText,
  buildRangeHintText,
  applyHighlightToLines,
  buildRangeCopyText,
} from "./highlightRangeBar";
import {
  createHighlightRangeState,
  beginRange,
  extendRange,
} from "./highlightRangeState";

const idle = createHighlightRangeState();
const singleLine = beginRange(idle, 4);
const multiLine = extendRange(beginRange(idle, 2), 5);

describe("buildRangeStatusText", () => {
  it("returns empty string when idle", () => {
    expect(buildRangeStatusText(idle)).toBe("");
  });

  it("shows single line message when anchor === active", () => {
    expect(buildRangeStatusText(singleLine)).toBe(
      "Range: line 5 (1 line selected)"
    );
  });

  it("shows multi-line range message", () => {
    expect(buildRangeStatusText(multiLine)).toBe(
      "Range: lines 3–6 (4 lines selected)"
    );
  });
});

describe("buildRangeHintText", () => {
  it("shows start hint when idle", () => {
    expect(buildRangeHintText(idle)).toContain("Shift");
  });

  it("shows extend/copy/clear hint when selecting", () => {
    const text = buildRangeHintText(singleLine);
    expect(text).toContain("copy");
    expect(text).toContain("Esc");
  });
});

describe("applyHighlightToLines", () => {
  const lines = ["a", "b", "c", "d", "e"];

  it("returns lines unchanged when idle", () => {
    expect(applyHighlightToLines(lines, idle)).toEqual(lines);
  });

  it("wraps selected lines with highlight tags", () => {
    const state = extendRange(beginRange(idle, 1), 2);
    const result = applyHighlightToLines(lines, state, "[H]", "[R]");
    expect(result[0]).toBe("a");
    expect(result[1]).toBe("[H]b[R]");
    expect(result[2]).toBe("[H]c[R]");
    expect(result[3]).toBe("d");
  });
});

describe("buildRangeCopyText", () => {
  const lines = ["\x1b[32mfoo\x1b[0m", "bar", "baz", "qux"];

  it("returns empty string when no range", () => {
    expect(buildRangeCopyText(lines, idle)).toBe("");
  });

  it("strips ANSI codes and joins selected lines", () => {
    const state = extendRange(beginRange(idle, 0), 1);
    expect(buildRangeCopyText(lines, state)).toBe("foo\nbar");
  });

  it("handles single-line selection", () => {
    expect(buildRangeCopyText(lines, beginRange(idle, 2))).toBe("baz");
  });
});
