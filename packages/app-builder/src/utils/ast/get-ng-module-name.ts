import * as ts from 'typescript';
import { findNodes } from './find-nodes';
import { getSymbolName, hasExportModifier } from '@sketchmine/code-analyzer';
import { SchematicsException } from '@angular-devkit/schematics';

// tslint:disable-next-line:max-line-length
export const NO_MODULE_ERROR = (filename: string) => `The provided entry Module file from the configuration has no exported @NgModule!\n${filename}`;

/**
 * Returns the @NgModule name of the provided typescript source file.
 * @param {ts.SourceFile} sourceFile Typescript source File of the entry module that was provided in the config
 * @returns {string} Module name
 */
export function getNgModuleName(sourceFile: ts.SourceFile): string {

  const decorator = findNodes(sourceFile, ts.SyntaxKind.Decorator, 1)[0] as ts.Decorator;
  if (
    ts.isCallExpression(decorator.expression) &&
    ts.isIdentifier(decorator.expression.expression) &&
    decorator.expression.expression.text === 'NgModule'
  ) {
    const classDec = decorator.parent as ts.ClassDeclaration;

    // only if the module is exported return the name otherwise throw an error!
    if (hasExportModifier(classDec)) {
      return getSymbolName(decorator.parent);
    }

  }
  // if there is no NgModule that is exported throw an error.
  throw new SchematicsException(NO_MODULE_ERROR(sourceFile.fileName));
}
