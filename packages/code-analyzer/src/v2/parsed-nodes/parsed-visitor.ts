import {
  ParseArrayLiteral,
  ParseArrayType,
  ParseClassDeclaration,
  ParseDecorator,
  ParseDefinition,
  ParseDependency,
  ParseExpression,
  ParseGeneric,
  ParseIndexSignature,
  ParseInterfaceDeclaration,
  ParseIntersectionType,
  ParseMethod,
  ParseNode,
  ParseObjectLiteral,
  ParseParenthesizedType,
  ParsePrimitiveType,
  ParseProperty,
  ParseReferenceType,
  ParseResult,
  ParseSimpleType,
  ParseTypeAliasDeclaration,
  ParseTypeLiteral,
  ParseTypeParameter,
  ParseUnionType,
  ParseValueType,
  ParseVariableDeclaration,
  ParseLocation,
} from './parse-node';
import { Logger } from '@sketchmine/node-helpers';
const log = new Logger();

export interface ParsedVisitor {
  visitArrayLiteral(node: ParseArrayLiteral): any;
  visitArrayType(node: ParseArrayType): any;
  visitClassDeclaration(node: ParseClassDeclaration): any;
  visitDecorator(node: ParseDecorator): any;
  visitDefinition(node: ParseDefinition): any;
  visitDependency(node: ParseDependency): any;
  visitExpression(node: ParseExpression): any;
  visitGeneric(node: ParseGeneric): any;
  visitIndexSignature(node: ParseIndexSignature): any;
  visitInterfaceDeclaration(node: ParseInterfaceDeclaration): any;
  visitIntersectionType(node: ParseIntersectionType): any;
  visitMethod(node: ParseMethod): any;
  visitNode(node: ParseNode): any;
  visitObjectLiteral(node: ParseObjectLiteral): any;
  visitParenthesizedType(node: ParseParenthesizedType): any;
  visitPrimitiveType(node: ParsePrimitiveType): any;
  visitProperty(node: ParseProperty): any;
  visitReferenceType(node: ParseReferenceType): any;
  visitResult(node: ParseResult): any;
  visitSimpleType(node: ParseSimpleType): any;
  visitTypeAliasDeclaration(node: ParseTypeAliasDeclaration): any;
  visitTypeLiteral(node: ParseTypeLiteral): any;
  visitTypeParameter(node: ParseTypeParameter): any;
  visitUnionType(node: ParseUnionType): any;
  visitValueType(node: ParseValueType): any;
  visitVariableDeclaration(node: ParseVariableDeclaration): any;
}

export class NullVisitor implements ParsedVisitor {
  visitArrayLiteral(node: ParseArrayLiteral): any { return null; }
  visitArrayType(node: ParseArrayType): any { return null; }
  visitClassDeclaration(node: ParseClassDeclaration): any { return null; }
  visitDecorator(node: ParseDecorator): any { return null; }
  visitDefinition(node: ParseDefinition): any { return null; }
  visitDependency(node: ParseDependency): any { return null; }
  visitExpression(node: ParseExpression): any { return null; }
  visitGeneric(node: ParseGeneric): any { return null; }
  visitIndexSignature(node: ParseIndexSignature): any { return null; }
  visitInterfaceDeclaration(node: ParseInterfaceDeclaration): any { return null; }
  visitIntersectionType(node: ParseIntersectionType): any { return null; }
  visitMethod(node: ParseMethod): any { return null; }
  visitNode(node: ParseNode): any { return null; }
  visitObjectLiteral(node: ParseObjectLiteral): any { return null; }
  visitParenthesizedType(node: ParseParenthesizedType): any { return null; }
  visitPrimitiveType(node: ParsePrimitiveType): any { return null; }
  visitProperty(node: ParseProperty): any { return null; }
  visitReferenceType(node: ParseReferenceType): any { return null; }
  visitResult(node: ParseResult): any { return null; }
  visitSimpleType(node: ParseSimpleType): any { return null; }
  visitTypeAliasDeclaration(node: ParseTypeAliasDeclaration): any { return null; }
  visitTypeLiteral(node: ParseTypeLiteral): any { return null; }
  visitTypeParameter(node: ParseTypeParameter): any { return null; }
  visitUnionType(node: ParseUnionType): any { return null; }
  visitValueType(node: ParseValueType): any { return null; }
  visitVariableDeclaration(node: ParseVariableDeclaration): any { return null; }
  visit(node: ParseNode): any {
    return node && node.visit ? node.visit(this) : node;
  }
  visitAll(nodes: ParseNode[]): any[]  {
    if (!nodes) { return []; }
    return nodes.map(node => this.visit(node));
  }
}

