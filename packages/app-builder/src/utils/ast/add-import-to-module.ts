import * as ts from 'typescript';
import { createImportDeclaration } from './create-import-declaration';

export function addImportToModule(sourceFile: ts.SourceFile, symbolNames: string[], modulePath: string): ts.SourceFile {
  const imports: ts.ImportDeclaration[] = [];
  const nodes: ts.Statement[] = [];

  // separate imports from the other nodes, imports have to stay on top
  sourceFile.statements.forEach((statement: ts.Statement) => {
    if (ts.isImportDeclaration(statement)) {
      imports.push(statement);
    } else {
      nodes.push(statement);
    }
  });

  return ts.updateSourceFileNode(sourceFile, [
    ...imports,
    createImportDeclaration(symbolNames,  modulePath),
    ...nodes,
  ]);
}
