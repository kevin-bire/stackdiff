import {
  createSessionState,
  updateSession,
  markClean,
  resetSession,
  serializeSession,
  deserializeSession,
} from "./sessionState";

describe("createSessionState", () => {
  it("creates default session", () => {
    const s = createSessionState();
    expect(s.data.scrollOffset).toBe(0);
    expect(s.data.activeService).toBeNull();
    expect(s.data.filterMode).toBe("all");
    expect(s.isDirty).toBe(false);
  });

  it("merges initial overrides", () => {
    const s = createSessionState({ theme: "dark", scrollOffset: 10 });
    expect(s.data.theme).toBe("dark");
    expect(s.data.scrollOffset).toBe(10);
    expect(s.data.filterMode).toBe("all");
  });
});

describe("updateSession", () => {
  it("patches fields and marks dirty", () => {
    const s = createSessionState();
    const s2 = updateSession(s, { searchQuery: "nginx", activeService: "web" });
    expect(s2.data.searchQuery).toBe("nginx");
    expect(s2.data.activeService).toBe("web");
    expect(s2.isDirty).toBe(true);
  });

  it("does not mutate original", () => {
    const s = createSessionState();
    updateSession(s, { theme: "light" });
    expect(s.data.theme).toBe("default");
  });
});

describe("markClean", () => {
  it("sets isDirty to false", () => {
    const s = updateSession(createSessionState(), { scrollOffset: 5 });
    expect(s.isDirty).toBe(true);
    const s2 = markClean(s);
    expect(s2.isDirty).toBe(false);
  });
});

describe("resetSession", () => {
  it("resets to defaults and marks dirty", () => {
    const s = updateSession(createSessionState(), { theme: "dark", scrollOffset: 42 });
    const s2 = resetSession(s);
    expect(s2.data.theme).toBe("default");
    expect(s2.data.scrollOffset).toBe(0);
    expect(s2.isDirty).toBe(true);
  });
});

describe("serializeSession / deserializeSession", () => {
  it("round-trips session data", () => {
    const s = updateSession(createSessionState(), { theme: "dark", searchQuery: "db" });
    const raw = serializeSession(s);
    const s2 = deserializeSession(raw);
    expect(s2.data.theme).toBe("dark");
    expect(s2.data.searchQuery).toBe("db");
    expect(s2.isDirty).toBe(false);
  });

  it("returns default session on invalid JSON", () => {
    const s = deserializeSession("not-json");
    expect(s.data.theme).toBe("default");
  });
});
