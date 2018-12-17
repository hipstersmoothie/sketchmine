import * as ts from 'typescript';
import { Tree, SchematicsException, Rule } from '@angular-devkit/schematics';
import { Schema } from '../schema';
import {
  createExamplesMap,
  getNgModuleName,
  NgModuleProperties,
  registerExamplesModule,
  updateNgModuleDecoratorProperties,
} from '../../utils/ast';
import { join, basename } from 'path';

const EXAMPLES_MAP_VARIABLE_NAME = 'EXAMPLES_MAPPING';

// create a printer to print the ts.SourceFiles
const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

/**
 * Adds the examples registry to the examples module file that was provided as input in the config.
 * and import the examples module in the app.module and add it to the imports and register the map as provider
 * @param options Schema options
 * @param examplesPath Path to the examples directory
 */
export function addExamplesListToModule(
  options: Schema,
  examplesPath: string,
  appModule: string,
): Rule {
  return (tree: Tree) => {
    const moduleFile = join(examplesPath, options.examples.entry);

    if (!tree.exists(moduleFile)) {
      throw new SchematicsException(`Cannot find '${moduleFile}' as entry module!`);
    }

    const moduleSource = tree.read(moduleFile)!.toString('utf-8');
    const sourceFile = ts.createSourceFile(moduleFile, moduleSource, ts.ScriptTarget.Latest, true);

    const imports: ts.ImportDeclaration[] = [];
    const nodes: ts.Statement[] = [];

    // if a bootstrap property is in the NgModule remove it in case that our
    // app-builder module will bootstrap it!
    const removedBootstrap: ts.SourceFile = updateNgModuleDecoratorProperties(
      sourceFile,
      NgModuleProperties.Bootstrap,
      undefined,
    );

    // separate imports from the other nodes, imports have to stay on top
    removedBootstrap.statements.forEach((statement: ts.Statement) => {
      if (ts.isImportDeclaration(statement)) {
        imports.push(statement);
      } else {
        nodes.push(statement);
      }
    });

    // add examples map from the examples list in the config to the module file.
    const modified = ts.updateSourceFileNode(sourceFile, [
      ...imports,
      createExamplesMap(options.examples.list, EXAMPLES_MAP_VARIABLE_NAME),
      ...nodes,
    ]);

    const result = printer.printNode(ts.EmitHint.SourceFile, modified, modified);

    // update the examplesModule file with the updated
    // examples map
    const moduleRecorder = tree.beginUpdate(moduleFile);
    moduleRecorder.remove(0, moduleSource.length);
    moduleRecorder.insertLeft(0, result);
    tree.commitUpdate(moduleRecorder);

    // Now it is time to update the app.module file to import the created examples map
    // and import the examples module and provide the examples map in the ngModule
    if (!tree.exists(appModule)) {
      throw new SchematicsException(`Cannot find '${appModule}'!`);
    }
    const appModuleSource = tree.read(appModule)!.toString('utf-8');
    const appModuleSourceFile = ts.createSourceFile(appModule, appModuleSource, ts.ScriptTarget.Latest, true);

    const updatedAppModule = registerExamplesModule(
      appModuleSourceFile,
      getNgModuleName(sourceFile),
      `./examples/${basename(moduleFile, '.ts')}`,
      EXAMPLES_MAP_VARIABLE_NAME,
    );

    const appModuleResult = printer.printNode(ts.EmitHint.SourceFile, updatedAppModule, updatedAppModule);
    const appModuleRecorder = tree.beginUpdate(appModule);
    appModuleRecorder.remove(0, appModuleSource.length);
    appModuleRecorder.insertLeft(0, appModuleResult);
    tree.commitUpdate(appModuleRecorder);
  };
}
