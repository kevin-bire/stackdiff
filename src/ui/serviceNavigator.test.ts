import {
  createServiceNavigator,
  nextService,
  prevService,
  jumpToService,
  getCurrentService,
  getTotalServices,
} from "./serviceNavigator";

describe("createServiceNavigator", () => {
  it("sets currentIndex to 0 when services exist", () => {
    const state = createServiceNavigator(["web", "db", "cache"]);
    expect(state.currentIndex).toBe(0);
    expect(state.serviceNames).toEqual(["web", "db", "cache"]);
  });

  it("sets currentIndex to -1 when no services", () => {
    const state = createServiceNavigator([]);
    expect(state.currentIndex).toBe(-1);
  });
});

describe("nextService", () => {
  it("advances to next service", () => {
    const state = createServiceNavigator(["web", "db", "cache"]);
    const next = nextService(state);
    expect(next.currentIndex).toBe(1);
  });

  it("wraps around to first service from last", () => {
    const state = createServiceNavigator(["web", "db"]);
    const wrapped = nextService(nextService(state));
    expect(wrapped.currentIndex).toBe(0);
  });

  it("returns same state if no services", () => {
    const state = createServiceNavigator([]);
    expect(nextService(state)).toEqual(state);
  });
});

describe("prevService", () => {
  it("moves to previous service", () => {
    const state = { serviceNames: ["web", "db", "cache"], currentIndex: 2 };
    const prev = prevService(state);
    expect(prev.currentIndex).toBe(1);
  });

  it("wraps around to last service from first", () => {
    const state = createServiceNavigator(["web", "db", "cache"]);
    const wrapped = prevService(state);
    expect(wrapped.currentIndex).toBe(2);
  });

  it("returns same state if no services", () => {
    const state = createServiceNavigator([]);
    expect(prevService(state)).toEqual(state);
  });
});

describe("jumpToService", () => {
  it("jumps to named service", () => {
    const state = createServiceNavigator(["web", "db", "cache"]);
    const jumped = jumpToService(state, "cache");
    expect(jumped.currentIndex).toBe(2);
  });

  it("returns same state if service not found", () => {
    const state = createServiceNavigator(["web", "db"]);
    expect(jumpToService(state, "unknown")).toEqual(state);
  });
});

describe("getCurrentService", () => {
  it("returns current service name", () => {
    const state = createServiceNavigator(["web", "db"]);
    expect(getCurrentService(state)).toBe("web");
  });

  it("returns null when no services", () => {
    const state = createServiceNavigator([]);
    expect(getCurrentService(state)).toBeNull();
  });
});

describe("getTotalServices", () => {
  it("returns correct count", () => {
    const state = createServiceNavigator(["web", "db", "cache"]);
    expect(getTotalServices(state)).toBe(3);
  });
});
