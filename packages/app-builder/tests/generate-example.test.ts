import * as ts from 'typescript';
import { generateExample } from '../src/generate-example';
import { join } from 'path';

const FILE = join(process.cwd(), 'tests', 'fixtures', 'button.pure.example.ts');

test('remove OriginalClassName decorator and input with transformers', () => {
  const transformed = generateExample(FILE, { component: 'button' } as any);
  const printed = printSourceFile(transformed);
  expect(ts.isSourceFile).toBeTruthy();
  expect(transformed.fileName).toMatch('examples/button.component.ts');
  expect(printed).not.toMatch(/OriginalClassName/gm);
});

function printSourceFile(file: ts.SourceFile): string {
  const resultFile = ts.createSourceFile(file.fileName, '', ts.ScriptTarget.Latest, false, ts.ScriptKind.TS);
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
  return printer.printNode(ts.EmitHint.Unspecified, file, resultFile);
}
