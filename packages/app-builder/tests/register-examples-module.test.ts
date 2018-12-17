import * as ts from 'typescript';
import { resolve } from 'path';
import { readFile } from '@sketchmine/node-helpers';
import { registerExamplesModule } from '../src/utils/ast';

const EXAMPLE_FILE = resolve('tests/fixtures/examples-folder/example-module.ts');
const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

describe('[app-builder] › utils › generate examples module', () => {

  let sourceFile: ts.SourceFile;
  let result: ts.SourceFile;

  beforeAll(async () => {
    const source = await readFile(EXAMPLE_FILE);
    sourceFile = ts.createSourceFile(EXAMPLE_FILE, source, ts.ScriptTarget.Latest, true);
  });

  beforeEach(() => {
    result = registerExamplesModule(
      sourceFile,
      'AppModule',
      '<rootdir>/testpath/any/app-module.ts',
      'MAP_NAME',
    );
  });

  test('if modified module is a ts.SourceFile', () => {
    expect(result).toHaveProperty('kind');
    expect(result.kind).toEqual(ts.SyntaxKind.SourceFile);
  });

  test('to contain the import and the updated providers', () => {
    const printed = printer.printNode(ts.EmitHint.SourceFile, result, result);

    expect(printed).toMatch('import { AppModule, MAP_NAME } from "<rootdir>/testpath/any/app-module.ts";');
    expect(printed).toMatch('providers: { provide: EXAMPLES_MAP, useValue: MAP_NAME }');
    expect(printed).toMatch(/imports: \[[\n\s\S.]+?AppModule/gm);
  });

});
