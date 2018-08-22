
import path from 'path';
import fs from 'fs';
import * as ts from 'typescript';
import { tsVisitorFactory } from './visitor';
import { JSONVisitor, ParseResult, AstVisitor } from './ast';
import { adjustPathAliases, parseCommandlineArgs, resolveModuleFilename } from './utils';
import { ReferenceResolver } from './reference-resolver';
import { writeJSON } from '@utils';

function renderASTtoJSON(ast: Map<string, ParseResult>): any {
  const jsonVisitor = new JSONVisitor();
  const jsonResult = [];
  for (const result of ast.values()) {
    jsonResult.push(...result.visit(jsonVisitor));
  }
  return {
    version: '0.0.1',
    components: jsonResult,
  };
}

export async function main(args: string[]): Promise<number> {
  let parseResults = new Map<string, ParseResult>();
  // tslint:disable-next-line:prefer-const
  let { rootDir, inFile, outFile, config } = parseCommandlineArgs(args);
  const absoluteRootDir = path.resolve(rootDir);
  inFile = path.join(absoluteRootDir, inFile);

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

  await writeJSON(outFile, renderASTtoJSON(parseResults), true);

  // return exit code
  return Promise.resolve(0);
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
  main(args).then((code: number) => {
    process.exit(code);
  }).then((err) => {
    console.error(err);
    process.exit(1);
  });
}
