import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import {
  createExportState,
  exportDiff,
  formatAsJson,
  formatAsMarkdown,
  formatAsText,
} from "./exportState";
import { DiffResult } from "../diff";

const mockDiff: DiffResult = {
  services: {
    web: {
      added: { image: "nginx:latest" },
      removed: {},
      changed: {},
      unchanged: {},
    },
  },
};

const mockLines = [
  "\x1b[32m+ image: nginx:latest\x1b[0m",
  "  ports: 80:80",
];

describe("createExportState", () => {
  it("returns default state", () => {
    const state = createExportState();
    expect(state.lastExportPath).toBeNull();
    expect(state.exportSuccess).toBe(false);
    expect(state.exportError).toBeNull();
    expect(state.lastExportFormat).toBe("text");
  });
});

describe("formatAsText", () => {
  it("strips ANSI codes", () => {
    const result = formatAsText(mockLines);
    expect(result).not.toContain("\x1b[");
    expect(result).toContain("image: nginx:latest");
  });
});

describe("formatAsMarkdown", () => {
  it("includes sources and diff block", () => {
    const result = formatAsMarkdown(mockLines, ["main", "dev"]);
    expect(result).toContain("**Sources:** main vs dev");
    expect(result).toContain("```diff");
    expect(result).not.toContain("\x1b[");
  });
});

describe("formatAsJson", () => {
  it("serializes diff to JSON", () => {
    const result = formatAsJson(mockDiff);
    const parsed = JSON.parse(result);
    expect(parsed.services.web.added.image).toBe("nginx:latest");
  });
});

describe("exportDiff", () => {
  it("writes text file and returns success state", () => {
    const tmpFile = path.join(os.tmpdir(), `stackdiff-test-${Date.now()}.txt`);
    const state = createExportState();
    const result = exportDiff(
      state,
      { format: "text", outputPath: tmpFile, includeUnchanged: false },
      mockLines,
      mockDiff,
      ["main", "dev"]
    );
    expect(result.exportSuccess).toBe(true);
    expect(result.exportError).toBeNull();
    expect(fs.existsSync(tmpFile)).toBe(true);
    fs.unlinkSync(tmpFile);
  });

  it("returns error state on invalid path", () => {
    const state = createExportState();
    const result = exportDiff(
      state,
      { format: "text", outputPath: "/no/such/dir/out.txt", includeUnchanged: false },
      mockLines,
      mockDiff,
      ["main"]
    );
    expect(result.exportSuccess).toBe(false);
    expect(result.exportError).not.toBeNull();
  });
});
