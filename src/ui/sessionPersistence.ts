// sessionPersistence.ts — read/write session to disk

import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import {
  SessionState,
  serializeSession,
  deserializeSession,
  markClean,
} from "./sessionState";

const SESSION_DIR = path.join(os.homedir(), ".stackdiff");
const SESSION_FILE = path.join(SESSION_DIR, "session.json");

export function getSessionFilePath(): string {
  return SESSION_FILE;
}

export function saveSession(state: SessionState): boolean {
  if (!state.isDirty) return false;
  try {
    if (!fs.existsSync(SESSION_DIR)) {
      fs.mkdirSync(SESSION_DIR, { recursive: true });
    }
    fs.writeFileSync(SESSION_FILE, serializeSession(state), "utf-8");
    return true;
  } catch {
    return false;
  }
}

export function loadSession(): SessionState {
  try {
    if (!fs.existsSync(SESSION_FILE)) {
      return deserializeSession("{}");
    }
    const raw = fs.readFileSync(SESSION_FILE, "utf-8");
    return markClean(deserializeSession(raw));
  } catch {
    return deserializeSession("{}");
  }
}

export function clearSession(): boolean {
  try {
    if (fs.existsSync(SESSION_FILE)) {
      fs.unlinkSync(SESSION_FILE);
    }
    return true;
  } catch {
    return false;
  }
}
