# diffCommentState

Manages inline comments attached to specific diff lines within the terminal UI.

## Overview

Each comment is keyed by a `lineKey` string in the format `"serviceName:fieldPath"`
(e.g. `"web:image"` or `"db:ports.0"`). This allows comments to survive re-renders
as long as the service/field identity is stable.

## State Shape

```ts
type DiffCommentState = {
  comments: Map<string, CommentEntry>; // id -> entry
  editingId: string | null;            // id of comment currently being edited
};
```

## Functions

| Function | Description |
|---|---|
| `createDiffCommentState()` | Returns empty initial state |
| `addComment(state, lineKey, text)` | Adds a new comment to a line |
| `updateComment(state, id, text)` | Edits the text of an existing comment |
| `removeComment(state, id)` | Deletes a comment by id |
| `getCommentsForLine(state, lineKey)` | Returns all comments for a given line |
| `setEditingComment(state, id)` | Marks a comment as being edited (or clears) |
| `hasComments(state, lineKey)` | Returns true if any comments exist for that line |

## Usage

Comments are rendered via `diffCommentBar.ts`, which provides gutter indicators,
a sidebar panel, and a status bar summary. The `lineKey` is derived from the
diff rendering pass and passed alongside each visible line.
