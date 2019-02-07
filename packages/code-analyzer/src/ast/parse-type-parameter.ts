import { ParseLocation } from './parse-location';
import { AstVisitor } from './ast-visitor';
import { ParseReferenceType } from './parse-reference-type';
import { ParseNode } from './parse-node';

export class ParseTypeParameter extends ParseNode {
  constructor(location: ParseLocation, public name: string) {
    super(location);
  }

  visit(visitor: AstVisitor): any {
    return visitor.visitTypeParameter(this);
  }
}
