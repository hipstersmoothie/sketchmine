import * as ts from 'typescript';

/**
 * generates a map of names with values to be provided
 * @param modules array of modules
 * @example
 * ```typescript
const routes: Routes = [
  {path: 'button/button--primary', component: DtButtonVariantPrimaryComponent},
  {path: 'button/button--secondary', component: DtButtonVariantSecondaryComponent},
  {path: 'button/button--icon', component: ButtonIconComponent},
  ...
];
```
 *
 */
export function createRoutes(modules: string[]): ts.VariableStatement {
  const routes = modules.map((m: string) => {
    return ts.createObjectLiteral([
      ts.createPropertyAssignment('path', ts.createStringLiteral(m)),
      ts.createPropertyAssignment('component', ts.createIdentifier(m)),
    ]);
  });

  return ts.createVariableStatement(
    [ts.createModifier(ts.SyntaxKind.ExportKeyword)],
    ts.createVariableDeclarationList(
      [ts.createVariableDeclaration(
        ts.createIdentifier('routes'),
        ts.createTypeReferenceNode(ts.createIdentifier('Routes'), undefined),
        ts.createArrayLiteral(routes, true),
      )],
      2, /** 2 is const */
    ),
  );
}
