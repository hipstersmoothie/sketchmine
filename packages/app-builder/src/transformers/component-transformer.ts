import * as ts from 'typescript';
import { getSymbolName } from '@sketchmine/code-analyzer';

export function componentTransformer(context: ts.TransformationContext) {
  return (rootNode: ts.Node) => {
    function visit(node: ts.Node): ts.Node {

      /** remove originalClassName Decorator */
      if (ts.isDecorator(node)) {
        const expr = node.expression as ts.CallExpression;
        if (expr && expr.expression) {
          if (getSymbolName(expr.expression) === 'OriginalClassName') {
            return undefined;
          }
        }
      }
      return ts.visitEachChild(node, visit, context);
    }
    return ts.visitNode(rootNode, visit);
  };
}
