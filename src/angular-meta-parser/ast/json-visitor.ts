import {
  ParseNode,
  ParseDependency,
  ParseValueType,
  ParseDefinition,
  ParsePrimitiveType,
  ParseReferenceType,
  ParseFunctionType,
  ParseSimpleType,
  ParseUnionType,
  ParseProperty,
  ParseInterface,
  ParseResult,
  ParseTypeAliasDeclaration,
  ParseArrayType,
  ParseComponent,
  AstVisitor,
} from './index';
import { Logger } from '../utils';
import chalk from 'chalk';
const log = new Logger();

export class JSONVisitor implements AstVisitor {
  visitNode(node: ParseNode): any { return null; }
  visitDependency(node: ParseDependency): any { return null; }
  visitDefinition(node: ParseDefinition): any { return null; }
  visitValueType(node: ParseValueType): string { return node.value; }
  visitPrimitiveType(node: ParsePrimitiveType): string {
    return node.type;
  }
  visitReferenceType(node: ParseReferenceType): string { return node.name; }
  visitArrayType(node: ParseArrayType): string { return node.name; }
  visitFunctionType(node: ParseFunctionType): any {
    const args = this.visitAll(node.args);
    const returnType = node.returnType ? node.returnType.visit(this) : null;
    if (log.checkDebug('json-visitor')) {
      return chalk`{green function}(${args.join(', ')}){yellow : ${returnType}}`;
    }
    return {
      args,
      returnType,
    };
  }
  visitSimpleType(node: ParseSimpleType): any { return null; }
  visitUnionType(node: ParseUnionType): any {
    const result = this.visitAll(node.types);
    if (log.checkDebug('json-visitor')) {
      return result.join(' | ');
    }
    return result;
  }
  visitProperty(node: ParseProperty): any {
    const value = node.type ? node.type.visit(this) : null;

    if (log.checkDebug('json-visitor')) {
      return chalk`${node.name}: ${value}`;
    }
    return {
      key: node.name,
      value,
    };
  }
  visitTypeAliasDeclaration(node: ParseTypeAliasDeclaration): any {
    const value = node.type ? node.type.visit(this) : null;

    log.debug(
      chalk`Type {yellow  ${node.name} }
    - {yellow value:} {grey ${value}}
      `,
      'json-visitor',
    );
    return {
      key: node.name,
      value,
    };
  }
  visitInterface(node: ParseInterface): any {
    const members = this.visitAll(node.members);

    log.debug(
      chalk`Interface {yellow  ${node.name} }
    - {yellow members:}
        ${members.join('\n        ')}
    `,
      'json-visitor',
    );
    return {
      name: node.name,
      members,
    };
  }
  visitComponent(node: ParseComponent): any {
    const members = this.visitAll(node.members);

    log.debug(
      chalk`Component {bgBlue  ${node.name} }
    - selector: {grey ${node.selector.join(', ')}}
    - heritage:
      ‣ extends: {grey ${node.heritageClauses ? node.heritageClauses.extends.join(', ') : ''}}
      ‣ implements: {grey ${node.heritageClauses ? node.heritageClauses.implements.join(', ') : ''}}
    - {magenta variants:}
        ${members.join('\n        ')}
      `,
      'json-visitor',
    );


    return {
      location: node.location,
      name: node.name,
      selector: node.selector,
      heritage: node.heritageClauses,
      members,
    };
  }
  visitResult(node: ParseResult): any {
    return this.visitAll(node.nodes);
  }

  visitAll(nodes: ParseNode[])  {
    return nodes.map(node => node.visit(this));
  }
}
