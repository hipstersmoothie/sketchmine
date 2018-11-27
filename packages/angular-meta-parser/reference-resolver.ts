import { TreeVisitor, AstVisitor, ParseResult, ParseReferenceType, ParseDefinition, ParseEmpty } from './ast';

/**
 * @class
 * @classdesc tansformer that resolves the references in the AST
 * @implements AstVisitor
 * @extends TreeVisitor
 */
export class ReferenceResolver extends TreeVisitor implements AstVisitor {

  constructor(private _parseResults: ParseResult[]) {
    super();
  }

  /**
   * Overwrites the visitReferenceType method from the TreeVisitor to resolve the types
   * if it could not be resolved return the ParseEmpty() node.
   * @param {ParseReferenceType} node Reference node that should be resolved
   * @returns {ParseDefinition | ParseEmpty}
   */
  visitReferenceType(node: ParseReferenceType): ParseDefinition | ParseEmpty {
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
