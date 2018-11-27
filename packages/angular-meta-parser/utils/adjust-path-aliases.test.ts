import { adjustPathAliases, readTsConfig, READ_TSCONFIG_ERROR } from './adjust-path-aliases';
import { resolve } from 'path';

describe('[angular-meta-parser] › utils › adjusting path aliases from tsconfig', () => {
  let config;
  beforeEach(() => {
    config = {
      compilerOptions: {
        paths: {
          '@dynatrace/angular-components': ['src/lib'],
          '@dynatrace/angular-components/*': ['src/lib/*'],
          highcharts: ['node_modules/highcharts'],
        },
      },
    };
  });

  test('tsconfig parser to return null if no config is provided', async () => {
    const config = await readTsConfig('wrong/path/to.json');
    expect(config).toBeNull();
  });

  test('reading tsconfig throwing an error if it is not possible to parse the file as JSON', async () => {
    const file = resolve('tests/fixtures/more.svg');
    expect(readTsConfig(file)).rejects.toEqual(new Error(READ_TSCONFIG_ERROR(file)));
  });

  test('if we get a Map of only the two @dynatrace paths not from highcharts', () => {
    const paths = adjustPathAliases(config, '_tmp/');
    expect(paths).toBeInstanceOf(Object);
    expect(paths.size).toEqual(2);
  });

  test('if we still get a map of two entries without highcharts', () => {
    delete config.compilerOptions.paths.highcharts;
    const paths = adjustPathAliases(config, 'root/dir');
    expect(paths).toBeInstanceOf(Object);
    expect(paths.size).toEqual(2);
  });

  test('if the root path does not end with the path of the tsconfig it should be the key', () => {
    const paths = adjustPathAliases(config, '_tmp/');
    const values = Array.from(paths.values());
    const keys = Array.from(paths.keys());
    expect(keys).toHaveLength(2);
    expect(values).toEqual(keys);
  });

  test('the root equals the path in the tsconfig it should be resolved', () => {
    const paths = adjustPathAliases(config, 'src/lib');
    const values = Array.from(paths.values());
    const keys = Array.from(paths.keys());
    expect(values).toHaveLength(2);
    expect(keys).toHaveLength(2);
    expect(keys).toContain('@dynatrace/angular-components');
    expect(keys).toContain('@dynatrace/angular-components/*');
    expect(values).toContain('src/lib');
    expect(values).toContain('src/lib/*');
  });

  test('the root dir ends with the path in the tsconfig it should be resolved', () => {
    const paths = adjustPathAliases(config, '<root>/any/else/src/lib');
    const values = Array.from(paths.values());
    const keys = Array.from(paths.keys());
    expect(values).toHaveLength(2);
    expect(keys).toHaveLength(2);
    expect(keys).toContain('@dynatrace/angular-components');
    expect(keys).toContain('@dynatrace/angular-components/*');
    expect(values).toContain('<root>/any/else/src/lib');
    expect(values).toContain('<root>/any/else/src/lib/*');
  });
});
