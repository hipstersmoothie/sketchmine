import * as ts from 'typescript';

/**
 * Find all nodes from the AST in the subtree of node of SyntaxKind kind.
 * @param node
 * @param kind
 * @param maxItems The maximum number of items to return.
 * @return all nodes of kind, or [] if none is found
 */
export function findNodes(node: ts.Node, kind: ts.SyntaxKind, maxItems = Infinity): ts.Node[] {
  let max = maxItems;

  if (!node || max === 0) {
    return [];
  }

  const arr: ts.Node[] = [];
  if (node.kind === kind) {
    arr.push(node);
    max -= 1;
  }
  if (max > 0) {
    for (const child of node.getChildren()) {
      findNodes(child, kind, max).forEach((node: ts.Node) => {
        if (max > 0) {
          arr.push(node);
        }
        max -= 1;
      });

      if (max <= 0) {
        break;
      }
    }
  }

  return arr;
}
