import { ParseNode } from './parse-node';
import { ParseLocation } from './parse-location';
import { AstVisitor } from './ast-visitor';
import { ParseDefinition, NodeTags } from './parse-definition';
import { ParseType } from './parse-type';

export class ParseVariableStatement extends ParseDefinition {
  constructor(
    location: ParseLocation,
    name: string,
    tags: NodeTags[],
    public type: ParseType,
    public value: any,
  ) {
    super(name, location, tags);
  }
  visit(visitor: AstVisitor): any {
    return visitor.visitVariableStatement(this);
  }
}
