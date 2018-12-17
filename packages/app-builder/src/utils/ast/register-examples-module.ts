import * as ts from 'typescript';
import { updateNgModuleDecoratorProperties, NgModuleProperties } from './update-ng-module-decorator-properties';
import { addImportToModule } from './add-import-to-module';
import { createPropertyAssignment } from './create-property-assignment';

const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
const INJECTION_TOKEN_NAME = 'EXAMPLES_MAP';

/**
 * Adds the module name to the imports of the **NgMoudle** decorator.
 * imports the example module and register the provider in the NgModule
 * @param {ts.SourceFile} sourceFile Typescript source File of the module file where the module
 * should be added to the imports
 * @param {string} moduleName name of the module that should be added.
 * @param {string} modulePath path from where it should be imported
 * @param {string} mapName name of the map that gets exported from the examples module
 * @returns {ts.SourceFile}
 */
export function registerExamplesModule(
  sourceFile: ts.SourceFile,
  moduleName: string,
  modulePath: string,
  mapName: string,
): ts.SourceFile {

  // Somehow the modified source file has to be converted to text and back to sf (somehow a bug…)
  // TODO: label:investigation
  const modifiedImport: ts.SourceFile = addImportToModule(sourceFile, [moduleName, mapName], modulePath);
  const modInputText = printer.printNode(ts.EmitHint.SourceFile, modifiedImport, modifiedImport);
  const updatedSf = ts.createSourceFile(sourceFile.fileName, modInputText, ts.ScriptTarget.Latest, true);

  const updated: ts.SourceFile = updateNgModuleDecoratorProperties(
    updatedSf,
    NgModuleProperties.Imports,
    ts.createIdentifier(moduleName),
  );

  const updatedProvider: ts.SourceFile = updateNgModuleDecoratorProperties(
    updated,
    NgModuleProperties.Providers,
    ts.createObjectLiteral([
      createPropertyAssignment('provide',  ts.createIdentifier(INJECTION_TOKEN_NAME)),
      createPropertyAssignment('useValue', ts.createIdentifier(mapName)),
    ]),
  );

  return updatedProvider;
}
