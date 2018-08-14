import * as ts from 'typescript';
import path from 'path';
import chalk from 'chalk';
import {
  ParseArrayType,
  ParseComponent,
  ParseDependency,
  ParseEmpty,
  ParseFunctionType,
  ParseInterface,
  ParseLocation,
  ParseNode,
  ParsePrimitiveType,
  ParseProperty,
  ParseReferenceType,
  ParseResult,
  ParseSimpleType,
  ParseType,
  ParseTypeAliasDeclaration,
  ParseUnionType,
  ParseValueType,
} from './ast';
import {
  getClassHeritageClause,
  getComponentDecorator,
  getInitializer,
  getSymbolName,
  hasExportModifier,
  Logger,
  parseAbsoluteModulePath,
} from './utils';

const log = new Logger();

export function tsVisitorFactory(paths: Map<string, string>) {
  // These variables contain state that changes as we descend into the tree.
  let currentLocation: ParseLocation | undefined;
  let nodes: ParseNode[] = [];
  let dependencyPaths: ParseDependency[] = [];

  return visitSourceFile;

  function visitSourceFile(sourceFile: ts.SourceFile): ParseResult {

    if (currentLocation) {
      throw new Error(`Visitor for ${currentLocation.path} is already in use`);
    }

    currentLocation = new ParseLocation(sourceFile.fileName);
    sourceFile.forEachChild(visitor);
    const result = new ParseResult(currentLocation, nodes, dependencyPaths);

    nodes = [];
    dependencyPaths = [];
    currentLocation = undefined;

    return result;
  }

  /**
   * Visit the typescript nodes in the root
   * @param {ts.Node} node Node to be visited
   */
  function visitor(node: ts.Node) {
    switch (node.kind) {
      case ts.SyntaxKind.ExportDeclaration:
      case ts.SyntaxKind.ImportDeclaration:
        visitExportOrExportDeclaration(node as ts.ImportDeclaration | ts.ExportDeclaration);
        break;
      case ts.SyntaxKind.InterfaceDeclaration:
        visitInterfaceDeclaration(node as ts.InterfaceDeclaration);
        break;
      case ts.SyntaxKind.TypeAliasDeclaration:
        visitTypeAliasDeclaration(node as ts.TypeAliasDeclaration);
      case ts.SyntaxKind.ClassDeclaration:
        visitClassDeclaration(node as ts.ClassDeclaration);
        break;
    }
  }

  function visitClassDeclaration(node: ts.ClassDeclaration): void {
    const decorator = getComponentDecorator(node);
    if (!hasExportModifier(node) || !decorator) {
      return;
    }

    const name = getSymbolName(node);
    const members = [];
    let selector: string[];
    // consume information from @Component decorator
    decorator.properties.forEach((prop) => {
      if (!ts.isPropertyAssignment(prop)) {
        return;
      }
      const name = getSymbolName(prop);

      switch (name) {
        case 'selector':
          const ini = getInitializer(prop) as string;
          selector = ini.split(',').map(s => s.trim());
          break;
        case 'inputs':
          const inputs = getInitializer(prop) as string[];
          members.push(...inputs.map(input => new ParseProperty(input, currentLocation, undefined)));
          break;
      }
    });
    const heritageClauses = getClassHeritageClause(node);
    members.push(...visitClassMembers(node));
    nodes.push(new ParseComponent(currentLocation, name, members, selector, heritageClauses));
  }

  function visitClassMembers(node: ts.ClassDeclaration): ParseProperty[] {
    const properties: ParseProperty[] = [];

    if (node.members && node.members.length) {
      node.members.forEach((member) => {
        if (member.kind === ts.SyntaxKind.SetAccessor) {
          properties.push(visitSetAccessor(member as ts.SetAccessorDeclaration));
        }
      });
    }

    return properties;
  }

  function visitSetAccessor(node: ts.SetAccessorDeclaration): ParseProperty {
    const name = getSymbolName(node);
    const type =  visitType(node.parameters[0].type);
    return new ParseProperty(name, currentLocation, type);
  }

  function visitTypeAliasDeclaration(node: ts.TypeAliasDeclaration): void {
    if (!hasExportModifier(node)) {
      return;
    }
    nodes.push(new ParseTypeAliasDeclaration(getSymbolName(node), currentLocation, visitType(node.type)));
  }

  function visitInterfaceDeclaration(node: ts.InterfaceDeclaration) {
    if (!hasExportModifier(node)) {
      return;
    }
    const members: ParseProperty[] = [];

    if (node.members) {
      node.members.forEach((member: ts.PropertySignature | ts.MethodSignature) => {
        if (member.kind === ts.SyntaxKind.PropertySignature && ts.isIdentifier(member.name)) {
          if (member.type.kind === ts.SyntaxKind.TypeReference) {
            members.push(new ParseProperty(getSymbolName(member), currentLocation, visitType(member.type)));
          } else if (member.type.kind === ts.SyntaxKind.FunctionType) {
            members.push(visitMethod(member.type as ts.FunctionTypeNode));
          }
        } else if (member.kind === ts.SyntaxKind.MethodSignature && ts.isIdentifier(member.name)) {
          members.push(visitMethod(member));
        }
      });
    }
    nodes.push(new ParseInterface(getSymbolName(node), currentLocation, members));
  }

  function visitMethod(node: ts.SignatureDeclarationBase): ParseProperty {
    return new ParseProperty(
      getSymbolName(node),
      currentLocation,
      visitFunctionType(node.type as ts.FunctionTypeNode),
    );
  }

  /**
   * Visit property and value types
   * @param {ts.TypeNode} node A Node that holds the Type information
   * @returns {ParseType | ParseEmpty}
   */
  function visitType(node: ts.TypeNode): ParseType | ParseEmpty {
    if (node) {
      switch (node.kind) {
        case ts.SyntaxKind.VoidKeyword:
          return new ParseValueType(currentLocation, 'void');
        case ts.SyntaxKind.AnyKeyword:
          return new ParseValueType(currentLocation, 'any');
        case ts.SyntaxKind.NumberKeyword:
          return new ParsePrimitiveType(currentLocation, 'number');
        case ts.SyntaxKind.StringKeyword:
          return new ParsePrimitiveType(currentLocation, 'string');
        case ts.SyntaxKind.BooleanKeyword:
          return new ParsePrimitiveType(currentLocation, 'boolean');
        case ts.SyntaxKind.SymbolKeyword:
          return new ParsePrimitiveType(currentLocation, 'symbol');
        case ts.SyntaxKind.NullKeyword:
          return new ParsePrimitiveType(currentLocation, 'null');
        case ts.SyntaxKind.UndefinedKeyword:
          return new ParsePrimitiveType(currentLocation, 'undefined');
        case ts.SyntaxKind.TypeReference:
          const name = getSymbolName(node);
          if (name === 'Partial') {
            return (node as any).typeArguments.map(arg => visitType(arg))[0];
          }
          return new ParseReferenceType(currentLocation, name);
        case ts.SyntaxKind.ArrayType:
          return new ParseArrayType(currentLocation, node.getText());
        case ts.SyntaxKind.UnionType:
          return visitUnionType(node as ts.UnionTypeNode);
        case ts.SyntaxKind.LiteralType:
          return visitLiteralType(node as ts.LiteralTypeNode);
        case ts.SyntaxKind.FunctionType:
          return visitFunctionType(node as ts.FunctionTypeNode);
      }
      log.warning(
        chalk`Node Type {bgBlue {magenta  <ts.${ts.SyntaxKind[node.kind]}> }} ` +
        chalk`not handled yet! {grey – visitType(node: ts.TypeNode)}\n   ` +
        chalk`{grey ${currentLocation.path}}`,
      );
    }
    return new ParseEmpty();
  }

  /**
   * Visits a Literal Type node
   *  - StringLiteral
   * @param {ts.LiteralTypeNode} node Node to visit
   * @returns {ParseValueType} store the value (string)
   */
  function visitLiteralType(node: ts.LiteralTypeNode): ParseValueType {
    switch (node.literal.kind) {
      case ts.SyntaxKind.StringLiteral:
        return new ParseValueType(currentLocation, getSymbolName(node));
    }
  }

  function visitUnionType(node: ts.UnionTypeNode): ParseUnionType {
    const values = node.types.map(type => visitType(type));
    return new ParseUnionType(currentLocation, values as ParseSimpleType[]);
  }

  function visitFunctionType(node: ts.FunctionTypeNode): ParseFunctionType {
    let args: ParseProperty[] = [];
    if (node.parameters) {
      args = node.parameters.map((param: ts.ParameterDeclaration) =>
        new ParseProperty(getSymbolName(param), currentLocation, visitType(param.type)));
    }
    return new ParseFunctionType(currentLocation, args, visitType(node.type));
  }

  function visitExportOrExportDeclaration(node: ts.ExportDeclaration | ts.ImportDeclaration): void {
    const relativePath = getSymbolName(node.moduleSpecifier);
    if (relativePath) {
      const absolutePath = parseAbsoluteModulePath(path.dirname(currentLocation.path), relativePath, paths);
      // if absolutePath is null then it is a node_module so we can skip it!
      if (absolutePath !== null) {
        const values = new Set<string>();
        if (
          node.kind === ts.SyntaxKind.ImportDeclaration &&
          node.importClause &&
          node.importClause.namedBindings &&
          (node.importClause.namedBindings as ts.NamedImports).elements &&
          (node.importClause.namedBindings as ts.NamedImports).elements.length
        ) {
          const elements = (node.importClause.namedBindings as ts.NamedImports).elements;
          elements.forEach(el => values.add(getSymbolName(el.name)));
        }

        dependencyPaths.push(new ParseDependency(currentLocation, absolutePath, values));
      }
    }
  }
}
