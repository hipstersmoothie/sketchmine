import * as ts from 'typescript';
import { Tree } from '@angular-devkit/schematics';
import { Schema } from '../angular-app-shell/schema';
import { findNode } from './ast';


export function modifyModule(tree: Tree, options: Schema) {

  if (!tree.exists(options.examples.entry)) {
    throw new Error(`Cannot find '${options.examples.entry}' as entry module!`);
  }

  const moduleSource = tree.read(options.examples.entry)!.toString('utf-8');
  const sourceFile = ts.createSourceFile(
    options.examples.entry,
    moduleSource,
    ts.ScriptTarget.Latest,
    true,
  );

  const decorater = findNode(sourceFile, ts.SyntaxKind.Decorator) as ts.Decorator;

  // if the decorater is a NgModule Decorator.
  if (
    ts.isCallExpression(decorater.expression) &&
    ts.isIdentifier(decorater.expression.expression) &&
    decorater.expression.expression.text === 'NgModule'
  ) {
    decorater.expression.arguments.forEach((obj: ts.ObjectLiteralExpression) => {
      obj.properties.forEach((prop: ts.PropertyAssignment) => {

        // get the declarations property in the NgModule Decorater
        if (
          ts.isIdentifier(prop.name) &&
          prop.name.text === 'declarations' &&
          ts.isArrayLiteralExpression(prop.initializer)
        ) {
          const elements = prop.initializer.elements;
          // filter all the identifier out of the declarations, can be a spread operator as well with a reference
          // to the array.
          const declarations = elements.filter(el => ts.isIdentifier(el));
        }
      });
    });
  }
}
