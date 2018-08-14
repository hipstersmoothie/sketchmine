
import path from 'path';
import fs from 'fs';
import * as ts from 'typescript';
import { tsVisitorFactory } from './visitor';
import chalk from 'chalk';
import {
  JSONVisitor,
  ParseComponent,
  ParseDefinition,
  ParseInterface,
  ParseNode,
  ParseResult,
  ParseProperty,
} from './ast';
import {
  Logger,
  adjustPathAliases,
  parseCommandlineArgs,
  resolveModuleFilename,
} from './utils';

const log = new Logger();

export class ImplementsResolver {

  private _interfaces: Set<ParseInterface | ParseComponent> = new Set();

  transform(ast: Map<string, ParseResult>): Map<string, ParseResult> {
    for (const result of ast.values()) {
      if (result.nodes) {
        result.nodes.forEach((node) => {
          if (node instanceof ParseInterface || node instanceof ParseComponent) {
            this._interfaces.add(node);
          }
        });
      }
    }

    for (const result of ast.values()) {
      this.visitAll(result.nodes);
    }
    return ast;
  }

  visit(node: ParseDefinition) {
    if (node instanceof ParseComponent && node.heritageClauses) {
      node.members.push(...this.extendMembers(node));
    }
  }

  extendMembers(node: ParseComponent): ParseProperty[] {
    const members: ParseProperty[] = [];
    node.heritageClauses.implements.forEach((impl: string) => {
      log.debug(
        chalk`Resolve implements: {bgBlue  ${impl} } @Component: {grey ${node.name}}`,
        'implements-resolver',
      );
      const match = [...this._interfaces]
        .filter((iface: ParseInterface | ParseComponent) => iface.name === impl);
      if (match.length) {
        members.push(...match[0].members);
      }
    });
    return members;
  }

  visitAll(nodes: ParseNode[])  {
    if (nodes && nodes.length) {
      nodes.forEach(node => this.visit(node as ParseDefinition));
    }
  }
}

export function main(args: string[]): number {
  let parseResults = new Map<string, ParseResult>();
  // tslint:disable-next-line:prefer-const
  let { rootDir, inFile, outFile, config } = parseCommandlineArgs(args);
  const absoluteRootDir = path.resolve(rootDir);
  inFile = path.join(absoluteRootDir, inFile);
  outFile = path.join(absoluteRootDir, outFile);

  parseFile(inFile, adjustPathAliases(config, absoluteRootDir), parseResults);

  parseResults = new ImplementsResolver().transform(parseResults);

  const jsonVisitor = new JSONVisitor();
  const jsonResult = [];
  for (const result of parseResults.values()) {
    jsonResult.push(...result.visit(jsonVisitor));
  }
  // console.dir(jsonResult);
  // console.log(JSON.stringify(jsonResult, null, 2));
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
