import * as ts from 'typescript';
import { getSymbolName, resolveModuleFilename } from '@angular-meta-parser/utils';
import { join, basename } from 'path';
import { readFileSync } from 'fs';
import { MemoryCompiler } from '../memory-compiler';

export function importTransformer(context: ts.TransformationContext) {
  const compilerOptions = context.getCompilerOptions();
  const compiler = new MemoryCompiler();
  return (rootNode: ts.SourceFile) => {
    function visit(node: ts.Node): ts.Node {

      /** remove import of originalClassName decorator */
      if (ts.isImportDeclaration(node)) {
        const i = node.importClause as any;
        const refPath = compilerOptions.refPath as string;
        const moduleSpecifier = getSymbolName(node.moduleSpecifier);

        /**
         * add imports that are important for the examples to the memory compiler
         * to be written afterwards to the filesystem in the new app.
         * update path to module in ast to match the destination path.
         */
        const file = visitMouleImport(moduleSpecifier, refPath);
        if (file) {
          const content = readFileSync(file as string).toString();
          const newPath = `./examples/${basename(file as string)}`;
          const requiredModule = ts.createSourceFile(newPath, content, ts.ScriptTarget.Latest);
          compiler.addDependency(requiredModule);
        }

        if (
          i &&
          i.namedBindings &&
          i.namedBindings.elements.length &&
          (i.namedBindings.elements as ts.ImportSpecifier[])
            .some(symbolName => getSymbolName(symbolName) === 'OriginalClassName')
        ) {
          return undefined;
        }
      }
      return ts.visitEachChild(node, visit, context);
    }
    return ts.visitNode(rootNode, visit);
  };
}

function visitMouleImport(modulePath: string, referencePath: string): boolean | string {
  if (
    modulePath.startsWith('@') ||
    modulePath.match(/\.\.\/core\/decorators/)
  ) {
    return false;
  }
  const file = join(referencePath, modulePath);
  return resolveModuleFilename(file);
}
