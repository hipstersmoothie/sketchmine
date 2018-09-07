import * as ts from 'typescript';
import { getSymbolName } from '@angular-meta-parser/utils';

/**
 * Find all nodes from the AST in the subtree of node of SyntaxKind kind.
 * @param node
 * @param kind
 * @param maximum The maximum number of items to return.
 * @return all nodes of kind, or [] if none is found
 */
export function findNode(node: ts.Node, kind: ts.SyntaxKind): ts.Node {
  if (node.kind === kind) {
    return node;
  }
  let match = null;
  if (node.kind === ts.SyntaxKind.SourceFile) {
    for (const child of (node as ts.SourceFile).statements) {
      match = findNode(child, kind);
      if (match !== null) {
        break;
      }
    }
  } else {
    for (const child of node.getChildren()) {
      match = findNode(child, kind);
      if (match !== null) {
        break;
      }
    }
  }
  return match;
}
