import { ParseNode } from './parse-node';
import { ParseLocation } from './parse-location';
import { AstVisitor } from './json-visitor';

export class ParseResult extends ParseNode {
  constructor(
    location: ParseLocation,
    public nodes: ParseNode[],
    public dependencyPaths: Set<string>,
  ) {
    super(location);
  }

  visit(visitor: AstVisitor): any {
    return visitor.visitResult(this);
  }
}
