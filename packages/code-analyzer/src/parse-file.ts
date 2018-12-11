import { readFileSync } from 'fs';
import * as ts from 'typescript';
import { tsVisitorFactory } from './visitor';
import { ParseResult } from './ast';
import { resolveModuleFilename } from './utils';

/**
 * Get Initial the index barrel file then visit file -> build ast and cycle again over the imports.
 * parses all the files in the file system and visits them with our visitor to generate the AST.
 * @param fileName inFile where to start building the AST, should be the index.ts from the components library
 * @param paths a Map with the adjusted path aliases.
 * @param result The Object that holds the AST
 * @param modules path to the node_modules
 */
export function parseFile(
  fileName: string,
  paths: Map<string, string>,
  result: Map<string, ParseResult>,
  modules: string,
) {
  const resolvedFileName = resolveModuleFilename(fileName);
  if (!resolvedFileName) {
    return;
  }
  let parseResult = result.get(resolvedFileName);
  /** If the file was not parsed we have to parse it */
  if (!parseResult) {
    const source = readFileSync(resolvedFileName, { encoding: 'utf8' }).toString();
    const sourceFile = ts.createSourceFile(
      resolvedFileName,
      source,
      ts.ScriptTarget.Latest,
      true,
    );

    /** visit the created Source file with our typescript ast visitor */
    const visitor = tsVisitorFactory(paths, modules);
    parseResult = visitor(sourceFile);
    result.set(resolvedFileName, parseResult);

    /** parse all dependencies from the file */
    parseResult.dependencyPaths.forEach((depPath) => {
      parseFile(depPath.path, paths, result, modules);
    });
  }
}
