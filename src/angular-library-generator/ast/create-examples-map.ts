import * as ts from 'typescript';
import { basename } from 'path';

/**
 * generates a map of names with values to be provided
 * @param modules array of modules
 * @example
 * ```typescript
export const EXAMPLES = new Map<string, any>([
  ['button', IconOnlyButtonExampleComponent]
  ...
]);
```
 *
 */
export function createExamplesMap(moduleList: Map<string, string>): ts.VariableStatement {
  const examples: ts.ArrayLiteralExpression[] = [];
  moduleList.forEach((path: string, className: string) => {
    const name = basename(path, '.component');
    examples.push(ts.createArrayLiteral([
      ts.createStringLiteral(name),
      ts.createIdentifier(className),
    ]));
  });

  return ts.createVariableStatement(
    [ts.createModifier(ts.SyntaxKind.ExportKeyword)],
    ts.createVariableDeclarationList(
      [ts.createVariableDeclaration(
        ts.createIdentifier('EXAMPLES'),
        undefined,
        ts.createNew(
          ts.createIdentifier('Map'),
          [
            ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
            ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword),
          ],
          [ts.createArrayLiteral(examples, true)],
        ),
      )],
      2, /** 2 is const */
    ),
  );
}



// ts.createTypeReferenceNode(ts.createIdentifier('Routes'), undefined),
