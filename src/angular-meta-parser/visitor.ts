import * as ts from 'typescript';
import * as path from 'path';
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
  NodeTags,
  Primitives,
  ParseObjectType,
} from './ast';
import {
  getComponentDecorator,
  getInitializer,
  getSymbolName,
  hasExportModifier,
  parseAbsoluteModulePath,
  getDecoratorOfType,
} from './utils';
import { Logger } from '@utils';

const log = new Logger();

/**
 * The factory that visits the source Files
 * @param paths used to parse the absolute module paths in import or export declarations
 * @returns {ParseResult} returns a function that returns the result for a file
 */
export function tsVisitorFactory(paths: Map<string, string>): (sourceFile: ts.SourceFile) => ParseResult {
  /** These variables contain state that changes as we descend into the tree. */
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
        visitExportOrImportDeclaration(node as ts.ImportDeclaration | ts.ExportDeclaration);
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
    /** consume information from @Component decorator */
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
          members.push(...inputs.map(input => new ParseProperty(currentLocation, input, [], undefined, [])));
          break;
      }
    });
    members.push(...visitClassMembers(node));

    const implementsHeritageClauses: ParseReferenceType[] = [];
    const extendsHeritageClauses: ParseReferenceType[] = [];

    if (node.heritageClauses && node.heritageClauses.length) {
      node.heritageClauses.forEach((clause: ts.HeritageClause) => {
        const expressions = clause.types.map((expr: ts.ExpressionWithTypeArguments) =>
          new ParseReferenceType(currentLocation, getSymbolName(expr.expression)));

        switch (clause.token) {
          case ts.SyntaxKind.ImplementsKeyword:
            implementsHeritageClauses.push(...expressions);
            break;
          case ts.SyntaxKind.ExtendsKeyword:
            extendsHeritageClauses.push(...expressions);
            break;
        }
      });
    }

    const comment = visitJsDoc(node);
    nodes.push(new ParseComponent(
      currentLocation,
      name,
      checkNodeTags(node),
      members,
      selector,
      extendsHeritageClauses,
      implementsHeritageClauses,
      !!comment && comment.indexOf('@design-clickable') > -1,
      !!comment && comment.indexOf('@design-hoverable') > -1,
    ));
  }

  function visitClassMembers(node: ts.ClassDeclaration): ParseProperty[] {
    const properties: ParseProperty[] = [];

    if (node.members && node.members.length) {
      node.members.forEach((member) => {
        if (getDecoratorOfType(member, 'Input')) {
          properties.push(visitInputDecorator(member));
        }
      });
    }
    return properties;
  }

  function visitInputDecorator(node: ts.Node): ParseProperty {
    let type: ParseType;

    switch (node.kind) {
      case ts.SyntaxKind.PropertyDeclaration:
      case ts.SyntaxKind.GetAccessor:
        type = visitType((node as ts.GetAccessorDeclaration).type);
        break;
      case ts.SyntaxKind.SetAccessor:
        type = visitType((node as ts.SetAccessorDeclaration).parameters[0].type);
        break;
    }
    return new ParseProperty(
      currentLocation,
      getSymbolName(node),
      checkNodeTags(node),
      type,
      resolveDesignPropValues(node),
    );
  }

  function visitTypeAliasDeclaration(node: ts.TypeAliasDeclaration): void {
    if (!hasExportModifier(node)) {
      return;
    }
    nodes.push(new ParseTypeAliasDeclaration(
      getSymbolName(node),
      currentLocation,
      checkNodeTags(node),
      visitType(node.type),
    ));
  }

  function visitInterfaceDeclaration(node: ts.InterfaceDeclaration) {
    if (!hasExportModifier(node)) {
      return;
    }
    const members: ParseProperty[] = [];

    if (node.members) {
      node.members.forEach((member: ts.PropertySignature | ts.MethodSignature) => {
        if (member.kind === ts.SyntaxKind.PropertySignature && ts.isIdentifier(member.name)) {
          switch (member.type.kind) {
            case ts.SyntaxKind.TypeReference:
            case ts.SyntaxKind.BooleanKeyword:
            case ts.SyntaxKind.NumberKeyword:
            case ts.SyntaxKind.StringKeyword:
            case ts.SyntaxKind.ArrayType:

              const propertyType = visitType(member.type);

              members.push(new ParseProperty(
                currentLocation,
                getSymbolName(member),
                checkNodeTags(member),
                propertyType,
                resolveDesignPropValues(member),
              ));
              break;
            case ts.SyntaxKind.FunctionType:
              members.push(visitMethod(member.type as ts.FunctionTypeNode));
              break;
          }
        } else if (member.kind === ts.SyntaxKind.MethodSignature && ts.isIdentifier(member.name)) {
          members.push(visitMethod(member));
        }
      });
    }
    nodes.push(new ParseInterface(
      getSymbolName(node),
      currentLocation,
      checkNodeTags(node),
      members,
    ));
  }

  function visitMethod(node: ts.SignatureDeclarationBase): ParseProperty {
    return new ParseProperty(
      currentLocation,
      getSymbolName(node),
      checkNodeTags(node),
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
          return new ParsePrimitiveType(currentLocation, Primitives.Number);
        case ts.SyntaxKind.StringKeyword:
          return new ParsePrimitiveType(currentLocation, Primitives.String);
        case ts.SyntaxKind.BooleanKeyword:
          return new ParsePrimitiveType(currentLocation, Primitives.Boolean);
        case ts.SyntaxKind.SymbolKeyword:
          return new ParsePrimitiveType(currentLocation, Primitives.Symbol);
        case ts.SyntaxKind.NullKeyword:
          return new ParsePrimitiveType(currentLocation, Primitives.Null);
        case ts.SyntaxKind.UndefinedKeyword:
          return new ParsePrimitiveType(currentLocation, Primitives.Undefined);
        case ts.SyntaxKind.TypeReference:
          const name = getSymbolName(node);
          if (name === 'Partial') {
            return (node as any).typeArguments.map(arg => visitType(arg))[0];
          }
          return new ParseReferenceType(currentLocation, name);
        case ts.SyntaxKind.ArrayType:
          return new ParseArrayType(currentLocation, node.getText());
        case ts.SyntaxKind.TypeLiteral:
          return new ParseObjectType(currentLocation, node.getText());
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
        new ParseProperty(
          currentLocation,
          getSymbolName(param),
          checkNodeTags(node),
          visitType(param.type),
        ));
    }
    return new ParseFunctionType(currentLocation, args, visitType(node.type));
  }

  function visitExportOrImportDeclaration(node: ts.ExportDeclaration | ts.ImportDeclaration): void {
    const relativePath = getSymbolName(node.moduleSpecifier);
    if (relativePath) {
      const absolutePath = parseAbsoluteModulePath(path.dirname(currentLocation.path), relativePath, paths);
      /** if absolutePath is null then it is a node_module so we can skip it! */
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

/**
 * resolves values from the node.
 * @param {ts.Node} node ndoe to check the jsDoc for design prop or param value
 */
function resolveDesignPropValues(node: ts.Node): any[] {
  const comment = visitJsDoc(node);
  const values = [];
  if (!comment) {
    return values;
  }
  /** regex for param value: const regex = /@design-param-value\s(.+?)\s(.+)\n/g; */
  /** matches property values https://regex101.com/r/SWxdIh/4 */
  const regex = /@design-prop-value\s(.+?)(\s?\*\/)?$/gm;
  let match = regex.exec(comment);
  while (match !== null) {
    values.push(JSON.parse(match[1]));
    match = regex.exec(comment);
  }
  return values;
}

/**
 * Check if a node has an **@internal** or **@design-unrelated** identifier in the jsDoc comment
 * basic blacklisting of components, properties, methods and so on.
 * @param comment string of the JsDoc comment
 * @param node The node where the information should be applied
 */
function checkNodeTags(node: ts.Node): NodeTags[] {
  const comment = visitJsDoc(node);
  const tags: NodeTags[] = [];

  if (node.modifiers) {
    if (node.modifiers.find(m => m.kind === ts.SyntaxKind.PrivateKeyword)) {
      tags.push('private');
    }
  }

  if (getSymbolName(node).startsWith('_')) {
    tags.push('hasUnderscore');
  }

  if (comment !== null && comment.includes('@internal')) {
    tags.push('internal');
  }
  if (comment !== null && comment.includes('@design-unrelated')) {
    tags.push('unrelated');
  }
  return tags;
}

/**
 * Check if a jsDoc comment exist on node and returns the comment as string
 * @param {ts.Node} node Typescript AST node
 */
function visitJsDoc(node: ts.Node): string | null {
  const jsDocComments: any[] = (node as any).jsDoc;
  if (!jsDocComments) {
    return null;
  }
  return jsDocComments
    .map(comment => comment.getFullText())
    .join('\n') as string;
}
