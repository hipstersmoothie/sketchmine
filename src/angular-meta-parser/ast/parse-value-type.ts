import { ParseNode } from './parse-node';
import { ParseLocation } from './parse-location';
import { AstVisitor } from './json-visitor';

export class ParseValueType extends ParseNode {
  constructor(location: ParseLocation, public value: string) {
    super(location);
  }
  visit(visitor: AstVisitor): any {
    return visitor.visitValueType(this);
  }
}
