
import * as path from 'path';
import * as fs from 'fs';
import * as ts from 'typescript';
import { tsVisitorFactory } from './visitor';
import { JSONVisitor, ParseResult, AstVisitor } from './ast';
import { adjustPathAliases, parseCommandlineArgs, resolveModuleFilename } from './utils';
import { ReferenceResolver } from './reference-resolver';
import { writeJSON } from '@utils';
import { ValuesResolver } from './values-resolver';

const DEFAULT_CONFIG = require('./config.json');

/**
 * Uses the transformed AST and represent it in our final JSON format
 * @param {Map<string, ParseResult>} ast Abstract Syntax Tree that was generated from the components and transformed
 * @param {string} pkg path to the package.json from the angular components
 */
function renderASTtoJSON(ast: Map<string, ParseResult>, pkg: string): any {
  const jsonVisitor = new JSONVisitor();
  const jsonResult = [];
  const pkgJSON = require(pkg);
  for (const result of ast.values()) {
    jsonResult.push(...result.visit(jsonVisitor));
  }
  return {
    version: pkgJSON.version,
    components: jsonResult,
  };
}

/**
 * The Main function that takes command line args build the AST and transforms the AST,
 * generate a JSON representation from it and write it to the outFile.
 * @param {string[]} args Array of command line args
 * @returns {Promise<number>} returns a promise with the exit code
 */
export async function main(args: string[]): Promise<number> {
  let parseResults = new Map<string, ParseResult>();
  // tslint:disable-next-line:prefer-const
  let { rootDir, inFile, outFile, config, pkg } = parseCommandlineArgs(args, DEFAULT_CONFIG);
  const absoluteRootDir = path.resolve(rootDir);
  inFile = path.join(absoluteRootDir, inFile);
  pkg = path.resolve(pkg);

  parseFile(inFile, adjustPathAliases(config, absoluteRootDir), parseResults);

  const results = Array.from(parseResults.values());

  /** list of transformers that got applied on the AST */
  const transformers: AstVisitor[] = [
    new ReferenceResolver(results),
    new ValuesResolver(),
  ];
  /** applies the transformers on the AST */
  for (const transfomer of transformers) {
    const transformedResults = new Map<string, ParseResult>();
    parseResults.forEach((result, fileName) => {
      transformedResults.set(fileName, result.visit(transfomer));
    });
    parseResults = transformedResults;
  }

  /** write the JSON structure to the outFile */
  await writeJSON(outFile, renderASTtoJSON(parseResults, pkg), true);

  // return exit code
  return Promise.resolve(0);
}

/**
 * parses all the files in the file system and visits them with our visitor to generate the AST.
 * @param fileName inFile where to start building the AST, should be the index.ts from the components library
 * @param paths a Map with the adjusted path aliases.
 * @param result The Object that holds the AST
 */
function parseFile(fileName: string, paths: Map<string, string>, result: Map<string, ParseResult>) {
  const resolvedFileName = resolveModuleFilename(fileName);
  if (!resolvedFileName) {
    return;
  }
  let parseResult = result.get(resolvedFileName);
  /** If the file was not parsed we have to parse it */
  if (!parseResult) {
    const source = fs.readFileSync(resolvedFileName, { encoding: 'utf8' }).toString();
    const sourceFile = ts.createSourceFile(
      resolvedFileName,
      source,
      ts.ScriptTarget.Latest,
      true,
    );

    /** visit the created Source file with our typescript ast visitor */
    const visitor = tsVisitorFactory(paths);
    parseResult = visitor(sourceFile);
    result.set(resolvedFileName, parseResult);

    /** parse all dependencies from the file */
    parseResult.dependencyPaths.forEach((depPath) => {
      parseFile(depPath.path, paths, result);
    });
  }
}

/** Call the main function with command line args */
if (require.main === module) {
  const args = process.argv.slice(2);
  main(args).then((code: number) => {
    process.exit(code);
  }).then((err) => {
    console.error(err);
    process.exit(1);
  });
}