export class NodeVisitor extends NullVisitor implements ParsedVisitor {
  visitArrayLiteral(node: ParseArrayLiteral): any { return node; }
  visitArrayType(node: ParseArrayType): any { return node; }
  visitClassDeclaration(node: ParseClassDeclaration): any { return node; }
  visitDecorator(node: ParseDecorator): any { return node; }
  visitDefinition(node: ParseDefinition): any { return node; }
  visitDependency(node: ParseDependency): any { return node; }
  visitExpression(node: ParseExpression): any { return node; }
  visitGeneric(node: ParseGeneric): any { return node; }
  visitIndexSignature(node: ParseIndexSignature): any { return node; }
  visitInterfaceDeclaration(node: ParseInterfaceDeclaration): any { return node; }
  visitIntersectionType(node: ParseIntersectionType): any { return node; }
  visitMethod(node: ParseMethod): any { return node; }
  visitNode(node: ParseNode): any { return node; }
  visitObjectLiteral(node: ParseObjectLiteral): any { return node; }
  visitParenthesizedType(node: ParseParenthesizedType): any { return node; }
  visitPrimitiveType(node: ParsePrimitiveType): any { return node; }
  visitProperty(node: ParseProperty): any { return node; }
  visitReferenceType(node: ParseReferenceType): any { return node; }
  visitResult(node: ParseResult): any { return node; }
  visitSimpleType(node: ParseSimpleType): any { return node; }
  visitTypeAliasDeclaration(node: ParseTypeAliasDeclaration): any { return node; }
  visitTypeLiteral(node: ParseTypeLiteral): any { return node; }
  visitTypeParameter(node: ParseTypeParameter): any { return node; }
  visitUnionType(node: ParseUnionType): any { return node; }
  visitValueType(node: ParseValueType): any { return node; }
  visitVariableDeclaration(node: ParseVariableDeclaration): any { return node; }
}

export class TreeVisitor extends NodeVisitor implements ParsedVisitor {

