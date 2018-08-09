import { ParseNode } from './parse-node';
import { ParseLocation } from './parse-location';
import { AstVisitor } from './json-visitor';
import { ParseDefinition } from './parse-definition';
import { ParseType } from './parse-type';
import { ParseFunctionType } from './parse-function-type';

export class ParseProperty extends ParseDefinition {

  constructor(name: string, location: ParseLocation, public type: ParseType) {
    super(name, location);
  }

  isFunction(): boolean {
    return this.type instanceof ParseFunctionType;
  }

  visit(visitor: AstVisitor): any {
    return visitor.visitProperty(this);
  }
}
