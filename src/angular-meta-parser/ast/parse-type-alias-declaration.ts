import { ParseLocation } from './parse-location';
import { AstVisitor } from './ast-visitor';
import { ParseProperty } from './parse-property';
import { ParseType } from './parse-type';
import { NodeTags } from './parse-definition';

export class ParseTypeAliasDeclaration extends ParseProperty {
  constructor(
    name: string,
    location: ParseLocation,
    tags: NodeTags[],
    type: ParseType,
  ) {
    super(location, name, tags, type);
  }

  visit(visitor: AstVisitor): any {
    return visitor.visitTypeAliasDeclaration(this);
  }
}
