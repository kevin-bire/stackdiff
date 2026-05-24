import {
  createZoomState,
  zoomIn,
  zoomOut,
  resetZoom,
  isAtMin,
  isAtMax,
  getZoomMultiplier,
  applyZoomToWidth,
  formatZoomLabel,
} from "./zoomState";

describe("createZoomState", () => {
  it("creates default state at level 0", () => {
    const s = createZoomState();
    expect(s.level).toBe(0);
    expect(s.minLevel).toBe(-3);
    expect(s.maxLevel).toBe(3);
    expect(s.step).toBe(1);
  });

  it("clamps initial level to bounds", () => {
    expect(createZoomState(10).level).toBe(3);
    expect(createZoomState(-10).level).toBe(-3);
  });
});

describe("zoomIn", () => {
  it("increments level by step", () => {
    const s = createZoomState(0);
    expect(zoomIn(s).level).toBe(1);
  });

  it("does not exceed maxLevel", () => {
    const s = createZoomState(3);
    expect(zoomIn(s).level).toBe(3);
  });
});

describe("zoomOut", () => {
  it("decrements level by step", () => {
    const s = createZoomState(0);
    expect(zoomOut(s).level).toBe(-1);
  });

  it("does not go below minLevel", () => {
    const s = createZoomState(-3);
    expect(zoomOut(s).level).toBe(-3);
  });
});

describe("resetZoom", () => {
  it("resets level to 0", () => {
    const s = createZoomState(2);
    expect(resetZoom(s).level).toBe(0);
  });
});

describe("isAtMin / isAtMax", () => {
  it("detects min boundary", () => {
    expect(isAtMin(createZoomState(-3))).toBe(true);
    expect(isAtMin(createZoomState(0))).toBe(false);
  });

  it("detects max boundary", () => {
    expect(isAtMax(createZoomState(3))).toBe(true);
    expect(isAtMax(createZoomState(0))).toBe(false);
  });
});

describe("getZoomMultiplier", () => {
  it("returns 1.0 at level 0", () => {
    expect(getZoomMultiplier(createZoomState(0))).toBeCloseTo(1.0);
  });

  it("increases above 1.0 for positive levels", () => {
    expect(getZoomMultiplier(createZoomState(2))).toBeCloseTo(1.3);
  });

  it("decreases below 1.0 for negative levels", () => {
    expect(getZoomMultiplier(createZoomState(-2))).toBeCloseTo(0.7);
  });
});

describe("applyZoomToWidth", () => {
  it("scales base width by multiplier", () => {
    const s = createZoomState(0);
    expect(applyZoomToWidth(s, 100)).toBe(100);
  });

  it("enforces minimum width of 10", () => {
    const s = createZoomState(-3);
    expect(applyZoomToWidth(s, 5)).toBe(10);
  });
});

describe("formatZoomLabel", () => {
  it("shows 100% at level 0", () => {
    expect(formatZoomLabel(createZoomState(0))).toBe("Zoom: 100%");
  });

  it("shows scaled percentage at other levels", () => {
    expect(formatZoomLabel(createZoomState(2))).toBe("Zoom: 130%");
    expect(formatZoomLabel(createZoomState(-1))).toBe("Zoom: 85%");
  });
});
