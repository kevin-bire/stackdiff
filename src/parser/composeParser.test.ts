import { parseComposeString, getServiceNames, ParsedCompose } from './composeParser';

const VALID_COMPOSE = `
version: '3.8'
services:
  web:
    image: nginx:latest
    ports:
      - '80:80'
  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: secret
    volumes:
      - db_data:/var/lib/postgresql/data
volumes:
  db_data:
`;

const NO_SERVICES_COMPOSE = `
version: '3.8'
networks:
  default:
`;

const INVALID_YAML = `this: is: not: valid: yaml:`;

describe('parseComposeString', () => {
  it('parses a valid docker-compose YAML string', () => {
    const result = parseComposeString(VALID_COMPOSE);
    expect(result.content.services).toBeDefined();
    expect(result.content.services['web']).toBeDefined();
    expect(result.content.services['db']).toBeDefined();
  });

  it('stores the provided label as filePath', () => {
    const result = parseComposeString(VALID_COMPOSE, 'my-label');
    expect(result.filePath).toBe('my-label');
  });

  it('defaults filePath to <inline> when no label given', () => {
    const result = parseComposeString(VALID_COMPOSE);
    expect(result.filePath).toBe('<inline>');
  });

  it('throws when services key is missing', () => {
    expect(() => parseComposeString(NO_SERVICES_COMPOSE)).toThrow(
      "No 'services' key found"
    );
  });

  it('throws on invalid YAML', () => {
    expect(() => parseComposeString(INVALID_YAML)).toThrow();
  });

  it('throws on empty content', () => {
    expect(() => parseComposeString('')).toThrow();
  });
});

describe('getServiceNames', () => {
  let parsed: ParsedCompose;

  beforeEach(() => {
    parsed = parseComposeString(VALID_COMPOSE);
  });

  it('returns all service names', () => {
    const names = getServiceNames(parsed);
    expect(names).toEqual(expect.arrayContaining(['web', 'db']));
    expect(names).toHaveLength(2);
  });

  it('returns an empty array when no services defined', () => {
    const empty = parseComposeString(`\nservices: {}\n`);
    expect(getServiceNames(empty)).toEqual([]);
  });
});