  visitArrayLiteral(node: ParseArrayLiteral): any {
    if (node.values) {
      node.values = this.visitAll(node.values);
    }
    return node;
  }
  visitArrayType(node: ParseArrayType): any {
    if (node.type) {
      node.type = this.visit(node.type);
    }
    return node;
  }
  visitClassDeclaration(node: ParseClassDeclaration): any {
    node.members = this.visitAll(node.members);
    node.typeParameters = this.visitAll(node.typeParameters);
    node.implementing = this.visitAll(node.implementing);
    node.decorators = this.visitAll(node.decorators);
    node.extending = this.visit(node.extending);
    return node;
  }
  visitDecorator(node: ParseDecorator): any {
    node.args = this.visitAll(node.args);
    return node;
  }
  visitExpression(node: ParseExpression): any {
    node.args = this.visitAll(node.args);
    node.typeArguments = this.visitAll(node.typeArguments);
    return node;
  }
  visitGeneric(node: ParseGeneric): any {
    // when the generic has a value we know it was resolved
    // so we don't need the ParseGeneric any more return only the value.
    if (node.value) {
      return this.visit(node.value);
    }
    node.value = this.visit(node.value);
    return node;
  }
  visitIndexSignature(node: ParseIndexSignature): any {
    node.indexType = this.visit(node.indexType);
    node.type = this.visit(node.type);
    return node;
  }
  visitInterfaceDeclaration(node: ParseInterfaceDeclaration): any {
    node.members = this.visitAll(node.members);
    node.typeParameters = this.visitAll(node.typeParameters);
    node.extending = this.visit(node.extending);
    return node;
  }
  visitIntersectionType(node: ParseIntersectionType): any {
    node.types = this.visitAll(node.types);
    return node;
  }
  visitMethod(node: ParseMethod): any {
    node.decorators = this.visitAll(node.decorators);
    node.parameters = this.visitAll(node.parameters);
    node.returnType = this.visit(node.returnType);
    node.typeParameters = this.visitAll(node.typeParameters);
    return node;
  }
  visitObjectLiteral(node: ParseObjectLiteral): any {
    node.properties = this.visitAll(node.properties);
    return node;
  }
  visitParenthesizedType(node: ParseParenthesizedType): any {
    node.type = this.visit(node.type);
    return node;
  }
  visitProperty(node: ParseProperty): any {
    node.decorators = this.visitAll(node.decorators);
    node.value = this.visit(node.value);
    node.type = this.visit(node.type);
    return node;
  }
  visitReferenceType(node: ParseReferenceType): any {
    node.typeArguments = this.visitAll(node.typeArguments);
    return node;
  }
  visitResult(node: ParseResult): any {
    node.nodes = this.visitAll(node.nodes);
    return node;
  }
  visitTypeAliasDeclaration(node: ParseTypeAliasDeclaration): any {
    node.decorators = this.visitAll(node.decorators);
    node.typeParameters = this.visitAll(node.typeParameters);
    node.type = this.visit(node.type);
    return node;
  }
  visitTypeLiteral(node: ParseTypeLiteral): any {
    node.members = this.visitAll(node.members);
  }
  visitTypeParameter(node: ParseTypeParameter): any {
    node.constraint = this.visit(node.constraint);
  }
  visitUnionType(node: ParseUnionType): any {
    node.types = this.visitAll(node.types);
    return node;
  }
  visitVariableDeclaration(node: ParseVariableDeclaration): any {
    node.type = this.visit(node.type);
    node.value = this.visit(node.value);
    return node;
  }
}

/**
 * @classdesc
 * The ReferenceTreeVisitor is used to resolve the references and the generics
 * with a lookup table
 */
export class ReferenceTreeVisitor extends TreeVisitor implements ParsedVisitor {

  /**
   * Lookup Table for the Generics that are found in the tree
   * The outer map is a map where the key represents the filename
   * the value of this map is another map where the key represents the position
   * in the file where the generic ocurred and holds as value the generic symbol
   */
  lookupTable = new Map<string, Map<number, string>>();

  visitClassDeclaration(node: ParseClassDeclaration): any {
    node.typeParameters.forEach((generic: ParseTypeParameter) =>
      this.addGenericToLookupTable(generic.location, generic.name));

    node.decorators = this.visitAll(node.decorators);
    node.extending = this.visit(node.extending);
    node.implementing = this.visitAll(node.implementing);
    node.members = this.visitAll(node.members);

    return node;
  }

  visitTypeAliasDeclaration(node: ParseTypeAliasDeclaration): any {
    node.typeParameters.forEach((generic: ParseTypeParameter) =>
      this.addGenericToLookupTable(generic.location, generic.name));
    node.type = this.visit(node.type);
    return node;
  }

  private addGenericToLookupTable(location: ParseLocation, value: string): void {
    const file = this.lookupTable.get(location.path);

    // file key already exists so we need to append it.
    // to the existing position Map.
    if (file) {
      file.set(location.position, value);
      return;
    }
    // if there is no entry for this file create a file entry in the map
    // and add a new position map.
    const positionMap = new Map<number, string>();
    positionMap.set(location.position, value);
    this.lookupTable.set(location.path, positionMap);
  }
}
