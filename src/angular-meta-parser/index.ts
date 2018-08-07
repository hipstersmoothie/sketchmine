import minimist from 'minimist';
import path from 'path';
import fs from 'fs';
import { readFile } from '@utils';
import * as ts from 'typescript';
import { tsVisitorFactory } from './visitor';
import chalk from 'chalk';
import { ParseDependency, ParseNode } from './ast';

const PATHS = new Map<string, string>([
  ['@dynatrace/angular-components/', 'fixtures/lib'],
  ['@dynatrace/angular-components/*', 'fixtures/lib/*'],
]);

const ast = new Map<string, ParseNode[]>();

export function main(args: string[]): number {
  // tslint:disable-next-line:prefer-const
  let { rootDir, inFile, outFile } = parseArgs(args);
  const absoluteRootDir = path.resolve(rootDir);
  inFile = path.join(absoluteRootDir, inFile);
  outFile = path.join(absoluteRootDir, outFile);

  const paths = adjustPaths(PATHS, absoluteRootDir);

  const result = parseFile(inFile, paths);
  console.log(ast);
  return 0;
}

function parseFile(fileName: string, paths: Map<string, string>): ParseNode[] {
  let parseResult = ast.get(fileName);
  // If the file was not parsed we have to parse it
  if (!parseResult) {
    const resolvedFileName = resolveFilename(fileName);
    const source = fs.readFileSync(resolvedFileName, { encoding: 'utf8' }).toString();
    const sourceFile = ts.createSourceFile(
      resolvedFileName,
      source,
      ts.ScriptTarget.Latest,
      true,
    );

    const visitor = tsVisitorFactory(paths, parseFile);
    parseResult = visitor(sourceFile);
    ast.set(resolvedFileName, parseResult);
  }
  return parseResult;
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
    console.error(chalk.redBright(`\n🚨 ${err}\n`));
    process.exit(1);
  }
}
