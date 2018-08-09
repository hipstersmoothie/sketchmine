import { ParseLocation } from './parse-location';
import { AstVisitor } from './ast-visitor';
import { ParseInterface } from './parse-interface';
import { ParseProperty } from './parse-property';
import { HeritageClauses } from '../utils';

export class ParseComponent extends ParseInterface {
  constructor(
    location: ParseLocation,
    name: string,
    members: ParseProperty[],
    public selector: string[],
    public heritageClauses: HeritageClauses,
  ) {
    super(name, location, members);
  }

  visit(visitor: AstVisitor): any {
    return visitor.visitComponent(this);
  }
}
