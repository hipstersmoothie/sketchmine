import { ParseLocation } from './parse-location';
import { AstVisitor } from './ast-visitor';
import { ParseProperty } from './parse-property';
import { ParseType } from './parse-type';

export class ParseTypeAliasDeclaration extends ParseProperty {
  constructor(
    name: string,
    location: ParseLocation,
    type: ParseType,
  ) {
    super(location, name, type);
  }

  visit(visitor: AstVisitor): any {
    return visitor.visitTypeAliasDeclaration(this);
  }
}
