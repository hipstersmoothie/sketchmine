import {
  NodeVisitor,
  NullVisitor,
  ParsedVisitor,
  ParseMethod,
  ParseResult,
  ParseIntersectionType,
  ParseTypeAliasDeclaration,
  ParseGeneric,
  ParseInterfaceDeclaration,
  ParseProperty,
  ParseVariableDeclaration,
  ParseClassDeclaration,
  ParseUnionType,
  ParseValueType,
  ParsePrimitiveType,
  ParseTypeLiteral,
  ParsePartialType,
} from '../parsed-nodes';
import { Logger } from '@sketchmine/node-helpers';
import { merge, flatten, mergeWith } from 'lodash';
import chalk from 'chalk';
const log = new Logger();

export interface Property {
  type: 'property';
  key: string;
  value: string[];
}


const MERGE_CUSTOMIZER = (objVal, srcVal) => {
  if (objVal instanceof Array) {
    return objVal.concat(srcVal);
  }
};

/**
 * Generates the final JSON that is written to a file from the
 * generated AST.
 */
export class JSONResolver extends NullVisitor implements ParsedVisitor {

  visitClassDeclaration(node: ParseClassDeclaration): any {
    const members = this.visitAll(node.members);
    const extending = this.visit(node.extending);
    return {
      name: node.name,
      members,
      extending,
    };
  }

  visitInterfaceDeclaration(node: ParseInterfaceDeclaration): any {
    log.debug(chalk`{green Visiting:} ${node.constructor.name}`);
    const members = this.visitAll(node.members);
    const extending = this.visit(node.extending);

    return {
      name: node.name,
      members,
      extending,
    };
  }

  visitIntersectionType(node: ParseIntersectionType): any {
    const types = this.visitAll(node.types);
    // return flatten(types);
    return types;
  }

  visitMethod(node: ParseMethod) {
    const returnType = this.visit(node.returnType);
    // const param = this.visitAll(node.parameters)
    return returnType;
  }

  visitUnionType(node: ParseUnionType) {
    const types = this.visitAll(node.types)
    return types;
  }

  visitProperty(node: ParseProperty) {
    log.debug(chalk`{green Visiting:} ${node.constructor.name}`);

    return {
      type: 'property',
      key: node.name,
      value: node.value,
      types: this.visit(node.type)
    };
  }

  visitPrimitiveType(node: ParsePrimitiveType) {
    log.debug(chalk`{green Visiting:} ${node.constructor.name}`);
    return node.type;
  }

  visitTypeLiteral(node: ParseTypeLiteral) {
    log.debug(chalk`{green Visiting:} ${node.constructor.name}`);
    return this.visitAll(node.members);
  }

  visitValueType(node: ParseValueType) {
    log.debug(chalk`{green Visiting:} ${node.constructor.name}`);
    return node.value;
  }

  visitResult(node: ParseResult): any[] {
    const nodes = node.nodes
      .filter(node =>
        node.constructor === ParseClassDeclaration &&
        (<ParseClassDeclaration>node).isAngularComponent())
      .map(node => this.visit(node));
    return nodes;
  }

  visitTypeAliasDeclaration(node: ParseTypeAliasDeclaration): any {
    return this.visit(node.type);
  }

  visitVariableDeclaration(node: ParseVariableDeclaration): any {
    return this.visit(node.value);
  }

  visitPartialType(node: ParsePartialType): any {
    const types = this.visitAll(node.types);
    return {
      type: 'Partial',
      types,
    };
  }

  visitGeneric(node: ParseGeneric): any {
    const constraint = this.visit(node.constraint);
    const value = this.visit(node.value);
    const type = this.visit(node.type);


    if (value && type) {
      console.log(value, type)
    }

    if (constraint) {
      console.log(constraint);
      // const v = mergeWith(
      //   {},
      //   {},
      //   MERGE_CUSTOMIZER,
      // )
    }

  //   return [value, constraint, type];
  }

}
