import { createSourceFile, ScriptTarget } from 'typescript';
import { ParseResult } from '../../src/v2/parsed-nodes';
import { Visitor } from '../../src/v2/visitor';

/**
 * @description
 * creates a test fixture ParseResult from a provided typescript string
 * @param source the typescript source that should be visited
 */
export function getResult(source: string): ParseResult {
  const paths = new Map<string, string>();
  const sourceFile = createSourceFile(
    'test-case.ts',
    source,
    ScriptTarget.Latest,
    true,
  );

  // visit the created Source file with the typescript visitor
  // and walk down to every child node to create an abstract syntax tree of the
  // typescript file that is parsed as sourceFile.
  const visitor = new Visitor(paths, 'node_modules');
  return visitor.visitSourceFile(sourceFile);
}
