import * as ts from 'typescript';

/**
 * Check if a jsDoc comment exist on node and returns the comment as string
 * @param {ts.Node} node Typescript AST node
 */
export function visitJsDoc(node: ts.Node): string | null {
  const jsDocComments: any[] = (node as any).jsDoc;
  if (!jsDocComments) {
    return null;
  }
  return jsDocComments
    .map(comment => comment.getFullText())
    .join('\n') as string;
}
