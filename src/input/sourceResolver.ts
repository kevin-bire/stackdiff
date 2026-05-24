import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

export type SourceType = 'file' | 'git-branch' | 'git-stash';

export interface ResolvedSource {
  label: string;
  content: string;
  type: SourceType;
}

export function resolveFileSource(filePath: string): ResolvedSource {
  const absPath = path.resolve(filePath);
  if (!fs.existsSync(absPath)) {
    throw new Error(`File not found: ${absPath}`);
  }
  const content = fs.readFileSync(absPath, 'utf-8');
  return { label: filePath, content, type: 'file' };
}

export function resolveGitBranchSource(branch: string, filePath: string): ResolvedSource {
  try {
    const content = execSync(`git show ${branch}:${filePath}`, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    return { label: `${branch}:${filePath}`, content, type: 'git-branch' };
  } catch (err) {
    const message = (err as Error).message ?? String(err);
    const stderr = message.match(/stderr: (.+)/)?.[1];
    const detail = stderr ?? message.split('\n')[0];
    throw new Error(`Could not read '${filePath}' from branch '${branch}': ${detail}`);
  }
}

export function resolveSource(spec: string, defaultFile = 'docker-compose.yml'): ResolvedSource {
  // Format: "branch:file" or just "file"
  const colonIdx = spec.indexOf(':');
  if (colonIdx > 0 && !spec.startsWith('/') && !spec.startsWith('.')) {
    const branch = spec.slice(0, colonIdx);
    const file = spec.slice(colonIdx + 1) || defaultFile;
    return resolveGitBranchSource(branch, file);
  }
  return resolveFileSource(spec);
}

export function resolveSources(specs: string[], defaultFile?: string): ResolvedSource[] {
  if (specs.length < 2) {
    throw new Error('At least two sources are required for comparison.');
  }
  return specs.map((spec) => resolveSource(spec, defaultFile));
}
