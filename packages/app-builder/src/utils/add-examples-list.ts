import * as ts from 'typescript';
import { Tree } from '@angular-devkit/schematics';
import { Schema } from '../angular-app-shell/schema';
import { examplesTransformer } from './ast/examples-transformer';

export function addExamplesList(tree: Tree, options: Schema) {

  if (!tree.exists(options.examples.entry)) {
    throw new Error(`Cannot find '${options.examples.entry}' as entry module!`);
  }

  const moduleSource = tree.read(options.examples.entry)!.toString('utf-8');
  const sourceFile = ts.createSourceFile(
    options.examples.entry,
    moduleSource,
    ts.ScriptTarget.Latest,
    true,
  );

  const transformedResult = ts.transform(
    sourceFile,
    [examplesTransformer],
    { refPath: '/__directory__/src/app/' },
  ) as ts.TransformationResult<ts.SourceFile>;

  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
  const resultFile = ts.createSourceFile('fielname.ts', '', ts.ScriptTarget.Latest, false, ts.ScriptKind.TS);
  const result = printer.printNode(ts.EmitHint.Unspecified, transformedResult.transformed[0], resultFile);
  console.log(result)
}
