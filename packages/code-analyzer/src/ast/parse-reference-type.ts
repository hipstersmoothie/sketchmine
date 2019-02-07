import { ParseNode } from './parse-node';
import { ParseLocation } from './parse-location';
import { AstVisitor } from './ast-visitor';
import { ParseEmpty } from './parse-empty';
import { ParseType } from './parse-type';

export class ParseReferenceType extends ParseNode {
  constructor(
    location: ParseLocation,
    public name: string,
    public typeArguments: ParseType[] = [],
  ) {
    super(location);
  }

  visit(visitor: AstVisitor): any {
    return visitor.visitReferenceType(this);
  }
}
