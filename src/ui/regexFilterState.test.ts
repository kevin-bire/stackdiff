import {
  createRegexFilterState,
  setRegexPattern,
  toggleRegexFilter,
  toggleInvertMatch,
  testLine,
  applyRegexFilter,
  getRegexStatusText,
} from "./regexFilterState";

describe("createRegexFilterState", () => {
  it("returns default disabled state", () => {
    const s = createRegexFilterState();
    expect(s.enabled).toBe(false);
    expect(s.pattern).toBe("");
    expect(s.compiled).toBeNull();
    expect(s.error).toBeNull();
    expect(s.invertMatch).toBe(false);
  });
});

describe("setRegexPattern", () => {
  it("compiles a valid pattern", () => {
    const s = setRegexPattern(createRegexFilterState(), "^image:");
    expect(s.compiled).toBeInstanceOf(RegExp);
    expect(s.error).toBeNull();
  });

  it("stores error for invalid pattern", () => {
    const s = setRegexPattern(createRegexFilterState(), "[invalid");
    expect(s.compiled).toBeNull();
    expect(s.error).not.toBeNull();
  });

  it("clears compiled and error for empty pattern", () => {
    let s = setRegexPattern(createRegexFilterState(), "foo");
    s = setRegexPattern(s, "");
    expect(s.compiled).toBeNull();
    expect(s.error).toBeNull();
  });
});

describe("toggleRegexFilter", () => {
  it("flips enabled flag", () => {
    const s = createRegexFilterState();
    expect(toggleRegexFilter(s).enabled).toBe(true);
    expect(toggleRegexFilter(toggleRegexFilter(s)).enabled).toBe(false);
  });
});

describe("toggleInvertMatch", () => {
  it("flips invertMatch flag", () => {
    const s = createRegexFilterState();
    expect(toggleInvertMatch(s).invertMatch).toBe(true);
  });
});

describe("testLine", () => {
  it("returns true when filter disabled", () => {
    const s = createRegexFilterState();
    expect(testLine(s, "anything")).toBe(true);
  });

  it("matches lines when enabled", () => {
    let s = setRegexPattern(createRegexFilterState(), "image:");
    s = toggleRegexFilter(s);
    expect(testLine(s, "  image: nginx")).toBe(true);
    expect(testLine(s, "  ports:")).toBe(false);
  });

  it("inverts match when invertMatch is true", () => {
    let s = setRegexPattern(createRegexFilterState(), "image:");
    s = toggleRegexFilter(s);
    s = toggleInvertMatch(s);
    expect(testLine(s, "  image: nginx")).toBe(false);
    expect(testLine(s, "  ports:")).toBe(true);
  });
});

describe("applyRegexFilter", () => {
  it("returns all lines when disabled", () => {
    const s = createRegexFilterState();
    const lines = ["a", "b", "c"];
    expect(applyRegexFilter(s, lines)).toEqual(lines);
  });

  it("filters lines by pattern", () => {
    let s = setRegexPattern(createRegexFilterState(), "^\\+");
    s = toggleRegexFilter(s);
    const lines = ["+added", " same", "-removed"];
    expect(applyRegexFilter(s, lines)).toEqual(["+added"]);
  });
});

describe("getRegexStatusText", () => {
  it("shows off when disabled", () => {
    expect(getRegexStatusText(createRegexFilterState())).toBe("regex:off");
  });

  it("shows pattern when active", () => {
    let s = setRegexPattern(createRegexFilterState(), "foo");
    s = toggleRegexFilter(s);
    expect(getRegexStatusText(s)).toBe("regex:/foo/");
  });

  it("shows inverted label", () => {
    let s = setRegexPattern(createRegexFilterState(), "foo");
    s = toggleRegexFilter(s);
    s = toggleInvertMatch(s);
    expect(getRegexStatusText(s)).toContain("[inverted]");
  });

  it("shows error text on bad pattern", () => {
    let s = setRegexPattern(createRegexFilterState(), "[bad");
    s = toggleRegexFilter(s);
    expect(getRegexStatusText(s)).toContain("regex:error");
  });
});
