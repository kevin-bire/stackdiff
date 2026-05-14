export interface CliOptions {
  sources: string[];
  defaultFile: string;
  services: string[];
  noColor: boolean;
  help: boolean;
}

const USAGE = `
Usage: stackdiff <source1> <source2> [options]

Sources can be:
  path/to/docker-compose.yml        Local file
  branch:docker-compose.yml         File from a git branch

Options:
  --file, -f <name>    Default compose filename when using branch shorthand (default: docker-compose.yml)
  --service, -s <svc>  Filter to specific service(s); repeat for multiple
  --no-color           Disable color output
  --help, -h           Show this help message
`.trim();

export function parseArgs(argv: string[]): CliOptions {
  const args = argv.slice(2);
  const options: CliOptions = {
    sources: [],
    defaultFile: 'docker-compose.yml',
    services: [],
    noColor: false,
    help: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--no-color') {
      options.noColor = true;
    } else if ((arg === '--file' || arg === '-f') && args[i + 1]) {
      options.defaultFile = args[++i];
    } else if ((arg === '--service' || arg === '-s') && args[i + 1]) {
      options.services.push(args[++i]);
    } else if (!arg.startsWith('-')) {
      options.sources.push(arg);
    }
  }

  return options;
}

export function printUsage(): void {
  console.log(USAGE);
}

export function validateOptions(options: CliOptions): string | null {
  if (options.help) return null;
  if (options.sources.length < 2) {
    return 'Error: At least two sources are required.';
  }
  return null;
}
