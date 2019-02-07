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
  Primitives,
  ParseObjectType,
  ParseVariableStatement,
  ParseTypeParameter,
  ParseDefinition,
} from './ast';
import {
  getComponentDecorator,
  getInitializer,
  getSymbolName,
  hasExportModifier,
  parseAbsoluteModulePath,
  getDecoratorOfType,
  checkNodeTags,
  visitJsDoc,
  JSDOC_ANNOTATION_CLICKABLE,
  JSDOC_ANNOTATION_HOVERABLE,
  JSDOC_ANNOTATION_NO_COMBINATIONS,
} from './utils';
import { Logger } from '@sketchmine/node-helpers';

import { inspect } from 'util';

const log = new Logger();

/**
 * The factory that visits the source Files
 * @param paths used to parse the absolute module paths in import or export declarations
 * @param nodeModulesPath path to node_modules
 * @returns {ParseResult} returns a function that returns the result for a file
 */
export function tsVisitorFactory(
  paths: Map<string, string>,
  nodeModulesPath: string,
): (sourceFile: ts.SourceFile) => ParseResult {
  /** These variables contain state that changes as we descend into the tree. */
  let currentLocation: string | undefined;
  let nodes: ParseDefinition[] = [];
  let dependencyPaths: ParseDependency[] = [];

  return visitSourceFile;

  function visitSourceFile(sourceFile: ts.SourceFile): ParseResult {

    if (currentLocation) {
      throw new Error(`Visitor for ${currentLocation} is already in use`);
    }

    currentLocation = sourceFile.fileName;
    sourceFile.forEachChild(visitor);
    const result = new ParseResult(new ParseLocation(currentLocation, 0), nodes, dependencyPaths);

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
        break;

      case ts.SyntaxKind.VariableStatement:
        visitVariableStatement(node as ts.VariableStatement);
        break;
      case ts.SyntaxKind.ClassDeclaration:
        visitClassDeclaration(node as ts.ClassDeclaration);
        break;

      case ts.SyntaxKind.FunctionDeclaration:
        break;
      case ts.SyntaxKind.EnumDeclaration:
        break;

      case ts.SyntaxKind.EndOfFileToken:
        break;
      default:
        log.warning(`Unsupported SyntaxKind to visit: <${ts.SyntaxKind[node.kind]}>`);
    }
  }

  /**
   * Visits variable statements and push it to the nodes array
   */
  function visitVariableStatement(node: ts.VariableStatement): void {
    const variables: ParseVariableStatement[] = [];

    node.declarationList.declarations.forEach((declaration: ts.VariableDeclaration) => {

      const value = 'unresolved';
      const location = new ParseLocation(currentLocation, declaration.pos);

      const variableStatement = new ParseVariableStatement(
        location,
        getSymbolName(declaration),
        checkNodeTags(node),
        visitType(declaration.type),
        value,
      );
      variables.push(variableStatement);
    });
    nodes.push(...variables);
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
          members.push(...inputs.map(input => new ParseProperty(
            new ParseLocation(currentLocation, prop.pos), input, [], undefined, [])));
          break;
      }
    });
    members.push(...visitClassMembers(node));

    const implementsHeritageClauses: ParseReferenceType[] = [];
    const extendsHeritageClauses: ParseReferenceType[] = [];

    if (node.heritageClauses && node.heritageClauses.length) {
      node.heritageClauses.forEach((clause: ts.HeritageClause) => {
        const expressions = clause.types.map((expr: ts.ExpressionWithTypeArguments) =>
          new ParseReferenceType(new ParseLocation(currentLocation, expr.pos), getSymbolName(expr.expression)));

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
    const location = new ParseLocation(currentLocation, node.pos);
    const component = new ParseComponent(
      location,
      name,
      checkNodeTags(node),
      members,
      selector,
      extendsHeritageClauses,
      implementsHeritageClauses,
      !!comment && comment.includes(JSDOC_ANNOTATION_CLICKABLE),
      !!comment && comment.includes(JSDOC_ANNOTATION_HOVERABLE),
      !!comment && !comment.includes(JSDOC_ANNOTATION_NO_COMBINATIONS),
    );

    nodes.push(component);
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

    const location = new ParseLocation(currentLocation, node.pos);
    return new ParseProperty(
      location,
      getSymbolName(node),
      checkNodeTags(node),
      type,
      resolveDesignPropValues(node),
    );
  }

  function visitTypeAliasDeclaration(node: ts.TypeAliasDeclaration): void {
    const name = getSymbolName(node);
    const typeParameters: ParseTypeParameter[] = [];

    // get the Type parameters that are provided to the type
    // like `type myType<T> …`
    if (node.typeParameters && node.typeParameters.length) {
      node.typeParameters.forEach((typeParameter: ts.TypeParameterDeclaration) => {
        const location = new ParseLocation(currentLocation, typeParameter.pos);
        const typeParam = new ParseTypeParameter(location, getSymbolName(typeParameter));
        typeParameters.push(typeParam);
      });
    }

    const location = new ParseLocation(currentLocation, node.pos);
    const typeAlias = new ParseTypeAliasDeclaration(
      location,
      name,
      checkNodeTags(node),
      visitType(node.type),
      typeParameters,
    );

    nodes.push(typeAlias);
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
              const location = new ParseLocation(currentLocation, member.pos);

              members.push(new ParseProperty(
                location,
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

    const location = new ParseLocation(currentLocation, node.pos);

    nodes.push(new ParseInterface(
      getSymbolName(node),
      location,
      checkNodeTags(node),
      members,
    ));
  }

  function visitMethod(node: ts.SignatureDeclarationBase): ParseProperty {
    const location = new ParseLocation(currentLocation, node.pos);
    return new ParseProperty(
      location,
      getSymbolName(node),
      checkNodeTags(node),
      visitFunctionType(node.type as ts.FunctionTypeNode),
    );
  }

  function visitTypeArguments(node: ts.TypeReferenceNode): ParseType[] | undefined {
    if (!node.typeArguments) {
      return;
    }
    return node.typeArguments.map((argNode: ts.TypeNode) => visitType(argNode));
  }

  /**
   * Visit property and value types
   * @param {ts.TypeNode} node A Node that holds the Type information
   * @returns {ParseType | ParseEmpty}
   */
  function visitType(node: ts.TypeNode): ParseType | ParseEmpty {
    if (node) {
      const location = new ParseLocation(currentLocation, node.pos);
      switch (node.kind) {
        case ts.SyntaxKind.VoidKeyword:
          return new ParseValueType(location, 'void');
        case ts.SyntaxKind.AnyKeyword:
          return new ParseValueType(location, 'any');
        case ts.SyntaxKind.NumberKeyword:
          return new ParsePrimitiveType(location, Primitives.Number);
        case ts.SyntaxKind.StringKeyword:
          return new ParsePrimitiveType(location, Primitives.String);
        case ts.SyntaxKind.BooleanKeyword:
          return new ParsePrimitiveType(location, Primitives.Boolean);
        case ts.SyntaxKind.SymbolKeyword:
          return new ParsePrimitiveType(location, Primitives.Symbol);
        case ts.SyntaxKind.NullKeyword:
          return new ParsePrimitiveType(location, Primitives.Null);
        case ts.SyntaxKind.UndefinedKeyword:
          return new ParsePrimitiveType(location, Primitives.Undefined);
        case ts.SyntaxKind.TypeReference:
          const name = getSymbolName(node);
          if (name === 'Partial') {
            return (node as any).typeArguments.map(arg => visitType(arg))[0];
          }
          const typeArgs = visitTypeArguments(node as ts.TypeReferenceNode);
          return new ParseReferenceType(location, name, typeArgs);
        case ts.SyntaxKind.ArrayType:
          return new ParseArrayType(location, node.getText());
        case ts.SyntaxKind.TypeLiteral:
          return new ParseObjectType(location, node.getText());
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
        chalk`{grey ${currentLocation}}`,
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
    const location = new ParseLocation(currentLocation, node.pos);
    switch (node.literal.kind) {
      case ts.SyntaxKind.StringLiteral:
        return new ParseValueType(location, getSymbolName(node));
    }
  }

  function visitUnionType(node: ts.UnionTypeNode): ParseUnionType {
    const values = node.types.map(type => visitType(type));
    const location = new ParseLocation(currentLocation, node.pos);
    return new ParseUnionType(location, values as ParseSimpleType[]);
  }

  function visitFunctionType(node: ts.FunctionTypeNode): ParseFunctionType {
    const location = new ParseLocation(currentLocation, node.pos);
    let args: ParseProperty[] = [];
    if (node.parameters) {
      args = node.parameters.map((param: ts.ParameterDeclaration) =>
        new ParseProperty(
          new ParseLocation(currentLocation, param.pos),
          getSymbolName(param),
          checkNodeTags(node),
          visitType(param.type),
        ));
    }
    return new ParseFunctionType(location, args, visitType(node.type));
  }

  /**
   * Visits and Import or ExportDeclaration Nodes and adds the paths to the
   * Dependency path array to know which files should be ParseDependency.
   * In the example below the modules `['/path/to/module', '/path/to/module-b']` would
   * be added to the `dependencyPaths` array.
   * When the function `parseAbsoluteModulePath` returns null then it is a **node_module** and
   * gets ignored.
   * ```typescript
   * import { fn } from '../module';
   * export * from './module-b';
   * ```
   */
  function visitExportOrImportDeclaration(node: ts.ExportDeclaration | ts.ImportDeclaration): void {
    const location = new ParseLocation(currentLocation, node.pos);
    const relativePath = getSymbolName(node.moduleSpecifier);
    if (relativePath) {
      // get the absolute path from the relative one.
      const absolutePath = parseAbsoluteModulePath(
        path.dirname(location.path),
        relativePath,
        paths,
        nodeModulesPath,
      );
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

        dependencyPaths.push(new ParseDependency(location, absolutePath, values));
      }
    }
  }

}

/**
 * resolves values from the node.
 * @param {ts.Node} node to check the jsDoc for design prop or param value
 */
function resolveDesignPropValues(node: ts.Node): any[] {
  const comment = visitJsDoc(node);
  const values = [];
  if (!comment) {
    return values;
  }
  /** regex for param value:
   * @see https://regex101.com/r/0scFW3/1
   * @example const regex = /@design-param-value\s(.+?)\s(.+)\n/g; */
  /** matches property values
   * @see https://regex101.com/r/SWxdIh/4 */
  const regex = /@design-prop-value\s(.+?)(\s?\*\/)?$/gm;
  let match = regex.exec(comment);
  while (match !== null) {
    values.push(JSON.parse(match[1]));
    match = regex.exec(comment);
  }
  return values;
}
