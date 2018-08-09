import { ParseNode } from './parse-node';
import { ParseLocation } from './parse-location';
import { AstVisitor } from './ast-visitor';
import { ParseProperty } from './parse-property';
import { ParseType } from './parse-type';

export class ParseFunctionType extends ParseNode {
  constructor(
    location: ParseLocation,
    public args: ParseProperty[],
    public returnType: ParseType,
  ) {
    super(location);
  }

  visit(visitor: AstVisitor): any {
    return visitor.visitFunctionType(this);
  }
}
