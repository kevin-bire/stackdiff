import {
  createThemeState,
  cycleTheme,
  setTheme,
  getThemeColor,
  applyThemeToLine,
} from "./themeState";

describe("createThemeState", () => {
  it("defaults to dark mode", () => {
    const state = createThemeState();
    expect(state.mode).toBe("dark");
    expect(state.colors.added).toBe("{green-fg}");
  });

  it("accepts an initial mode", () => {
    const state = createThemeState("light");
    expect(state.mode).toBe("light");
    expect(state.colors.removed).toBe("{magenta-fg}");
  });
});

describe("cycleTheme", () => {
  it("cycles dark -> light -> high-contrast -> dark", () => {
    let state = createThemeState("dark");
    state = cycleTheme(state);
    expect(state.mode).toBe("light");
    state = cycleTheme(state);
    expect(state.mode).toBe("high-contrast");
    state = cycleTheme(state);
    expect(state.mode).toBe("dark");
  });

  it("updates colors when cycling", () => {
    const dark = createThemeState("dark");
    const light = cycleTheme(dark);
    expect(light.colors.statusFg).toBe("{black-fg}");
  });
});

describe("setTheme", () => {
  it("sets the theme to a specific mode", () => {
    const state = createThemeState("dark");
    const updated = setTheme(state, "high-contrast");
    expect(updated.mode).toBe("high-contrast");
    expect(updated.colors.highlight).toBe("{bright-yellow-fg}");
  });

  it("does not mutate the original state", () => {
    const state = createThemeState("dark");
    setTheme(state, "light");
    expect(state.mode).toBe("dark");
  });
});

describe("getThemeColor", () => {
  it("returns the correct color for a key", () => {
    const state = createThemeState("dark");
    expect(getThemeColor(state, "border")).toBe("{blue-fg}");
  });
});

describe("applyThemeToLine", () => {
  const state = createThemeState("dark");

  it("wraps added lines with green", () => {
    const result = applyThemeToLine("+ image: nginx", state);
    expect(result).toContain("{green-fg}");
    expect(result).toContain("{/}");
  });

  it("wraps removed lines with red", () => {
    const result = applyThemeToLine("- image: nginx", state);
    expect(result).toContain("{red-fg}");
  });

  it("wraps header lines with cyan", () => {
    const result = applyThemeToLine("[service: web]", state);
    expect(result).toContain("{cyan-fg}");
  });

  it("wraps unchanged lines with white", () => {
    const result = applyThemeToLine("  ports: 80:80", state);
    expect(result).toContain("{white-fg}");
  });
});
