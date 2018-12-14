import * as ts from 'typescript';

/**
 * generates a map of names with values to be provided
 * @param {[key: string]: string} examplesList list of example mapping the right demo component
 * @param {string} name default EXAMPLES, the name of the generated variable that holds the Map
 * @returns {ts.VariableStatement} The AST of the examples Map
 * @example generates:
 * ```typescript
export const EXAMPLES = new Map<string, any>([
  ['button', IconOnlyButtonExampleComponent]
  ...
]);
```
 *
 */
export function createExamplesMap(
  examplesList: { [key: string]: string },
  name = 'EXAMPLES',
): ts.VariableStatement {
  const examples: ts.ArrayLiteralExpression[] = [];

  for (const component in examplesList) {
    if (examplesList.hasOwnProperty(component)) {
      const example = examplesList[component];
      examples.push(ts.createArrayLiteral([
        ts.createStringLiteral(component),
        ts.createIdentifier(example),
      ]));
    }
  }

  return ts.createVariableStatement(
    [ts.createModifier(ts.SyntaxKind.ExportKeyword)],
    ts.createVariableDeclarationList(
      [ts.createVariableDeclaration(
        ts.createIdentifier(name),
        undefined, // Does not need to be typed because map get the typings.
        ts.createNew(
          ts.createIdentifier('Map'),
          [
            ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
            ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword),
          ],
          [ts.createArrayLiteral(examples, true)],
        ),
      )],
      ts.NodeFlags.Const, // for const variable
    ),
  );
}
