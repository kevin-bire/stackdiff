import { ComposeService } from '../parser/composeParser';

export type DiffStatus = 'added' | 'removed' | 'modified' | 'unchanged';

export interface FieldDiff {
  key: string;
  leftValue: unknown;
  rightValue: unknown;
  status: DiffStatus;
}

export interface ServiceDiff {
  serviceName: string;
  status: DiffStatus;
  fields: FieldDiff[];
}

export interface ComposeDiff {
  leftLabel: string;
  rightLabel: string;
  services: ServiceDiff[];
}

function diffObjects(
  left: Record<string, unknown>,
  right: Record<string, unknown>
): FieldDiff[] {
  const allKeys = new Set([...Object.keys(left), ...Object.keys(right)]);
  const diffs: FieldDiff[] = [];

  for (const key of allKeys) {
    const leftVal = left[key];
    const rightVal = right[key];
    let status: DiffStatus;

    if (!(key in left)) {
      status = 'added';
    } else if (!(key in right)) {
      status = 'removed';
    } else if (JSON.stringify(leftVal) !== JSON.stringify(rightVal)) {
      status = 'modified';
    } else {
      status = 'unchanged';
    }

    diffs.push({ key, leftValue: leftVal, rightValue: rightVal, status });
  }

  return diffs.sort((a, b) => a.key.localeCompare(b.key));
}

export function diffServices(
  leftServices: Record<string, ComposeService>,
  rightServices: Record<string, ComposeService>,
  leftLabel: string,
  rightLabel: string
): ComposeDiff {
  const allNames = new Set([
    ...Object.keys(leftServices),
    ...Object.keys(rightServices),
  ]);

  const services: ServiceDiff[] = [];

  for (const name of allNames) {
    const left = leftServices[name];
    const right = rightServices[name];

    if (!left) {
      services.push({ serviceName: name, status: 'added', fields: [] });
    } else if (!right) {
      services.push({ serviceName: name, status: 'removed', fields: [] });
    } else {
      const fields = diffObjects(
        left as Record<string, unknown>,
        right as Record<string, unknown>
      );
      const hasChanges = fields.some((f) => f.status !== 'unchanged');
      services.push({
        serviceName: name,
        status: hasChanges ? 'modified' : 'unchanged',
        fields,
      });
    }
  }

  return {
    leftLabel,
    rightLabel,
    services: services.sort((a, b) => a.serviceName.localeCompare(b.serviceName)),
  };
}
