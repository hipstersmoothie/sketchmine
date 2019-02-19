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
} from '../parsed-nodes';
import { Logger } from '@sketchmine/node-helpers';
import { merge, flatten } from 'lodash';
const log = new Logger();

export interface Property {
  type: 'property';
  key: string;
  value: string[];
}

/**
 * Generates the final JSON that is written to a file from the
 * generated AST.
 */
export class JSONResolver extends NullVisitor implements ParsedVisitor {

  visitClassDeclaration(node: ParseClassDeclaration): any {

    log.debug(`Visiting: ${node.constructor.name}`);
    // heritage clauses have to be parsed
    const members = this.visitAll(node.members);
    const extending = this.visit(node.extending);
    // console.log(extending)
    return {
      name: node.name,
      members,
      extending,
    };
  }

  // visitInterfaceDeclaration(node: ParseInterfaceDeclaration): any {
  //   log.debug(`Visiting: ${node.constructor.name}`);
  //   const members = this.visitAll(node.members);
  //   const extending = this.visit(node.extending);

  //   console.log(node.name)
  //   console.log(extending)

  //   return {
  //     name: node.name,
  //     // members,
  //   };
  // }

  visitIntersectionType(node: ParseIntersectionType): any {
    log.debug(`Visiting: ${node.constructor.name}`);
    const types = this.visitAll(node.types);
    return flatten(types);
  }


  visitMethod(node: ParseMethod) {
    log.debug(`Visiting: ${node.constructor.name}`);
    const returnType = this.visit(node.returnType);
    return returnType;
  }

  visitProperty(node: ParseProperty): Property {
    log.debug(`Visiting: ${node.constructor.name}`);
    return {
      type: 'property',
      key: node.name,
      value: node.value,
    };
  }

  visitResult(node: ParseResult): any[] {
    log.debug(`Visiting: ${node.constructor.name}`);
    const nodes = node.nodes
      .filter(node => node instanceof ParseClassDeclaration)
      .map(node => this.visit(node));
    // TODO: filter all nodes that are angular components
    // .filter(node => node instanceof ParseClassDeclaration && node.isAngularComponent());
    return nodes;
  }

  visitTypeAliasDeclaration(node: ParseTypeAliasDeclaration): any {
    log.debug(`Visiting: ${node.constructor.name}`);
    return this.visit(node.type);
  }

  visitVariableDeclaration(node: ParseVariableDeclaration): any {
    log.debug(`Visiting: ${node.constructor.name}`);
    // TODO: const type =
    const value = this.visit(node.value);
    return value;
  }

  visitGeneric(node: ParseGeneric): any {
    log.debug(`Visiting: ${node.constructor.name}`);
    const constraint = this.visit(node.constraint);
    const value = this.visit(node.value);

    return [value, constraint]
    // return mergeMembers(value, constraint)
  }

}

function mergeMembers(...nodes: any[]) {
  const values = [];

  nodes.forEach((node) => {
    if (node && node.members) {
      values.push(...node.members);
    }
  });

  return values;
}
