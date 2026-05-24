import {
  partitionDiffLines,
  renderLines,
  buildSplitHeader,
} from "./splitViewRenderer";
import { createSplitViewState, setViewMode } from "./splitViewState";
import { createThemeState } from "./themeState";

const theme = createThemeState();

describe("partitionDiffLines", () => {
  it("puts removed lines on left only", () => {
    const result = partitionDiffLines(["-  old: value"]);
    expect(result[0].left).toBe("-  old: value");
    expect(result[0].right).toBe("");
  });

  it("puts added lines on right only", () => {
    const result = partitionDiffLines(["+  new: value"]);
    expect(result[0].left).toBe("");
    expect(result[0].right).toBe("+  new: value");
  });

  it("puts context lines on both sides", () => {
    const result = partitionDiffLines(["  context"]);
    expect(result[0].left).toBe("  context");
    expect(result[0].right).toBe("  context");
  });

  it("handles multiple lines", () => {
    const lines = ["-  a", "+  b", "  c"];
    const result = partitionDiffLines(lines);
    expect(result).toHaveLength(3);
  });
});

describe("renderLines — unified mode", () => {
  it("returns lines as-is (with theme applied) in unified mode", () => {
    const state = createSplitViewState();
    const lines = ["  image: nginx", "+ ports: ['80:80']"];
    const rendered = renderLines(lines, state, theme, 80);
    expect(rendered).toHaveLength(2);
  });
});

describe("renderLines — split mode", () => {
  it("returns same number of lines in split mode", () => {
    const state = setViewMode(createSplitViewState(), "split");
    const lines = ["-  old", "+  new", "  ctx"];
    const rendered = renderLines(lines, state, theme, 80);
    expect(rendered).toHaveLength(3);
  });

  it("includes separator in split lines", () => {
    const state = setViewMode(createSplitViewState(), "split");
    const rendered = renderLines(["  ctx"], state, theme, 80);
    expect(rendered[0]).toContain("│");
  });
});

describe("buildSplitHeader", () => {
  it("returns empty string in unified mode", () => {
    const state = createSplitViewState("a", "b");
    expect(buildSplitHeader(state, 80)).toBe("");
  });

  it("returns header with labels in split mode", () => {
    const state = setViewMode(createSplitViewState("main", "dev"), "split");
    const header = buildSplitHeader(state, 80);
    expect(header).toContain("main");
    expect(header).toContain("dev");
    expect(header).toContain("│");
  });
});
