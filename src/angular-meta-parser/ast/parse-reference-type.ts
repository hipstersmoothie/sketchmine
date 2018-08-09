import { ParseNode } from './parse-node';
import { ParseLocation } from './parse-location';
import { AstVisitor } from './json-visitor';

export class ParseReferenceType extends ParseNode {
  constructor(location: ParseLocation, public name: string) {
    super(location);
  }

  visit(visitor: AstVisitor): any {
    return visitor.visitReferenceType(this);
  }
}
