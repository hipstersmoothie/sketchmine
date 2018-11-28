import * as ts from 'typescript';
import { Component as MetaComponent } from '@sketchmine/code-analyzer';
import { componentTransformer, importTransformer } from './transformers';
import { readFileSync } from 'fs';
import { dirname } from 'path';

export function generateExample(file: string, component: MetaComponent): ts.SourceFile {
  const source = readFileSync(file, { encoding: 'utf8' }).toString();
  const sourceFile = ts.createSourceFile(
    `./examples/${component.component}.component.ts`,
    source,
    ts.ScriptTarget.Latest,
    true,
  );
  const transformedResult = ts.transform(
    sourceFile,
    [componentTransformer, importTransformer],
    { refPath: dirname(file) },
  ) as ts.TransformationResult<ts.SourceFile>;

  return transformedResult.transformed[0];
}
