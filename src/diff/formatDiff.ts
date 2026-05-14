import chalk from 'chalk';
import { ComposeDiff, FieldDiff, ServiceDiff, DiffStatus } from './serviceDiffer';

const STATUS_COLORS: Record<DiffStatus, (s: string) => string> = {
  added: chalk.green,
  removed: chalk.red,
  modified: chalk.yellow,
  unchanged: chalk.gray,
};

const STATUS_ICONS: Record<DiffStatus, string> = {
  added: '+',
  removed: '-',
  modified: '~',
  unchanged: ' ',
};

function formatValue(value: unknown): string {
  if (value === undefined) return chalk.dim('(none)');
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

function formatField(field: FieldDiff, indent = '    '): string {
  const color = STATUS_COLORS[field.status];
  const icon = STATUS_ICONS[field.status];

  if (field.status === 'added') {
    return color(`${indent}${icon} ${field.key}: ${formatValue(field.rightValue)}`);
  }
  if (field.status === 'removed') {
    return color(`${indent}${icon} ${field.key}: ${formatValue(field.leftValue)}`);
  }
  if (field.status === 'modified') {
    return [
      color(`${indent}${icon} ${field.key}:`),
      chalk.red(`${indent}    < ${formatValue(field.leftValue)}`),
      chalk.green(`${indent}    > ${formatValue(field.rightValue)}`),
    ].join('\n');
  }
  return color(`${indent}${icon} ${field.key}: ${formatValue(field.leftValue)}`);
}

function formatService(service: ServiceDiff): string {
  const color = STATUS_COLORS[service.status];
  const icon = STATUS_ICONS[service.status];
  const header = color(`  ${icon} ${service.serviceName}`);

  if (service.status === 'added' || service.status === 'removed') {
    return header;
  }

  const changedFields = service.fields.filter((f) => f.status !== 'unchanged');
  if (changedFields.length === 0) return header;

  const fieldLines = changedFields.map((f) => formatField(f)).join('\n');
  return `${header}\n${fieldLines}`;
}

export function formatDiff(diff: ComposeDiff, showUnchanged = false): string {
  const lines: string[] = [
    chalk.bold(`Comparing: ${chalk.cyan(diff.leftLabel)} → ${chalk.cyan(diff.rightLabel)}`),
    '',
  ];

  const filtered = showUnchanged
    ? diff.services
    : diff.services.filter((s) => s.status !== 'unchanged');

  if (filtered.length === 0) {
    lines.push(chalk.green('  No differences found.'));
  } else {
    for (const service of filtered) {
      lines.push(formatService(service));
    }
  }

  return lines.join('\n');
}
