import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import {
  saveSession,
  loadSession,
  clearSession,
  getSessionFilePath,
} from "./sessionPersistence";
import { createSessionState, updateSession } from "./sessionState";

const SESSION_FILE = getSessionFilePath();
const SESSION_DIR = path.dirname(SESSION_FILE);

function cleanup() {
  if (fs.existsSync(SESSION_FILE)) fs.unlinkSync(SESSION_FILE);
}

beforeEach(cleanup);
afterAll(cleanup);

describe("saveSession", () => {
  it("does not write when not dirty", () => {
    const s = createSessionState();
    const result = saveSession(s);
    expect(result).toBe(false);
    expect(fs.existsSync(SESSION_FILE)).toBe(false);
  });

  it("writes file when dirty", () => {
    const s = updateSession(createSessionState(), { theme: "dark" });
    const result = saveSession(s);
    expect(result).toBe(true);
    expect(fs.existsSync(SESSION_FILE)).toBe(true);
    const raw = fs.readFileSync(SESSION_FILE, "utf-8");
    expect(raw).toContain("dark");
  });
});

describe("loadSession", () => {
  it("returns default session when file missing", () => {
    const s = loadSession();
    expect(s.data.theme).toBe("default");
    expect(s.isDirty).toBe(false);
  });

  it("loads saved session", () => {
    const s = updateSession(createSessionState(), { theme: "light", scrollOffset: 7 });
    saveSession(s);
    const loaded = loadSession();
    expect(loaded.data.theme).toBe("light");
    expect(loaded.data.scrollOffset).toBe(7);
    expect(loaded.isDirty).toBe(false);
  });
});

describe("clearSession", () => {
  it("removes session file", () => {
    const s = updateSession(createSessionState(), { theme: "dark" });
    saveSession(s);
    expect(fs.existsSync(SESSION_FILE)).toBe(true);
    const result = clearSession();
    expect(result).toBe(true);
    expect(fs.existsSync(SESSION_FILE)).toBe(false);
  });

  it("succeeds even when file does not exist", () => {
    const result = clearSession();
    expect(result).toBe(true);
  });
});
