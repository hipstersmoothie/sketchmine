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
} from './index';

export interface AstVisitor {
  visitNode(node: ParseNode): any;
  visitDependency(node: ParseDependency): any;
  visitDefinition(node: ParseDefinition): any;
  visitValueType(node: ParseValueType): any;
  visitPrimitiveType(node: ParsePrimitiveType): any;
  visitReferenceType(node: ParseReferenceType): any;
  visitArrayType(node: ParseArrayType): any;
  visitFunctionType(node: ParseFunctionType): any;
  visitSimpleType(node: ParseSimpleType): any;
  visitUnionType(node: ParseUnionType): any;
  visitProperty(node: ParseProperty): any;
  visitInterface(node: ParseInterface): any;
  visitTypeAliasDeclaration(node: ParseTypeAliasDeclaration): any;
  visitComponent(node: ParseComponent): any;
  visitResult(node: ParseResult): any;
}
