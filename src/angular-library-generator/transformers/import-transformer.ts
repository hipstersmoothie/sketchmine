import * as ts from 'typescript';
import { getSymbolName } from '@angular-meta-parser/utils';

export function importTransformer(context: ts.TransformationContext) {
  return (rootNode: ts.Node) => {
    function visit(node: ts.Node): ts.Node {

      /** remove import of originalClassName decorator */
      if (ts.isImportDeclaration(node)) {
        const i = node.importClause as any;
        if (
          i &&
          i.namedBindings &&
          i.namedBindings.elements.length &&
          (i.namedBindings.elements as ts.ImportSpecifier[])
            .some(symbolName => getSymbolName(symbolName) === 'OriginalClassName')
        ) {
          // console.log(node.parent.statements)
          // delete node;
          return undefined;
        }
      }
      return ts.visitEachChild(node, visit, context);
    }
    return ts.visitNode(rootNode, visit);
  };
}
