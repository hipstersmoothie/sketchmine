import { ParseLocation } from './parse-location';
import { AstVisitor } from './ast-visitor';
import { ParseInterface } from './parse-interface';
import { ParseProperty } from './parse-property';
import { ParseReferenceType } from './parse-reference-type';

export class ParseComponent extends ParseInterface {
  constructor(
    location: ParseLocation,
    name: string,
    members: ParseProperty[],
    public selector: string[],
    public extending: ParseReferenceType[],
    public implementing: ParseReferenceType[],
    public clickable: boolean,
    public hoverable: boolean,
  ) {
    super(name, location, members);
  }

  visit(visitor: AstVisitor): any {
    return visitor.visitComponent(this);
  }
}
