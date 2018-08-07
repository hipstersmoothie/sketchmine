import minimist from 'minimist';
import path from 'path';
import fs from 'fs';
import { readFile } from '@utils';
import * as ts from 'typescript';
import { tsVisitorFactory } from './visitor';
import chalk from 'chalk';
import { ParseDependency, ParseResult, JSONVisitor } from './ast';
const LOG = require('debug')('angular-meta-parser:index.ts');

const PATHS = new Map<string, string>([
  ['@dynatrace/angular-components/', 'fixtures/lib'],
  ['@dynatrace/angular-components/*', 'fixtures/lib/*'],
]);

export function main(args: string[]): number {
  const parseResults = new Map<string, ParseResult>();
  // tslint:disable-next-line:prefer-const
  let { rootDir, inFile, outFile } = parseArgs(args);
  const absoluteRootDir = path.resolve(rootDir);
  inFile = path.join(absoluteRootDir, inFile);
  outFile = path.join(absoluteRootDir, outFile);

  const paths = adjustPaths(PATHS, absoluteRootDir);

  parseFile(inFile, paths, parseResults);

  const jsonVisitor = new JSONVisitor();
  const jsonResult = [];
  for (const result of parseResults.values()) {
    jsonResult.push(...result.visit(jsonVisitor));
  }
  // console.dir(jsonResult);
  console.log(JSON.stringify(jsonResult, null, 2));
  return 0;
}

function parseFile(fileName: string, paths: Map<string, string>, result: Map<string, ParseResult>) {
  const resolvedFileName = resolveFilename(fileName);
  let parseResult = result.get(resolvedFileName);
  // If the file was not parsed we have to parse it
  if (!parseResult) {
    LOG(chalk`parse file: {grey ${resolvedFileName}}`);
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
      parseFile(depPath, paths, result);
    });
  }
}

function resolveFilename(fileName: string) {
  if (isFile(fileName)) { return fileName; }
  let resolved = `${fileName}.ts`;
  if (isFile(resolved)) { return resolved; }
  resolved = path.join(fileName, 'index.ts');
  if (isFile(resolved)) { return resolved; }
  throw new Error(`The specified filename: ${fileName} cannot be resolved!`);
}

function isFile(fileName: string): boolean {
  return fs.existsSync(fileName) && fs.lstatSync(fileName).isFile();
}

function adjustPaths(paths: Map<string, string>, rootDir: string): Map<string, string> {
  const adjustedPaths = new Map<string, string>();
  paths.forEach((p, g) => {
    const suffixes = [];
    let cleanPath = p;
    if (cleanPath.endsWith('*')) {
      cleanPath = cleanPath.slice(0, -1);
      suffixes.unshift('*');
    }
    if (cleanPath.endsWith('/')) {
      cleanPath = cleanPath.slice(0, -1);
      suffixes.unshift('/');
    }
    adjustedPaths.set(g, rootDir.endsWith(cleanPath) ? rootDir + suffixes.join('') : g);
  });
  return adjustedPaths;
}

function parseArgs(args: string[]): any {
  const parsedArgs = minimist(args);
  if (!parsedArgs.inFile) {
    throw new Error(chalk`You have to set the {grey --inFile=} option!`);
  }
  return parsedArgs;
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
