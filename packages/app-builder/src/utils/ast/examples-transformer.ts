import * as ts from 'typescript';
import { getSymbolName } from '@sketchmine/code-analyzer';

export function examplesTransformer(context: ts.TransformationContext) {
  return (rootNode: ts.Node) => {
    const varName = ts.createUniqueName('safe');
    context.hoistVariableDeclaration(varName);

    // rosotNode.
    // function visit(node: ts.Node) {

    //   // /** remove originalClassName Decorator */
    //   // if (ts.isDecorator(node)) {
    //   //   const expr = node.expression as ts.CallExpression;
    //   //   if (expr && expr.expression) {
    //   //     if (getSymbolName(expr.expression) === 'OriginalClassName') {
    //   //       return undefined;
    //   //     }
    //   //   }
    //   // }
    //   // return ts.visitEachChild(node, visit, context);
    // }
    // return ts.visitNode(rootNode, visit);
    return rootNode;
  };
}
