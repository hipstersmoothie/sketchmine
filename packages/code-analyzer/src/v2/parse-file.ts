import { readFile } from '@sketchmine/node-helpers';
import { asyncForEach } from '@sketchmine/helpers';
import * as ts from 'typescript';
import { Visitor } from './visitor';
import { ParseResult, ParseDependency } from './parsed-nodes';
import { resolveModuleFilename } from '../utils';

/**
 * Get Initial the index barrel file then visit file -> build ast and cycle again over the imports.
 * parses all the files in the file system and visits them with our visitor to generate the AST.
 * @param fileName inFile where to start building the AST, should be the index.ts from the components library
 * @param paths a Map with the adjusted path aliases.
 * @param result The Object that holds the AST
 * @param modules path to the node_modules
 */
export async function parseFile(
  fileName: string,
  paths: Map<string, string>,
  result: Map<string, ParseResult>,
  modules: string,
): Promise<void> {
  const resolvedFileName = resolveModuleFilename(fileName);

  // If the module file could not be resolved skip this import or export
  if (!resolvedFileName) {
    return;
  }

  let parseResult = result.get(resolvedFileName);

  // If the parseResult is not defined then the file was not parsed yet.
  // So we have to read the file and create a sourceFile out of the string
  // and parse this sourceFile to our parsed Abstract Syntax tree.
  if (!parseResult) {
    const source = await readFile(resolvedFileName);
    const sourceFile = ts.createSourceFile(
      resolvedFileName,
      source,
      ts.ScriptTarget.Latest,
      true,
    );

    // visit the created Source file with the typescript visitor
    // and walk down to every child node to create an abstract syntax tree of the
    // typescript file that is parsed as sourceFile.
    const visitor = new Visitor(paths, modules);
    parseResult = visitor.visitSourceFile(sourceFile);
    result.set(resolvedFileName, parseResult);

    // Check the dependency paths of the result and if the parsed file has
    // dependencies parse them as well
    if (parseResult.dependencyPaths && parseResult.dependencyPaths.length) {
      await asyncForEach(parseResult.dependencyPaths, async (dependency: ParseDependency) =>
        await parseFile(dependency.path, paths, result, modules));
    }
  }
}
