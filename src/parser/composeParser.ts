import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as path from 'path';

export interface ServiceConfig {
  image?: string;
  build?: string | { context?: string; dockerfile?: string };
  ports?: string[];
  environment?: Record<string, string> | string[];
  volumes?: string[];
  depends_on?: string[] | Record<string, { condition: string }>;
  command?: string | string[];
  networks?: string[] | Record<string, unknown>;
  restart?: string;
  [key: string]: unknown;
}

export interface ComposeFile {
  version?: string;
  services: Record<string, ServiceConfig>;
  networks?: Record<string, unknown>;
  volumes?: Record<string, unknown>;
}

export interface ParsedCompose {
  filePath: string;
  content: ComposeFile;
}

export function parseComposeFile(filePath: string): ParsedCompose {
  const absolutePath = path.resolve(filePath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`File not found: ${absolutePath}`);
  }

  const raw = fs.readFileSync(absolutePath, 'utf8');
  const content = yaml.load(raw) as ComposeFile;

  if (!content || typeof content !== 'object') {
    throw new Error(`Invalid YAML in file: ${filePath}`);
  }

  if (!content.services || typeof content.services !== 'object') {
    throw new Error(`No 'services' key found in: ${filePath}`);
  }

  return { filePath: absolutePath, content };
}

export function parseComposeString(raw: string, label = '<inline>'): ParsedCompose {
  const content = yaml.load(raw) as ComposeFile;

  if (!content || typeof content !== 'object') {
    throw new Error(`Invalid YAML content from: ${label}`);
  }

  if (!content.services || typeof content.services !== 'object') {
    throw new Error(`No 'services' key found in content from: ${label}`);
  }

  return { filePath: label, content };
}

export function getServiceNames(parsed: ParsedCompose): string[] {
  return Object.keys(parsed.content.services);
}
