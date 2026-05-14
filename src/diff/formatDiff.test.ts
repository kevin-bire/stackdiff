import { formatDiff } from './formatDiff';
import { ComposeDiff } from './serviceDiffer';

// Strip ANSI codes for assertion clarity
const strip = (s: string) => s.replace(/\x1B\[[0-9;]*m/g, '');

const makeDiff = (overrides: Partial<ComposeDiff> = {}): ComposeDiff => ({
  leftLabel: 'main',
  rightLabel: 'feature',
  services: [],
  ...overrides,
});

describe('formatDiff', () => {
  it('includes label header', () => {
    const output = strip(formatDiff(makeDiff()));
    expect(output).toContain('main');
    expect(output).toContain('feature');
  });

  it('shows no differences message when empty', () => {
    const output = strip(formatDiff(makeDiff()));
    expect(output).toContain('No differences found');
  });

  it('shows added service', () => {
    const diff = makeDiff({
      services: [{ serviceName: 'worker', status: 'added', fields: [] }],
    });
    const output = strip(formatDiff(diff));
    expect(output).toContain('+ worker');
  });

  it('shows removed service', () => {
    const diff = makeDiff({
      services: [{ serviceName: 'legacy', status: 'removed', fields: [] }],
    });
    const output = strip(formatDiff(diff));
    expect(output).toContain('- legacy');
  });

  it('hides unchanged services by default', () => {
    const diff = makeDiff({
      services: [{ serviceName: 'db', status: 'unchanged', fields: [] }],
    });
    const output = strip(formatDiff(diff));
    expect(output).not.toContain('db');
    expect(output).toContain('No differences found');
  });

  it('shows unchanged services when flag is true', () => {
    const diff = makeDiff({
      services: [{ serviceName: 'db', status: 'unchanged', fields: [] }],
    });
    const output = strip(formatDiff(diff, true));
    expect(output).toContain('db');
  });

  it('shows modified field with before/after values', () => {
    const diff = makeDiff({
      services: [
        {
          serviceName: 'api',
          status: 'modified',
          fields: [
            { key: 'image', leftValue: 'node:18', rightValue: 'node:20', status: 'modified' },
          ],
        },
      ],
    });
    const output = strip(formatDiff(diff));
    expect(output).toContain('node:18');
    expect(output).toContain('node:20');
  });
});
