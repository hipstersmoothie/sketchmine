import { ParseLocation } from './parse-location';
import { AstVisitor } from './ast-visitor';
import { ParseProperty } from './parse-property';
import { ParseType } from './parse-type';
import { NodeTags } from './parse-definition';
import { ParseTypeParameter } from './parse-type-parameter';

export class ParseTypeAliasDeclaration extends ParseProperty {
  constructor(
    location: ParseLocation,
    name: string,
    tags: NodeTags[],
    type: ParseType,
    public typeParamter: ParseTypeParameter[] = [],
  ) {
    super(location, name, tags, type);
  }

  visit(visitor: AstVisitor): any {
    return visitor.visitTypeAliasDeclaration(this);
  }
}
