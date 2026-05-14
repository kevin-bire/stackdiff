import { parseArgs, validateOptions } from './cliArgs';

describe('parseArgs', () => {
  it('parses two positional sources', () => {
    const opts = parseArgs(['node', 'stackdiff', 'main:docker-compose.yml', './docker-compose.yml']);
    expect(opts.sources).toEqual(['main:docker-compose.yml', './docker-compose.yml']);
  });

  it('parses --file flag', () => {
    const opts = parseArgs(['node', 'stackdiff', 'a', 'b', '--file', 'compose.prod.yml']);
    expect(opts.defaultFile).toBe('compose.prod.yml');
  });

  it('parses -f shorthand', () => {
    const opts = parseArgs(['node', 'stackdiff', 'a', 'b', '-f', 'compose.dev.yml']);
    expect(opts.defaultFile).toBe('compose.dev.yml');
  });

  it('parses multiple --service flags', () => {
    const opts = parseArgs(['node', 'stackdiff', 'a', 'b', '-s', 'web', '-s', 'db']);
    expect(opts.services).toEqual(['web', 'db']);
  });

  it('parses --no-color', () => {
    const opts = parseArgs(['node', 'stackdiff', 'a', 'b', '--no-color']);
    expect(opts.noColor).toBe(true);
  });

  it('parses --help', () => {
    const opts = parseArgs(['node', 'stackdiff', '--help']);
    expect(opts.help).toBe(true);
  });

  it('defaults noColor to false', () => {
    const opts = parseArgs(['node', 'stackdiff', 'a', 'b']);
    expect(opts.noColor).toBe(false);
  });
});

describe('validateOptions', () => {
  it('returns null when help flag is set', () => {
    expect(validateOptions({ sources: [], defaultFile: '', services: [], noColor: false, help: true })).toBeNull();
  });

  it('returns error when fewer than two sources', () => {
    const result = validateOptions({ sources: ['one'], defaultFile: '', services: [], noColor: false, help: false });
    expect(result).toMatch(/At least two sources/);
  });

  it('returns null for valid options', () => {
    const result = validateOptions({ sources: ['a', 'b'], defaultFile: '', services: [], noColor: false, help: false });
    expect(result).toBeNull();
  });
});
