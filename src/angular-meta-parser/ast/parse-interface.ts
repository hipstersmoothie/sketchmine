import { ParseLocation } from './parse-location';
import { AstVisitor } from './ast-visitor';
import { ParseDefinition } from './parse-definition';
import { ParseProperty } from './parse-property';

export class ParseInterface extends ParseDefinition {
  constructor(
    name: string,
    location: ParseLocation,
    public members: ParseProperty[] = [],
  ) {
    super(name, location);
  }

  visit(visitor: AstVisitor): any {
    return visitor.visitInterface(this);
  }
}
