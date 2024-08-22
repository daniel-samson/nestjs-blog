import { Repository } from 'typeorm';

export function automock<T>(
  repository: new (...args: any[]) => T,
): Repository<T> {
  const mock: Partial<Record<keyof T, jest.Mock>> = {};
  Object.keys(repository.prototype).forEach((key) => {
    mock[key] = jest.fn();
  });
  return mock as Repository<T>;
}
