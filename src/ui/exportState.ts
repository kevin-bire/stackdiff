import * as fs from "fs";
import * as path from "path";
import { DiffResult } from "../diff";
import { FilterState } from "./filterState";

export type ExportFormat = "text" | "json" | "markdown";

export interface ExportOptions {
  format: ExportFormat;
  outputPath: string;
  includeUnchanged: boolean;
}

export interface ExportState {
  lastExportPath: string | null;
  lastExportFormat: ExportFormat;
  exportError: string | null;
  exportSuccess: boolean;
}

export function createExportState(): ExportState {
  return {
    lastExportPath: null,
    lastExportFormat: "text",
    exportError: null,
    exportSuccess: false,
  };
}

export function formatAsText(lines: string[]): string {
  return lines.map((l) => l.replace(/\x1b\[[0-9;]*m/g, "")).join("\n");
}

export function formatAsMarkdown(lines: string[], sources: string[]): string {
  const header = `# stackdiff export\n\n**Sources:** ${sources.join(" vs ")}\n\n`;
  const body = lines
    .map((l) => l.replace(/\x1b\[[0-9;]*m/g, ""))
    .join("\n");
  return `${header}\`\`\`diff\n${body}\n\`\`\``;
}

export function formatAsJson(diff: DiffResult): string {
  return JSON.stringify(diff, null, 2);
}

export function exportDiff(
  state: ExportState,
  options: ExportOptions,
  lines: string[],
  diff: DiffResult,
  sources: string[]
): ExportState {
  try {
    let content: string;
    if (options.format === "json") {
      content = formatAsJson(diff);
    } else if (options.format === "markdown") {
      content = formatAsMarkdown(lines, sources);
    } else {
      content = formatAsText(lines);
    }
    const resolved = path.resolve(options.outputPath);
    fs.writeFileSync(resolved, content, "utf-8");
    return {
      lastExportPath: resolved,
      lastExportFormat: options.format,
      exportError: null,
      exportSuccess: true,
    };
  } catch (err: any) {
    return {
      ...state,
      exportError: err.message ?? "Unknown error during export",
      exportSuccess: false,
    };
  }
}
