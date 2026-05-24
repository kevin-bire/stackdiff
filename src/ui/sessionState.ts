// sessionState.ts — persists and restores UI session across runs

export type SessionData = {
  scrollOffset: number;
  activeService: string | null;
  collapsedServices: string[];
  filterMode: string;
  searchQuery: string;
  viewMode: string;
  theme: string;
};

export type SessionState = {
  data: SessionData;
  isDirty: boolean;
};

const DEFAULT_SESSION: SessionData = {
  scrollOffset: 0,
  activeService: null,
  collapsedServices: [],
  filterMode: "all",
  searchQuery: "",
  viewMode: "unified",
  theme: "default",
};

export function createSessionState(initial?: Partial<SessionData>): SessionState {
  return {
    data: { ...DEFAULT_SESSION, ...initial },
    isDirty: false,
  };
}

export function updateSession(
  state: SessionState,
  patch: Partial<SessionData>
): SessionState {
  return {
    data: { ...state.data, ...patch },
    isDirty: true,
  };
}

export function markClean(state: SessionState): SessionState {
  return { ...state, isDirty: false };
}

export function resetSession(state: SessionState): SessionState {
  return { data: { ...DEFAULT_SESSION }, isDirty: true };
}

export function serializeSession(state: SessionState): string {
  return JSON.stringify(state.data, null, 2);
}

export function deserializeSession(raw: string): SessionState {
  try {
    const parsed = JSON.parse(raw) as Partial<SessionData>;
    return createSessionState(parsed);
  } catch {
    return createSessionState();
  }
}
