import * as ts from 'typescript';

const SEPERATOR = '---';

export function printAllChildren(node: ts.Node, depth = 0) {
  let d = depth;
  console.log(Array(depth + 1).join(SEPERATOR), ts.SyntaxKind[node.kind], node.pos, node.end);
  d += 1;
  node.getChildren()
    .forEach(c => printAllChildren(c, d));
}
