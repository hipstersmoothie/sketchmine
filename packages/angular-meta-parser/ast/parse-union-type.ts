import { ParseNode } from './parse-node';
import { ParseLocation } from './parse-location';
import { AstVisitor } from './ast-visitor';
import { ParseSimpleType } from './parse-type';

export class ParseUnionType extends ParseNode {

  constructor(location: ParseLocation, public types: ParseSimpleType[]) {
    super(location);
  }

  visit(visitor: AstVisitor): any {
    return visitor.visitUnionType(this);
  }
}
