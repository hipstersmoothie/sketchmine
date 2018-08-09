import { ParseLocation } from './parse-location';
import { AstVisitor } from './json-visitor';
import { ParseProperty } from './parse-property';
import { ParseType } from './parse-type';

export class ParseTypeAliasDeclaration extends ParseProperty {
  constructor(
    name: string,
    location: ParseLocation,
    type: ParseType,
  ) {
    super(name, location, type);
  }

  visit(visitor: AstVisitor): any {
    return visitor.visitTypeAliasDeclaration(this);
  }
}
