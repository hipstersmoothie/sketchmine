import * as ts from 'typescript';
import { AMP } from '@angular-meta-parser/meta-information';
import { componentTransformer, importTransformer } from './transformers';

export function generateExample(source: string, component: AMP.Component): ts.SourceFile {
  const sourceFile = ts.createSourceFile(
    `./examples/${component.component}.component.ts`,
    source,
    ts.ScriptTarget.Latest,
    true,
  );
  const transformedResult = ts.transform(
    sourceFile,
    [componentTransformer, importTransformer],
  ) as ts.TransformationResult<ts.SourceFile>;

  return transformedResult.transformed[0];
}
