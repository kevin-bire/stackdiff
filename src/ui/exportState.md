# exportState

Handles serialization and file export of the current diff view.

## Overview

`exportState` allows users to save the current diff to disk in one of three formats:

- **text** — plain text with ANSI codes stripped
- **json** — structured JSON matching the `DiffResult` shape
- **markdown** — fenced diff block with source header

## API

### `createExportState(): ExportState`

Returns the initial export state with no prior export recorded.

### `exportDiff(state, options, lines, diff, sources): ExportState`

Performs the export and returns updated state. On success, `exportSuccess` is `true` and `lastExportPath` is set. On failure, `exportError` contains the error message.

### `formatAsText(lines): string`

Strips ANSI escape codes from rendered lines and joins with newlines.

### `formatAsMarkdown(lines, sources): string`

Wraps stripped lines in a markdown fenced diff block with a sources header.

### `formatAsJson(diff): string`

Serializes the raw `DiffResult` object to pretty-printed JSON.

## ExportOptions

| Field             | Type           | Description                          |
|-------------------|----------------|--------------------------------------|
| `format`          | `ExportFormat` | `"text"`, `"json"`, or `"markdown"`  |
| `outputPath`      | `string`       | Absolute or relative file path       |
| `includeUnchanged`| `boolean`      | Reserved for future filtering        |

## Integration

Bind an export action in `keyBindings.ts` (e.g., `e`) that opens a prompt for the output path and format, then calls `exportDiff` and reflects the result in the status bar via `updateStatusBar`.
