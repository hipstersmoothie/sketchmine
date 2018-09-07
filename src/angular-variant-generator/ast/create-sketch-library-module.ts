import * as ts from 'typescript';
import { createPropertyAssignment } from './create-property-assignment';
import { createIdentifierArray } from './create-identifier-array';

/**
 * creates the NgModule for all the variants
 * @param modules array of modules
 */
export function createSketchLibraryModule(modules: string[]): ts.ClassDeclaration {
  const angularImports = [
    ts.createIdentifier('BrowserModule'),
    ts.createIdentifier('HttpClientModule'),
    ts.createCall(
      ts.createPropertyAccess(ts.createIdentifier('DtIconModule'), ts.createIdentifier('forRoot')),
      undefined,
      [ts.createObjectLiteral([
        ts.createPropertyAssignment(
          ts.createIdentifier('svgIconLocation'),
          ts.createNoSubstitutionTemplateLiteral('/assets/icons/{{name}}.svg'),
        ),
      ])],
    ),
    ts.createCall(
      ts.createPropertyAccess(ts.createIdentifier('RouterModule'), ts.createIdentifier('forRoot')),
      undefined,
      [ts.createIdentifier('routes')],
    ),
  ];
  const imports = createPropertyAssignment('imports', ts.createArrayLiteral(angularImports, true));
  const declarations = createPropertyAssignment('declarations', createIdentifierArray(modules));
  const bootstrap = createPropertyAssignment('bootstrap', createIdentifierArray(['AppComponent'], false));

  const providers = createPropertyAssignment('providers', createIdentifierArray([]));

  return ts.createClassDeclaration(
    [ts.createDecorator(
      ts.createCall(
        ts.createIdentifier('NgModule'),
        undefined,
        [ts.createObjectLiteral(
          [
            imports,
            declarations,
            bootstrap,
            providers,
          ],
          true,
        )],
      ),
    )],
    [ts.createModifier(ts.SyntaxKind.ExportKeyword)],
    ts.createIdentifier('AppModule'),
    undefined,
    undefined,
    undefined,
  );
}
