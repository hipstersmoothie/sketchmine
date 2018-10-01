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
    ts.createIdentifier('BrowserAnimationsModule'),
    ts.createIdentifier('HttpClientModule'),
    ts.createIdentifier('PortalModule'),
    ts.createIdentifier('FormsModule'),
    ts.createIdentifier('ReactiveFormsModule'),
    ts.createCall(
      ts.createPropertyAccess(ts.createIdentifier('DtIconModule'), ts.createIdentifier('forRoot')),
      undefined,
      [ts.createObjectLiteral([
        createPropertyAssignment(
          'svgIconLocation',
          ts.createNoSubstitutionTemplateLiteral('/assets/icons/{{name}}.svg'),
        ),
      ])],
    ),
    ...libraryImports,
  ];
  const allImports = createPropertyAssignment('imports', ts.createArrayLiteral(angularImports, true));
  const allDeclarations = createPropertyAssignment(
    'declarations',
    createIdentifierArray(['AppComponent', 'DebugComponent', ...declarations],
  ));
  const bootstrap = createPropertyAssignment('bootstrap', createIdentifierArray(['AppComponent'], true));
  const provider = ts.createObjectLiteral([
    createPropertyAssignment('provide',  ts.createIdentifier('EXAMPLES_MAP')),
    createPropertyAssignment('useValue', ts.createIdentifier('EXAMPLES')),
  ]);
  const providers = createPropertyAssignment('providers', ts.createArrayLiteral([provider]));
  const entryComponents = ts.createPropertyAssignment(
    'entryComponents',
    createIdentifierArray([...declarations], true),
  );

  return ts.createClassDeclaration(
    [ts.createDecorator(
      ts.createCall(
        ts.createIdentifier('NgModule'),
        undefined,
        [ts.createObjectLiteral(
          [
            allDeclarations,
            allImports,
            providers,
            entryComponents,
            bootstrap,
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
