import {
  ParseArrayLiteral,
  ParseArrayType,
  ParseClassDeclaration,
  ParseDecorator,
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
  ParseTypeAliasDeclaration,
  ParseTypeLiteral,
  ParseTypeParameter,
  ParseUnionType,
  ParseValueType,
  ParseVariableDeclaration,
  ParsePartialType,
} from './parse-node';
import { Logger } from '@sketchmine/node-helpers';

const log = new Logger();

export interface ParsedVisitor {
  visitArrayLiteral(node: ParseArrayLiteral): any;
  visitArrayType(node: ParseArrayType): any;
  visitClassDeclaration(node: ParseClassDeclaration): any;
  visitDecorator(node: ParseDecorator): any;
  visitExpression(node: ParseExpression): any;
  visitGeneric(node: ParseGeneric): any;
  visitIndexSignature(node: ParseIndexSignature): any;
  visitInterfaceDeclaration(node: ParseInterfaceDeclaration): any;
  visitIntersectionType(node: ParseIntersectionType): any;
  visitMethod(node: ParseMethod): any;
  visitObjectLiteral(node: ParseObjectLiteral): any;
  visitParenthesizedType(node: ParseParenthesizedType): any;
  visitPartialType(node: ParsePartialType): any;
  visitPrimitiveType(node: ParsePrimitiveType): any;
  visitProperty(node: ParseProperty): any;
  visitReferenceType(node: ParseReferenceType): any;
  visitResult(node: ParseResult): any;
  visitTypeAliasDeclaration(node: ParseTypeAliasDeclaration): any;
  visitTypeLiteral(node: ParseTypeLiteral): any;
  visitTypeParameter(node: ParseTypeParameter): any;
  visitUnionType(node: ParseUnionType): any;
  visitValueType(node: ParseValueType): any;
  visitVariableDeclaration(node: ParseVariableDeclaration): any;
}

export class NullVisitor implements ParsedVisitor {
  currentLvl: number = 0;

  visitArrayLiteral(node: ParseArrayLiteral): any { return null; }
  visitArrayType(node: ParseArrayType): any { return null; }
  visitClassDeclaration(node: ParseClassDeclaration): any { return null; }
  visitDecorator(node: ParseDecorator): any { return null; }
  visitExpression(node: ParseExpression): any { return null; }
  visitGeneric(node: ParseGeneric): any { return null; }
  visitIndexSignature(node: ParseIndexSignature): any { return null; }
  visitInterfaceDeclaration(node: ParseInterfaceDeclaration): any { return null; }
  visitIntersectionType(node: ParseIntersectionType): any { return null; }
  visitMethod(node: ParseMethod): any { return null; }
  visitObjectLiteral(node: ParseObjectLiteral): any { return null; }
  visitParenthesizedType(node: ParseParenthesizedType): any { return null; }
  visitPartialType(node: ParsePartialType): any { return null; }
  visitPrimitiveType(node: ParsePrimitiveType): any { return null; }
  visitProperty(node: ParseProperty): any { return null; }
  visitReferenceType(node: ParseReferenceType): any { return null; }
  visitResult(node: ParseResult): any { return null; }
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
  visitExpression(node: ParseExpression): any { return node; }
  visitGeneric(node: ParseGeneric): any { return node; }
  visitIndexSignature(node: ParseIndexSignature): any { return node; }
  visitInterfaceDeclaration(node: ParseInterfaceDeclaration): any { return node; }
  visitIntersectionType(node: ParseIntersectionType): any { return node; }
  visitMethod(node: ParseMethod): any { return node; }
  visitObjectLiteral(node: ParseObjectLiteral): any { return node; }
  visitParenthesizedType(node: ParseParenthesizedType): any { return node; }
  visitPartialType(node: ParsePartialType): any { return node; }
  visitPrimitiveType(node: ParsePrimitiveType): any { return node; }
  visitProperty(node: ParseProperty): any { return node; }
  visitReferenceType(node: ParseReferenceType): any { return node; }
  visitResult(node: ParseResult): any { return node; }
  visitTypeAliasDeclaration(node: ParseTypeAliasDeclaration): any { return node; }
  visitTypeLiteral(node: ParseTypeLiteral): any { return node; }
  visitTypeParameter(node: ParseTypeParameter): any { return node; }
  visitUnionType(node: ParseUnionType): any { return node; }
  visitValueType(node: ParseValueType): any { return node; }
  visitVariableDeclaration(node: ParseVariableDeclaration): any { return node; }
}

export class TreeVisitor extends NodeVisitor implements ParsedVisitor {

  visitArrayLiteral(node: ParseArrayLiteral): any {
    node.values = this.visitAll(node.values);
    return node;
  }
  visitArrayType(node: ParseArrayType): any {
    node.type = this.visit(node.type);
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
    // we have to visit the constraints in case that they might be a reference type
    node.constraint = this.visit(node.constraint);
    node.value = this.visit(node.value);
    node.type = this.visit(node.type);
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
  visitPartialType(node: ParsePartialType): any {
    node.types = this.visitAll(node.types);
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
    return node;
  }
  visitTypeParameter(node: ParseTypeParameter): any {
    node.constraint = this.visit(node.constraint);
    return node;
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
