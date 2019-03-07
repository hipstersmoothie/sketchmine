import { ParseExpression, ParseReferenceType, ParseResult, ParseDefinition } from '../parsed-nodes';
import { flatten } from 'lodash';

/**
 * @description
 * @todo major: UX-9196 – lukas.holzer@dynatrace.com
 * Delivers the module file path for a named import specifier in a file.
 * for example `import { a } from 'b.ts'` would return `b.ts` if you pass a.
 * If the import specifier set has a length of zero we know everything is exported
 * or imported so we will return the path as well
 */
function getModuleNameForImportSpecifier(referenceName: string, result: ParseResult): string[] | undefined {
  const paths: string[] = [];

  for (let i = 0, max = result.dependencyPaths.length; i < max; i += 1) {
    const dependency = result.dependencyPaths[i];
    // if the dependencies value has a size of 0 then it is an export specifier with a star.
    // that means if it was specified but with a length of 0 we export everything so return the path in
    // in this condition.
    if (dependency.values.has(referenceName) || dependency.values.size === 0) {
      paths.push(dependency.path);
    }
  }

  return paths;
}

/**
 * @description
 * @todo major: UX-9196 – lukas.holzer@dynatrace.com
 * This method is used to gather an expression or declaration for the matching *referenced node*
 * So this function will look at first for the root nodes in the current file if there is a declaration or
 * method that matches the name and if there is no it will take a look at the imports if an import was found with
 * this name in the specifiers array it will check the root nodes again with a recursive call until a node was found
 * or no import specifiers are there anymore.
 * @param referencedNode The reference node where the matching declaration has to be searched.
 * @param parsedResults All parsed pages where we have to find the declaration
 * @param currentFilePath the file name (used as index for the results) for the current file
 */
export function getReferencedDeclarations(
  referencedNode: ParseExpression | ParseReferenceType,
  parsedResults: Map<string, ParseResult>,
  currentFilePath: string,
): ParseDefinition[] {

  const results = flatten(Array.from(parsedResults.values()).map(r => r.nodes));
  const found = [];
  for (let i = 0, max = results.length; i < max; i += 1) {
    if (results[i].name === referencedNode.name) {
      found.push(results[i]);
    }
  }
  return found;

  // TODO: major: UX-9196 – lukas.holzer@dynatrace.com
  // if (!currentFilePath) {
  //   return [];
  // }

  // // get the result of the current file
  // const currentFile = parsedResults.get(currentFilePath);

  // if (!currentFile) {
  //   return [];
  // }

  // console.log('Visiting File: ', currentFilePath)

  // // check the root nodes for the node with the same name
  // const rootNodes = currentFile.nodes
  //   .filter((node: ParseDefinition) => node.name === referencedNode.name);

  // if (rootNodes.length) {
  //   return rootNodes;
  // }

  // const modulePaths = getModuleNameForImportSpecifier(referencedNode.name, currentFile);
  // const definitions: any[] = [];

  // // if the module path is undefined we cannot resolve the reference so return undefined
  // if (!modulePaths.length) {
  //   return [];
  // }

  // for (let i = 0, max = modulePaths.length; i < max; i += 1) {
  //   const modulePath = modulePaths[i];
  //   // resolve the module path to a file on the disk
  //   const resolvedModulePath = resolveModuleFilename(modulePath);
  //   const declarations = getReferencedDeclarations(referencedNode, parsedResults, resolvedModulePath)
  //   // console.log(resolvedModulePath)

  //   // recursive call to go through all the files to gather the imported declaration
  //   definitions.push(...declarations);
  // }

  // return definitions;
}
