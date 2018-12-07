import { ParseLocation } from './parse-location';
import { AstVisitor } from './ast-visitor';
import { ParseDefinition, NodeTags } from './parse-definition';
import { ParseProperty } from './parse-property';

export class ParseInterface extends ParseDefinition {
  constructor(
    name: string,
    location: ParseLocation,
    tags: NodeTags[],
    public members: ParseProperty[] = [],
  ) {
    super(name, location, tags);
  }

  visit(visitor: AstVisitor): any {
    return visitor.visitInterface(this);
  }
}
