import { vol, fs as mockedFs } from 'memfs';
jest.mock('fs', () => mockedFs);

import { parseFile, ParseResult, adjustPathAliases } from '../src';
import { resolve } from 'path';

let fileTree: { [key: string]: string };
let paths: Map<string, string>;
let result: Map<string, ParseResult>;

const config = {
  compilerOptions: {
    paths: {
      '@dynatrace/angular-components': ['src/lib'],
      '@dynatrace/angular-components/*': ['src/lib/*'],
    },
  },
};

// reset the mocked volume after each test
afterEach(vol.reset.bind(vol));

beforeEach(() => {
  // reset the results map and the paths map
  paths = new Map<string, string>();
  result = new Map<string, ParseResult>();
  fileTree = {
    'src/lib/button/button.ts': 'import {MixinDisabled} from "../core"; export class Button extends MixinDisabled {}',
    'src/lib/button/index.ts': 'export * from "./button"',
    'src/lib/index.ts': 'export * from "./button"',
    'src/lib/core/index.ts': 'export * from "./mixin-disabled"',
    'src/lib/core/mixin-disabled.ts': 'export class MixinDisabled { disabled: boolean; }',
  };
});

describe('[code-analyzer] › parse files with dependency tree', () => {

  test('when we pass the entry point every file should be parsed', async () => {
    vol.fromJSON(fileTree);
    await parseFile('src/lib/index.ts', paths, result, 'node_modules');
    expect(result.size).toBe(5);
    expect(result.get('src/lib/button/index.ts').dependencyPaths).toHaveLength(1);
    expect(result.get('src/lib/button/button.ts').nodes).toHaveLength(1);
    expect(result.get('src/lib/button/button.ts').dependencyPaths).toHaveLength(1);
    expect(result.get('src/lib/core/mixin-disabled.ts').nodes).toHaveLength(1);
    expect(result.get('src/lib/core/mixin-disabled.ts').dependencyPaths).toHaveLength(0);
  });

  test('if the was already parsed skip this file and parse the other files', async () => {
    vol.fromJSON(fileTree);
    await parseFile('src/lib/button/button.ts', paths, result, 'node_modules');
    await parseFile('src/lib/index.ts', paths, result, 'node_modules');

    expect(result.size).toBe(5);
  });

  test('if a file path could not be parsed it should log an error and skip this file', async () => {
    fileTree['src/lib/core/index.ts'] = 'export * from "./wrong-path"';
    vol.fromJSON(fileTree);

    const logging = jest.spyOn(console, 'log');

    expect(logging).toHaveBeenCalledTimes(0);
    await parseFile('src/lib/index.ts', paths, result, 'node_modules');
    expect(logging).toHaveBeenCalledTimes(1);
    expect(result.size).toBe(4);
  });

  test('collecting a file from a path alias without the paths should fail', async () => {
    fileTree['src/lib/button/button.ts'] =
      'import {MixinDisabled} from "@dynatrace/angular-components/core"; export class Button extends MixinDisabled {}';
    vol.fromJSON(fileTree);
    await parseFile('src/lib/index.ts', paths, result, 'node_modules');
    expect(result.size).toBe(3);
    expect(result.get('src/lib/index.ts')).toBeInstanceOf(ParseResult);
    expect(result.get('src/lib/button/index.ts')).toBeInstanceOf(ParseResult);
    expect(result.get('src/lib/button/button.ts')).toBeInstanceOf(ParseResult);
  });

  test('collecting a file from a path alias without the paths should fail', async () => {
    fileTree['src/lib/button/button.ts'] =
      'import {MixinDisabled} from "@dynatrace/angular-components/core"; export class Button extends MixinDisabled {}';

    paths = adjustPathAliases(config, 'src/lib');
    vol.fromJSON(fileTree);

    await parseFile('src/lib/index.ts', paths, result, 'node_modules');
    expect(result.size).toBe(5);
  });
});
