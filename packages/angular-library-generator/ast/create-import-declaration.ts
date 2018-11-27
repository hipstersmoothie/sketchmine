import * as ts from 'typescript';

/**
 * creates typescript import declaration
 * @param symbolName Name of the item that is imported
 * @param path path to the module
 * @param named default ture weather the import is a named import or not
 */
export function createImportDeclaration(
  symbolName: string[],
  path: string,
  named = true,
): ts.ImportDeclaration {
  const importSpecifiers = symbolName.map(n =>
    ts.createImportSpecifier(undefined, ts.createIdentifier(n)));

  let importClause: ts.ImportClause;

  if (named) {
    importClause = ts.createImportClause(undefined, ts.createNamedImports(importSpecifiers));
  } else {
    /** named imports can only have one export */
    importClause = ts.createImportClause(ts.createIdentifier(symbolName[0]), undefined);
  }

  return ts.createImportDeclaration(
    undefined, /** decorators */
    undefined, /** modifiers */
    importClause,
    ts.createLiteral(path),
  );
}
