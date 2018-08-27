import { ParseNode } from './parse-node';
import { ParseLocation } from './parse-location';
import { AstVisitor } from './ast-visitor';

export enum Primitives {
  String = 'string',
  Number = 'number',
  Undefined = 'undefined',
  Null = 'null',
  Boolean = 'boolean',
  Symbol = 'symbol',
}

export class ParsePrimitiveType extends ParseNode {
  constructor(location: ParseLocation, public type: Primitives) {
    super(location);
  }
  visit(visitor: AstVisitor): any {
    return visitor.visitPrimitiveType(this);
  }
}
