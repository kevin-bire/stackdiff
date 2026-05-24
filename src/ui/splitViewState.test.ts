import {
  createSplitViewState,
  toggleViewMode,
  setViewMode,
  focusPane,
  toggleFocusedPane,
  isSplitMode,
  getPaneLabels,
} from "./splitViewState";

describe("createSplitViewState", () => {
  it("defaults to unified mode", () => {
    const s = createSplitViewState();
    expect(s.mode).toBe("unified");
  });

  it("uses provided labels", () => {
    const s = createSplitViewState("main", "feature");
    expect(s.leftLabel).toBe("main");
    expect(s.rightLabel).toBe("feature");
  });

  it("defaults focus to left pane", () => {
    const s = createSplitViewState();
    expect(s.focusedPane).toBe("left");
  });
});

describe("toggleViewMode", () => {
  it("switches from unified to split", () => {
    const s = createSplitViewState();
    expect(toggleViewMode(s).mode).toBe("split");
  });

  it("switches from split to unified", () => {
    const s = setViewMode(createSplitViewState(), "split");
    expect(toggleViewMode(s).mode).toBe("unified");
  });

  it("does not mutate original state", () => {
    const s = createSplitViewState();
    toggleViewMode(s);
    expect(s.mode).toBe("unified");
  });
});

describe("focusPane", () => {
  it("sets focused pane to right", () => {
    const s = focusPane(createSplitViewState(), "right");
    expect(s.focusedPane).toBe("right");
  });
});

describe("toggleFocusedPane", () => {
  it("toggles from left to right", () => {
    const s = toggleFocusedPane(createSplitViewState());
    expect(s.focusedPane).toBe("right");
  });

  it("toggles from right to left", () => {
    const s = focusPane(createSplitViewState(), "right");
    expect(toggleFocusedPane(s).focusedPane).toBe("left");
  });
});

describe("isSplitMode", () => {
  it("returns false for unified", () => {
    expect(isSplitMode(createSplitViewState())).toBe(false);
  });

  it("returns true for split", () => {
    const s = setViewMode(createSplitViewState(), "split");
    expect(isSplitMode(s)).toBe(true);
  });
});

describe("getPaneLabels", () => {
  it("returns left and right labels", () => {
    const s = createSplitViewState("branch-a", "branch-b");
    expect(getPaneLabels(s)).toEqual({ left: "branch-a", right: "branch-b" });
  });
});
