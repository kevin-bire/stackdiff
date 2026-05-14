import * as fs from 'fs';
import * as path from 'path';
import * as child_process from 'child_process';
import { resolveFileSource, resolveGitBranchSource, resolveSource, resolveSources } from './sourceResolver';

jest.mock('fs');
jest.mock('child_process');

const mockFs = fs as jest.Mocked<typeof fs>;
const mockExec = child_process.execSync as jest.Mock;

const SAMPLE = 'version: "3"\nservices:\n  web:\n    image: nginx\n';

beforeEach(() => jest.clearAllMocks());

describe('resolveFileSource', () => {
  it('reads an existing file', () => {
    mockFs.existsSync.mockReturnValue(true);
    mockFs.readFileSync.mockReturnValue(SAMPLE as any);
    const result = resolveFileSource('docker-compose.yml');
    expect(result.content).toBe(SAMPLE);
    expect(result.type).toBe('file');
  });

  it('throws if file does not exist', () => {
    mockFs.existsSync.mockReturnValue(false);
    expect(() => resolveFileSource('missing.yml')).toThrow('File not found');
  });
});

describe('resolveGitBranchSource', () => {
  it('returns content from git show', () => {
    mockExec.mockReturnValue(SAMPLE);
    const result = resolveGitBranchSource('main', 'docker-compose.yml');
    expect(result.content).toBe(SAMPLE);
    expect(result.label).toBe('main:docker-compose.yml');
    expect(result.type).toBe('git-branch');
  });

  it('throws on git error', () => {
    mockExec.mockImplementation(() => { throw new Error('not a git repo'); });
    expect(() => resolveGitBranchSource('main', 'docker-compose.yml')).toThrow('Could not read');
  });
});

describe('resolveSource', () => {
  it('treats spec with colon as branch:file', () => {
    mockExec.mockReturnValue(SAMPLE);
    const result = resolveSource('feature/my-branch:docker-compose.yml');
    expect(result.type).toBe('git-branch');
  });

  it('treats plain path as file', () => {
    mockFs.existsSync.mockReturnValue(true);
    mockFs.readFileSync.mockReturnValue(SAMPLE as any);
    const result = resolveSource('./docker-compose.yml');
    expect(result.type).toBe('file');
  });
});

describe('resolveSources', () => {
  it('throws when fewer than two specs provided', () => {
    expect(() => resolveSources(['only-one'])).toThrow('At least two sources');
  });
});
