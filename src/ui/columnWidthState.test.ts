import {
  createColumnWidthState,
  getColumnWidths,
  setTotalWidth,
  adjustRatio,
  resetRatio,
  formatColumnDivider,
} from "./columnWidthState";

describe("createColumnWidthState", () => {
  it("creates state with default ratio", () => {
    const state = createColumnWidthState(100);
    expect(state.totalWidth).toBe(100);
    expect(state.leftRatio).toBe(0.5);
    expect(state.minColumnWidth).toBe(10);
  });

  it("clamps totalWidth to minimum usable size", () => {
    const state = createColumnWidthState(5);
    expect(state.totalWidth).toBe(21); // 10 * 2 + 1
  });

  it("accepts custom ratio and minColumnWidth", () => {
    const state = createColumnWidthState(80, 0.3, 8);
    expect(state.leftRatio).toBe(0.3);
    expect(state.minColumnWidth).toBe(8);
  });
});

describe("getColumnWidths", () => {
  it("splits evenly with 0.5 ratio", () => {
    const state = createColumnWidthState(101);
    const widths = getColumnWidths(state);
    expect(widths.separator).toBe(1);
    expect(widths.left + widths.right + widths.separator).toBe(101);
    expect(widths.left).toBe(50);
    expect(widths.right).toBe(50);
  });

  it("respects left ratio", () => {
    const state = createColumnWidthState(100, 0.7);
    const widths = getColumnWidths(state);
    expect(widths.left).toBeGreaterThan(widths.right);
  });

  it("enforces minColumnWidth on both sides", () => {
    const state = createColumnWidthState(100, 0.0);
    const widths = getColumnWidths(state);
    expect(widths.left).toBeGreaterThanOrEqual(10);
    expect(widths.right).toBeGreaterThanOrEqual(10);
  });
});

describe("setTotalWidth", () => {
  it("updates total width", () => {
    const state = createColumnWidthState(100);
    const updated = setTotalWidth(state, 120);
    expect(updated.totalWidth).toBe(120);
    expect(updated.leftRatio).toBe(state.leftRatio);
  });

  it("clamps small values", () => {
    const state = createColumnWidthState(100);
    const updated = setTotalWidth(state, 1);
    expect(updated.totalWidth).toBe(21);
  });
});

describe("adjustRatio", () => {
  it("increases left ratio", () => {
    const state = createColumnWidthState(100, 0.5);
    const updated = adjustRatio(state, 0.1);
    expect(updated.leftRatio).toBeCloseTo(0.6);
  });

  it("clamps ratio to [0, 1]", () => {
    const state = createColumnWidthState(100, 0.9);
    const updated = adjustRatio(state, 0.5);
    expect(updated.leftRatio).toBe(1);
  });
});

describe("resetRatio", () => {
  it("resets to 0.5", () => {
    const state = createColumnWidthState(100, 0.8);
    const reset = resetRatio(state);
    expect(reset.leftRatio).toBe(0.5);
  });
});

describe("formatColumnDivider", () => {
  it("returns a single divider character", () => {
    expect(formatColumnDivider(1)).toBe("│");
  });
});
