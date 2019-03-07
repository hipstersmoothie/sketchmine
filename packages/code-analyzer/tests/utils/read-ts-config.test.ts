import { vol, fs as mockedFs } from 'memfs';
import { readTsConfig, READ_TSCONFIG_ERROR } from '../../src';

jest.mock('fs', () => mockedFs);

// reset the mocked volume after each test
afterEach(vol.reset.bind(vol));

describe('[code-analyzer] › utils › read ts config', () => {

  test('if tsconfig could not be found return null', async () => {
    const config = await readTsConfig('tsconfig.json');
    expect(config).toBeNull();
  });

  test('if config was provided read it and return values', async () => {
    vol.fromJSON({
      'tsconfig.json': `
        {
          "compilerOptions": {
            "declarationDir": "./lib/@types",
            "outDir": "./lib"
          },
          "include": [
            "./src"
          ]
        }`,
    });

    const config = await readTsConfig('tsconfig.json');

    expect(config).toMatchObject(
      expect.objectContaining({
        compilerOptions: {
          declarationDir: './lib/@types',
          outDir: './lib',
        },
        include: ['./src'],
      }),
    );
  });

  test('if config is not a valid JSON throw an error', async () => {
    vol.fromJSON({
      'tsconfig.json': '{a,}',
    });
    await expect(readTsConfig('tsconfig.json'))
      .rejects
      .toThrowError(READ_TSCONFIG_ERROR('tsconfig.json'));
  });
});
