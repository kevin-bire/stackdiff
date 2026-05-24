import {
  createMultiSelectState,
  toggleSelectService,
  selectRange,
  clearSelection,
  selectAll,
  getSelectedServices,
  isSelected,
} from "./multiSelectState";

const SERVICES = ["web", "api", "db", "cache", "worker"];

describe("createMultiSelectState", () => {
  it("starts with empty selection and inactive", () => {
    const s = createMultiSelectState();
    expect(s.selected.size).toBe(0);
    expect(s.active).toBe(false);
    expect(s.anchorService).toBeNull();
  });
});

describe("toggleSelectService", () => {
  it("selects a service", () => {
    const s = toggleSelectService(createMultiSelectState(), "web");
    expect(isSelected(s, "web")).toBe(true);
    expect(s.active).toBe(true);
    expect(s.anchorService).toBe("web");
  });

  it("deselects an already-selected service", () => {
    let s = toggleSelectService(createMultiSelectState(), "web");
    s = toggleSelectService(s, "web");
    expect(isSelected(s, "web")).toBe(false);
    expect(s.active).toBe(false);
  });

  it("can select multiple services independently", () => {
    let s = createMultiSelectState();
    s = toggleSelectService(s, "web");
    s = toggleSelectService(s, "db");
    expect(getSelectedServices(s)).toEqual(expect.arrayContaining(["web", "db"]));
    expect(s.selected.size).toBe(2);
  });
});

describe("selectRange", () => {
  it("selects all services between anchor and target", () => {
    let s = toggleSelectService(createMultiSelectState(), "api");
    s = selectRange(s, SERVICES, "cache");
    expect(isSelected(s, "api")).toBe(true);
    expect(isSelected(s, "db")).toBe(true);
    expect(isSelected(s, "cache")).toBe(true);
    expect(isSelected(s, "web")).toBe(false);
  });

  it("works in reverse order", () => {
    let s = toggleSelectService(createMultiSelectState(), "cache");
    s = selectRange(s, SERVICES, "api");
    expect(isSelected(s, "api")).toBe(true);
    expect(isSelected(s, "db")).toBe(true);
    expect(isSelected(s, "cache")).toBe(true);
  });

  it("falls back to toggle if no anchor", () => {
    const s = selectRange(createMultiSelectState(), SERVICES, "db");
    expect(isSelected(s, "db")).toBe(true);
    expect(s.selected.size).toBe(1);
  });
});

describe("clearSelection", () => {
  it("clears all selected services", () => {
    let s = selectAll(createMultiSelectState(), SERVICES);
    s = clearSelection(s);
    expect(s.selected.size).toBe(0);
    expect(s.active).toBe(false);
    expect(s.anchorService).toBeNull();
  });
});

describe("selectAll", () => {
  it("selects every service", () => {
    const s = selectAll(createMultiSelectState(), SERVICES);
    expect(s.selected.size).toBe(SERVICES.length);
    SERVICES.forEach((svc) => expect(isSelected(s, svc)).toBe(true));
    expect(s.active).toBe(true);
  });

  it("sets anchor to last service", () => {
    const s = selectAll(createMultiSelectState(), SERVICES);
    expect(s.anchorService).toBe("worker");
  });
});
