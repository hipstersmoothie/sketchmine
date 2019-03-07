import { parseAbsoluteModulePath } from '../../src';
import { join } from 'path';

describe('[code-analyzer] › utils › parse absolute module paths', () => {
  const map = new Map<string, string>();
  const iconPack = '@dynatrace/dt-iconpack';
  const nodeModules = 'node_modules';

  beforeEach(() => map.clear());

  test('path from dynatrace icons should be resolved to the typings file.', () => {
    const path = parseAbsoluteModulePath('index.ts', iconPack, map, nodeModules);
    expect(path).toBe(join(process.cwd(), nodeModules, iconPack, 'index.d'));
  });

  test('should return null for any node_module that is not in the paths', () => {
    const path = parseAbsoluteModulePath('index.ts', 'highcharts', map, 'node-modules');
    expect(path).toBeNull();
  })
});
