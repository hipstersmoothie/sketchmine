
import path from 'path';
import fs from 'fs';
import * as ts from 'typescript';
import { tsVisitorFactory } from './visitor';
import { JSONVisitor, ParseResult, AstVisitor } from './ast';
import { adjustPathAliases, parseCommandlineArgs, resolveModuleFilename } from './utils';
import { ReferenceResolver } from './reference-resolver';
const util = require('util')

function renderASTtoJSON(ast: Map<string, ParseResult>) {
  const jsonVisitor = new JSONVisitor();
  const jsonResult = [];
  for (const result of ast.values()) {
    jsonResult.push(...result.visit(jsonVisitor));
  }
  // console.dir(jsonResult);
  console.log(JSON.stringify(jsonResult, null, 2));
}



// alternative shortcut

export function main(args: string[]): number {
  let parseResults = new Map<string, ParseResult>();
  // tslint:disable-next-line:prefer-const
  let { rootDir, inFile, outFile, config } = parseCommandlineArgs(args);
  const absoluteRootDir = path.resolve(rootDir);
  inFile = path.join(absoluteRootDir, inFile);
  outFile = path.join(absoluteRootDir, outFile);

  parseFile(inFile, adjustPathAliases(config, absoluteRootDir), parseResults);

  const results = Array.from(parseResults.values());
  const transformers: AstVisitor[] = [
    new ReferenceResolver(results),
  ];
  for (const transfomer of transformers) {
    const transformedResults = new Map<string, ParseResult>();
    parseResults.forEach((result, fileName) => {
      transformedResults.set(fileName, result.visit(transfomer));
    });
    parseResults = transformedResults;
  }

  // console.log(util.inspect(parseResults, false, null))
  renderASTtoJSON(parseResults);

  // return exit code
  return 0;
}

function parseFile(fileName: string, paths: Map<string, string>, result: Map<string, ParseResult>) {
  const resolvedFileName = resolveModuleFilename(fileName);
  if (!resolvedFileName) {
    return;
  }
  let parseResult = result.get(resolvedFileName);
  // If the file was not parsed we have to parse it
  if (!parseResult) {
    // LOG(chalk`parse file: {grey ${resolvedFileName}}`);
    const source = fs.readFileSync(resolvedFileName, { encoding: 'utf8' }).toString();
    const sourceFile = ts.createSourceFile(
      resolvedFileName,
      source,
      ts.ScriptTarget.Latest,
      true,
    );

    const visitor = tsVisitorFactory(paths);
    parseResult = visitor(sourceFile);
    result.set(resolvedFileName, parseResult);

    parseResult.dependencyPaths.forEach((depPath) => {
      parseFile(depPath.path, paths, result);
    });
  }
}

if (require.main === module) {
  const args = process.argv.slice(2);
  try {
    const code = main(args);
    process.exit(code);

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
