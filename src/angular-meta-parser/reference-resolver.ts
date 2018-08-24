import { TreeVisitor, AstVisitor, ParseResult, ParseReferenceType, ParseDefinition, ParseEmpty } from './ast';

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
    return resolvedNode || new ParseEmpty();
  }
}
