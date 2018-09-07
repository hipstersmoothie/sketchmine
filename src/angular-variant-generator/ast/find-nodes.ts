import * as ts from 'typescript';

/**
 * Find all nodes from the AST in the subtree of node of SyntaxKind kind.
 * @param node
 * @param kind
 * @param maximum The maximum number of items to return.
 * @return all nodes of kind, or [] if none is found
 */
export function findNodes(node: ts.Node, kind: ts.SyntaxKind, maximum = Infinity): ts.Node[] {
  const arr: ts.Node[] = [];
  let max = maximum;

  if (!node || max === 0) {
    return arr;
  }

  if (node.kind === kind) {
    arr.push(node);
    max -= 1;
  }

  if (max > 0) {
    for (const child of node.getChildren()) {
      findNodes(child, kind, max).forEach((node) => {
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
