import { vol, fs as mockedFs } from 'memfs';
import { parseCommandlineArgs } from '../../src';
import { displayHelp } from '@sketchmine/node-helpers';

jest.mock('fs', () => mockedFs);
jest.mock('@sketchmine/node-helpers');

// reset the mocked volume after each test
afterEach(vol.reset.bind(vol));

describe('[code-analyzer] › utils › parse command line args', () => {

  test('if help is shown when no option is provided', () => {
    expect(displayHelp).toHaveBeenCalledTimes(0)
    const args = parseCommandlineArgs([]);
    expect(displayHelp).toHaveBeenCalledTimes(1);
  });

  test('if config was provided read it and return values', () => {
    vol.fromJSON({
      'config.json': `
        "rootDir": "/angular-components/",
        "library": "src/lib",
        "inFile": "index.ts",
        "outFile": "/shared/meta-information.json"`,
    });

    const args = parseCommandlineArgs(['--config=config.json']);

    expect(args).toMatchObject(
      expect.objectContaining({
        rootDir: expect.any(String),
        library: expect.any(String),
        inFile: expect.any(String),
        outFile: expect.any(String),
      }),
    );
  });

  test('passing rootDir argument via cli options', () => {
    const args = parseCommandlineArgs(['--rootDir=/angular-components']);
    expect(args).toMatchObject({
      rootDir: '/angular-components',
    });
  });

  test('passing library argument via cli options', () => {
    const args = parseCommandlineArgs(['--library=src/lib']);
    expect(args).toMatchObject({
      library: 'src/lib',
    });
  });

  test('passing inFile argument via cli options', () => {
    const args = parseCommandlineArgs(['--inFile=index.ts']);
    expect(args).toMatchObject({
      inFile: 'index.ts',
    });
  });

  test('passing outFile argument via cli options', () => {
    const args = parseCommandlineArgs(['--outFile=/shared/meta-information.json']);
    expect(args).toMatchObject({
      outFile: '/shared/meta-information.json',
    });
  });
});
