import { TreeVisitor, AstVisitor, ParseResult, ParseReferenceType, ParseDefinition } from './ast';

export class ReferenceResolver extends TreeVisitor implements AstVisitor {

  constructor(private _parseResults: ParseResult[]) {
    super();
  }

  visitReferenceType(node: ParseReferenceType) {
    let resolvedNode: ParseDefinition;
    for (const result of this._parseResults) {
      resolvedNode =
        result.nodes.find((resultRootNode: ParseDefinition) => resultRootNode.name === node.name) as ParseDefinition;
      if (resolvedNode) {
        break;
      }
    }
    return resolvedNode || null;
  }
}

// class ImplementsResolver extends TreeVisitor implements AstVisitor {

//   constructor(private _parseResults: ParseResult[]) {
//     super();
//   }

//   visitComponent(node: ParseComponent) {

//     node.heritageClauses.implements.forEach((impl: ParseReferenceType) => {
//       if (!impl) {
//         continue;
//       }
//       let resolvedNode: ParseInterface;
//       for (const result of this._parseResults) {
//         resolvedNode =
//           result.nodes.find((resultRootNode: ParseInterface) =>
//              resultRootNode.name === impl.name) as ParseInterface;
//         if (resolvedNode) {
//           break;
//         }
//       }

//       if (resolvedNode) {
//         node.members.push(...resolvedNode.members);
//       }
//     });
//     return node;
//   }
// }
