import { diffServices } from './serviceDiffer';
import { ComposeService } from '../parser/composeParser';

const makeService = (overrides: Partial<ComposeService> = {}): ComposeService => ({
  image: 'nginx:latest',
  ...overrides,
} as ComposeService);

describe('diffServices', () => {
  it('marks services only in right as added', () => {
    const left = {};
    const right = { web: makeService() };
    const result = diffServices(left, right, 'left', 'right');
    expect(result.services[0].status).toBe('added');
    expect(result.services[0].serviceName).toBe('web');
  });

  it('marks services only in left as removed', () => {
    const left = { web: makeService() };
    const right = {};
    const result = diffServices(left, right, 'left', 'right');
    expect(result.services[0].status).toBe('removed');
  });

  it('marks identical services as unchanged', () => {
    const svc = makeService({ image: 'redis:7' });
    const result = diffServices({ cache: svc }, { cache: svc }, 'a', 'b');
    expect(result.services[0].status).toBe('unchanged');
  });

  it('marks services with different fields as modified', () => {
    const left = { db: makeService({ image: 'postgres:14' }) };
    const right = { db: makeService({ image: 'postgres:15' }) };
    const result = diffServices(left, right, 'a', 'b');
    expect(result.services[0].status).toBe('modified');
  });

  it('returns correct field diff for modified service', () => {
    const left = { api: makeService({ image: 'node:18' }) };
    const right = { api: makeService({ image: 'node:20' }) };
    const result = diffServices(left, right, 'a', 'b');
    const imgField = result.services[0].fields.find((f) => f.key === 'image');
    expect(imgField?.status).toBe('modified');
    expect(imgField?.leftValue).toBe('node:18');
    expect(imgField?.rightValue).toBe('node:20');
  });

  it('preserves labels', () => {
    const result = diffServices({}, {}, 'branch-a', 'branch-b');
    expect(result.leftLabel).toBe('branch-a');
    expect(result.rightLabel).toBe('branch-b');
  });

  it('sorts services alphabetically', () => {
    const left = { zoo: makeService(), alpha: makeService() };
    const right = { zoo: makeService(), alpha: makeService() };
    const result = diffServices(left, right, 'a', 'b');
    expect(result.services.map((s) => s.serviceName)).toEqual(['alpha', 'zoo']);
  });
});
