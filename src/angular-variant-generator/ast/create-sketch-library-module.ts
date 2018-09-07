import * as ts from 'typescript';
import { createPropertyAssignment } from './create-property-assignment';
import { createIdentifierArray } from './create-identifier-array';

/**
 * creates the NgModule for all the variants
 * @param declarations array of modules
 */
export function createSketchLibraryModule(declarations: string[], imports: string[]): ts.ClassDeclaration {
  const libraryImports = imports.map(i => ts.createIdentifier(i));
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
    ...libraryImports,
  ];
  const allImports = createPropertyAssignment('imports', ts.createArrayLiteral(angularImports, true));
  const allDeclarations = createPropertyAssignment(
    'declarations',
    createIdentifierArray(['AppComponent', ...declarations],
  ));
  const bootstrap = createPropertyAssignment('bootstrap', createIdentifierArray(['AppComponent'], false));

  const providers = createPropertyAssignment('providers', createIdentifierArray([]));

  return ts.createClassDeclaration(
    [ts.createDecorator(
      ts.createCall(
        ts.createIdentifier('NgModule'),
        undefined,
        [ts.createObjectLiteral(
          [
            allImports,
            allDeclarations,
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
