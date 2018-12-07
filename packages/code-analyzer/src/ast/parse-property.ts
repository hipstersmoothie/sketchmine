import { ParseLocation } from './parse-location';
import { AstVisitor } from './ast-visitor';
import { ParseDefinition, NodeTags } from './parse-definition';
import { ParseType } from './parse-type';
import { ParseFunctionType } from './parse-function-type';

export class ParseProperty extends ParseDefinition {

  constructor(
    location: ParseLocation,
    name: string,
    tags: NodeTags[],
    public type: ParseType,
    public values: any[] = [],
  ) {
    super(name, location, tags);
  }

  isFunction(): boolean {
    return this.type instanceof ParseFunctionType;
  }

  visit(visitor: AstVisitor): any {
    return visitor.visitProperty(this);
  }
}
