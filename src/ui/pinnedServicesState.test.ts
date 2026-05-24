import {
  createPinnedServicesState,
  pinService,
  unpinService,
  togglePin,
  isPinned,
  getPinnedServices,
  clearPins,
  reorderLines,
} from "./pinnedServicesState";

describe("createPinnedServicesState", () => {
  it("creates empty state with default maxPins", () => {
    const s = createPinnedServicesState();
    expect(s.pinned.size).toBe(0);
    expect(s.maxPins).toBe(10);
  });

  it("respects custom maxPins", () => {
    const s = createPinnedServicesState(3);
    expect(s.maxPins).toBe(3);
  });
});

describe("pinService", () => {
  it("adds a service to pinned set", () => {
    const s = pinService(createPinnedServicesState(), "web");
    expect(s.pinned.has("web")).toBe(true);
  });

  it("does not duplicate pins", () => {
    let s = createPinnedServicesState();
    s = pinService(s, "web");
    s = pinService(s, "web");
    expect(s.pinned.size).toBe(1);
  });

  it("respects maxPins limit", () => {
    let s = createPinnedServicesState(2);
    s = pinService(s, "a");
    s = pinService(s, "b");
    s = pinService(s, "c");
    expect(s.pinned.size).toBe(2);
    expect(s.pinned.has("c")).toBe(false);
  });
});

describe("unpinService", () => {
  it("removes a pinned service", () => {
    let s = pinService(createPinnedServicesState(), "db");
    s = unpinService(s, "db");
    expect(s.pinned.has("db")).toBe(false);
  });

  it("is a no-op for unknown service", () => {
    const s = createPinnedServicesState();
    const s2 = unpinService(s, "ghost");
    expect(s2).toBe(s);
  });
});

describe("togglePin", () => {
  it("pins an unpinned service", () => {
    const s = togglePin(createPinnedServicesState(), "cache");
    expect(isPinned(s, "cache")).toBe(true);
  });

  it("unpins a pinned service", () => {
    let s = pinService(createPinnedServicesState(), "cache");
    s = togglePin(s, "cache");
    expect(isPinned(s, "cache")).toBe(false);
  });
});

describe("getPinnedServices", () => {
  it("returns array of pinned service names", () => {
    let s = createPinnedServicesState();
    s = pinService(s, "web");
    s = pinService(s, "db");
    const names = getPinnedServices(s);
    expect(names).toContain("web");
    expect(names).toContain("db");
    expect(names.length).toBe(2);
  });
});

describe("clearPins", () => {
  it("removes all pinned services", () => {
    let s = createPinnedServicesState();
    s = pinService(s, "web");
    s = pinService(s, "db");
    s = clearPins(s);
    expect(s.pinned.size).toBe(0);
  });
});

describe("reorderLines", () => {
  it("moves pinned service lines to the top", () => {
    const lines = ["line0", "line1", "line2", "line3"];
    const map = new Map<string, number[]>([
      ["web", [2, 3]],
      ["db", [0, 1]],
    ]);
    const pinned = new Set(["web"]);
    const result = reorderLines(lines, map, pinned);
    expect(result[0]).toBe("line2");
    expect(result[1]).toBe("line3");
    expect(result[2]).toBe("line0");
    expect(result[3]).toBe("line1");
  });

  it("returns original order when nothing is pinned", () => {
    const lines = ["a", "b", "c"];
    const map = new Map<string, number[]>([["svc", [0, 1, 2]]]);
    const result = reorderLines(lines, map, new Set());
    expect(result).toEqual(["a", "b", "c"]);
  });
});
