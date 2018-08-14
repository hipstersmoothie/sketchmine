import { ParseNode } from './parse-node';
import { ParseLocation } from './parse-location';
import { AstVisitor } from './ast-visitor';

export type Primitive = 'string' | 'number' | 'undefined' | 'null' | 'boolean' | 'symbol';

export class ParsePrimitiveType extends ParseNode {
  constructor(location: ParseLocation, public type: Primitive) {
    super(location);
  }
  visit(visitor: AstVisitor): any {
    return visitor.visitPrimitiveType(this);
  }
}
