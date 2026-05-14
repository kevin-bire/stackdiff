# stackdiff

A terminal UI for comparing Docker Compose service configurations across multiple files or branches.

## Installation

```bash
npm install -g stackdiff
```

## Usage

Compare two Docker Compose files directly:

```bash
stackdiff docker-compose.yml docker-compose.prod.yml
```

Compare configurations across Git branches:

```bash
stackdiff --branch main --branch feature/new-services
```

Navigate the interactive TUI using arrow keys to move between services, `Tab` to switch panes, and `q` to quit.

### Options

| Flag | Description |
|------|-------------|
| `--branch <name>` | Compare compose files across Git branches |
| `--file <path>` | Specify a compose file path (default: `docker-compose.yml`) |
| `--service <name>` | Focus diff on a specific service |
| `--no-color` | Disable colored output |

### Example Output

```
┌─ Services ────────┐  ┌─ Diff: web ────────────────────────────┐
│ > web             │  │ - image: nginx:1.21                     │
│   db              │  │ + image: nginx:1.25                     │
│   redis           │  │ + ports:                                │
└───────────────────┘  │ +   - "443:443"                         │
                       └─────────────────────────────────────────┘
```

## Requirements

- Node.js 18+
- Docker Compose v2 compatible files

## License

MIT