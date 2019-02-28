import { vol, fs as mockedFs } from 'memfs';
jest.mock('fs', () => mockedFs);

import {
  resolveModuleFilename,
  RESOLVE_MODULE_FILENAME_ERROR,
} from '../../src';

// reset the mocked volume after each test
afterEach(vol.reset.bind(vol));

describe('[code-analyzer] › utils › resolve module filenames', () => {

  test('if the exact filename is provided and the file exists it should return the same string', () => {
    const modulePath = 'lib/src/button/button.ts';
    vol.fromJSON({ 'lib/src/button/button.ts': 'class Button {}' });

    const resolved = resolveModuleFilename(modulePath);
    expect(resolved).toBe(modulePath);
  });

  test('if the file does not exist it should throw an error', () => {
    const modulePath = 'lib/src/button/invalid-file.ts';
    expect(() => resolveModuleFilename(modulePath))
      .toThrowError(RESOLVE_MODULE_FILENAME_ERROR(modulePath));
  });

  test('if the provided path is a path to a file without file ending', () => {
    const modulePath = 'lib/src/button/button';
    vol.fromJSON({ 'lib/src/button/button.ts': 'class Button {}' });

    const resolved = resolveModuleFilename(modulePath);
    expect(resolved).toBe(`${modulePath}.ts`);
  });

  test('if the provided path is a path to a barrel file', () => {
    const modulePath = 'lib/src/button';
    vol.fromJSON({ 'lib/src/button/index.ts': 'class Button {}' });

    const resolved = resolveModuleFilename(modulePath);
    expect(resolved).toBe(`${modulePath}/index.ts`);
  });

});
