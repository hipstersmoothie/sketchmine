import * as ts from 'typescript';
import {
  ParseDefinition,
  ParseResult,
  ParseLocation,
  ParseDependency,
  ParseVariableDeclaration,
  ParseType,
  ParseProperty,
  ParseEmpty,
  ParseInterfaceDeclaration,
  Primitives,
  ParsePrimitiveType,
  ParseValueType,
  ParseIndexSignature,
  ParseMethod,
  ParseTypeParameter,
  ParseReferenceType,
  ParseTypeLiteral,
  ParseClassDeclaration,
  ParseObjectLiteral,
  ParseArrayLiteral,
  ParseSimpleType,
  ParseTypeAliasDeclaration,
  ParseUnionType,
  ParseArrayType,
  ParseParenthesizedType,
  ParseIntersectionType,
} from './parsed-nodes';
import { getNodeTags, NodeTags } from './util';
import { getSymbolName } from '../utils';
import { Logger } from '@sketchmine/node-helpers';
import { flatten } from 'lodash';
import chalk from 'chalk';

const log = new Logger();

/**
 * @description
 * Signature types are members of interfaces
 */
type signatureTypes =
  | ts.CallSignatureDeclaration
  | ts.ConstructSignatureDeclaration
  | ts.IndexSignatureDeclaration
  | ts.MethodSignature
  | ts.PropertySignature;

/**
 * @description
 * All possible members of a class
 */
type classMembers =
  | ts.ConstructorDeclaration
  | ts.GetAccessorDeclaration
  | ts.MethodDeclaration
  | ts.PropertyDeclaration
  | ts.SetAccessorDeclaration;

/**
 * @description
 * All types that can be converted to a ParseMethod
 */
type methodTypes =
  | ts.ConstructorTypeNode
  | ts.FunctionDeclaration
  | ts.MethodDeclaration
  | ts.MethodSignature ;

/**
 * @description
 * A node that can have a typeParameters property
 */
type hasTypeParameterNode =
 | ts.ClassDeclaration
 | ts.InterfaceDeclaration
 | ts.TypeAliasDeclaration
 | methodTypes;

/**
 * @description
 * Types that can be a parse property
 */
type propertyTypes =
  | ts.ParameterDeclaration
  | ts.PropertyAssignment
  | ts.PropertyDeclaration;

/**
 * @description
 * interface for a helper function that collects the following information
 * out of a ts.Node
 */
interface BaseProperties {
  location: ParseLocation;
  name: string;
  tags?: NodeTags[];
}

/**
 * @classdesc
 * The Visitor is responsible to traverse a typescript source file and build up
 * an abstract syntax tree from the parsed nodes.
 * The main entry point is the `visitSourceFile(sourceFile: ts.SourceFile): ParseResult`
 * function that starts traversing a source file.
 * When the traverser finds an import or export statement this file urls are collected and
 * can be parsed later on.
 */
export class Visitor {
  /**
   * @description
   * Array of dependencies that is used to visit all necessary files
   */
  dependencyPaths: ParseDependency[] = [];

  /**
   * @param paths used to parse the absolute module paths in import or export declarations
   * @param nodeModulesPath path to node_modules
   */
  constructor(
    public paths: Map<string, string>,
    public nodeModulesPath: string,
  ) {}

  /**
   * @description
   * Visits a source file and generates the parsed abstract syntax tree out
   * of all the definitions. Every import and export statement is used to explore
   * new files in the tree that have to be parsed as well. Creates a dependency tree
   * out of every import or export.
   * @param sourceFile The sourceFile that should be visited
   * @returns A parsedResult that holds all dependencies and declarations
   */
  visitSourceFile(sourceFile: ts.SourceFile): ParseResult {
    const location = this.getLocation(sourceFile);
    const definitions: ParseDefinition[] = sourceFile.statements
      .map((node: ts.Node) =>
        this.visit(node));

    return new ParseResult(location, flatten(definitions), this.dependencyPaths);
  }

  /**
   * @description
   * Visits a typescript Node according to the kind of the node
   * @returns a parsed Node that represents a class in the parsed abstract syntax tree
   */
  visit(node: ts.Node): any {
    // Early exit if there is no node passed
    if (!node) {
      return new ParseEmpty();
    }

    switch (node.kind) {
      case ts.SyntaxKind.ArrayLiteralExpression:
        return this.visitArrayLiteral(node as ts.ArrayLiteralExpression);
      case ts.SyntaxKind.ClassDeclaration:
        return this.visitClassDeclaration(node as ts.ClassDeclaration);
      case ts.SyntaxKind.InterfaceDeclaration:
        return this.visitInterfaceDeclaration(node as ts.InterfaceDeclaration);
      case ts.SyntaxKind.HeritageClause:
        return this.visitHeritageClause(node as ts.HeritageClause);
      case ts.SyntaxKind.VariableStatement:
        return this.visitVariableStatement(node as ts.VariableStatement);
      case ts.SyntaxKind.VariableDeclaration:
        return this.visitVariableDeclaration(node as ts.VariableDeclaration);
      case ts.SyntaxKind.TypeParameter:
        return this.visitTypeParameter(node as ts.TypeParameterDeclaration);
      case ts.SyntaxKind.TypeAliasDeclaration:
        return this.visitTypeAliasDeclaration(node as ts.TypeAliasDeclaration);
      case ts.SyntaxKind.PropertyDeclaration:
      case ts.SyntaxKind.PropertyAssignment:
      case ts.SyntaxKind.Parameter:
        return this.visitPropertyOrParameter(node as propertyTypes);
      case ts.SyntaxKind.MethodDeclaration:
      case ts.SyntaxKind.FunctionDeclaration:
        return this.visitMethod(node as methodTypes);
      case ts.SyntaxKind.ObjectLiteralExpression:
        return this.visitObjectLiteral(node as ts.ObjectLiteralExpression);
      case ts.SyntaxKind.StringLiteral:
      case ts.SyntaxKind.FirstLiteralToken:
      case ts.SyntaxKind.FalseKeyword:
      case ts.SyntaxKind.TrueKeyword:
        return this.visitType(node as ts.TypeNode);
      default:
        log.warning(`Unsupported SyntaxKind to visit: <${ts.SyntaxKind[node.kind]}>`);
        return;
    }
  }

  /**
   * @description
   * Visit property and value types of a nodes type child
   * @returns a parsed Type or the ParseEmpty if it could not resolve the type
   */
  visitType(node: ts.TypeNode): any {
    // Early exit if there is no node passed
    if (!node) {
      return new ParseEmpty();
    }

    const location = this.getLocation(node);

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
      case ts.SyntaxKind.FalseKeyword:
        return new ParseValueType(location, false);
      case ts.SyntaxKind.TrueKeyword:
        return new ParseValueType(location, true);
      case ts.SyntaxKind.TypeReference:
        const typeReferenceName = getSymbolName(node);
        let typeArguments: ParseType[] = [];
        if ((<ts.TypeReferenceNode>node).typeArguments) {
          typeArguments = (<ts.TypeReferenceNode>node).typeArguments
            .map((argument: ts.TypeNode) => this.visitType(argument));
        }
        return new ParseReferenceType(location, typeReferenceName, typeArguments);
      case ts.SyntaxKind.ArrayType:
        const arrayType = this.visitType((<ts.ArrayTypeNode>node).elementType);
        return new ParseArrayType(location, arrayType);
      case ts.SyntaxKind.FirstLiteralToken:
        // First LiteralToken is a number as value
        // occurs by variable declarations as value `const x = 1`
        return new ParseValueType(location, parseInt(node.getText(), 10));
      case ts.SyntaxKind.StringLiteral:
        return new ParseValueType(location, node.getText());
      case ts.SyntaxKind.TypeLiteral:
        const typeLiteralMembers: ParseProperty[] = (<ts.TypeLiteralNode>node).members
          .map((member: ts.PropertySignature) => this.visitSignature(member));
        return new ParseTypeLiteral(location, typeLiteralMembers);
      case ts.SyntaxKind.UnionType:
        return this.visitUnionType(node as ts.UnionTypeNode);
      case ts.SyntaxKind.ParenthesizedType:
        return this.visitParenthesizedType(node as ts.ParenthesizedTypeNode);
      case ts.SyntaxKind.LiteralType:
        return this.visitType((<any>node).literal);
      case ts.SyntaxKind.FunctionType:
      case ts.SyntaxKind.ConstructorType:
        return this.visitMethod(node as any);
      case ts.SyntaxKind.IntersectionType:
        return this.visitIntersectionType(node as ts.IntersectionTypeNode);
    }
    log.warning(
      chalk`Node Type {bgBlue {magenta  <ts.${ts.SyntaxKind[node.kind]}> }} ` +
      chalk`not handled yet! {grey – visitType(node: ts.TypeNode)}\n   ` +
      chalk`{grey ${location.path}}`,
    );

    return new ParseEmpty();
  }

  /**
   * @description
   * the visitSignature function visits the members of an typescript interface
   * can return
   * - ParseIndexSignature
   * - ParseProperty
   * - ParseMethodSignature
   * - (call signature) not implemented yet
   * - (construct signature) not implemented yet
   */
  visitSignature(node: signatureTypes): any {
    if (!node) { return; }

    const { location, tags }  = this.getBaseProperties(node);
    const type = this.visitType(node.type);

    switch (node.kind) {
      case ts.SyntaxKind.PropertySignature:
        const propertyName = getSymbolName(node);
        return new ParseProperty(location, propertyName, tags, type);

      case ts.SyntaxKind.MethodSignature:
        return this.visitMethod(node);
      case ts.SyntaxKind.IndexSignature:
        const parameter = (<ts.IndexSignatureDeclaration>node).parameters[0];
        const parameterName = getSymbolName(parameter);
        const parameterType = this.visitType(parameter.type);
        return new ParseIndexSignature(location, parameterName, tags, parameterType, type);
      case ts.SyntaxKind.CallSignature:
        // TODO: implement call signature
        // interface I2 {
        //   (source: string, subString: string): boolean;
        // }
        break;
      case ts.SyntaxKind.ConstructSignature:
        // TODO: implement construct signature
        // interface ClockConstructor {
        //   new (hour: number, minute: number): ClockInterface;
        // }
        break;

      default:
        log.warning(
          chalk`Signature Type {bgBlue {magenta  <ts.${ts.SyntaxKind[(<ts.Node>node).kind]}> }} ` +
          chalk`not handled yet! {grey – visitSignature(node)}\n` +
          chalk`{grey @${location.path}}`,
        );
    }
  }

  /**
   * @description
   * Visits a typescript type parameter. Type parameters can be any type or a generic.
   * They are provided like T in this example `type myType<T> …`
   */
  private visitTypeParameter(node: ts.TypeParameterDeclaration): any {
    const { location, name }  = this.getBaseProperties(node);
    const constraint = node.constraint ? this.visitType(node.constraint) : undefined;
    return new ParseTypeParameter(location, name, constraint);
  }

  /**
   * @description
   * Visits a typescript type declaration that can be resolved later on for reference types.
   * A type alias declaration can look for example like that `type myType<T> = () => T;`
   */
  private visitTypeAliasDeclaration(node: ts.TypeAliasDeclaration): any {
    const { location, name, tags }  = this.getBaseProperties(node);
    const type = this.visitType(node.type);
    const typeParameters = this.getTypeParametersOfNode(node);
    return new ParseTypeAliasDeclaration(location, name, tags, type, typeParameters);
  }

  /**
   * @description
   * Visits a typescript class with the heritage clauses and implements
   */
  private visitClassDeclaration(node: ts.ClassDeclaration): any {
    const { location, name, tags }  = this.getBaseProperties(node);
    const typeParameters = this.getTypeParametersOfNode(node);
    const members = node.members ?
      node.members.map((member: classMembers) => this.visit(member)) :
      [];

    const extending = this.getHeritageClauses(node, ts.SyntaxKind.ExtendsKeyword);
    const implementing = this.getHeritageClauses(node, ts.SyntaxKind.ImplementsKeyword);

    // TODO: parse decorator
    // node.decorators.map()

    return new ParseClassDeclaration(location, name, tags, members, typeParameters, extending, implementing);
  }

  /**
   * @description
   * Visits a typescript heritage clause (implements or extends expression)
   * of a class or interface
   */
  private visitHeritageClause(node: ts.HeritageClause) {
    return node.types.map((expression: ts.ExpressionWithTypeArguments) => {
      const location = this.getLocation(expression);
      return new ParseReferenceType(location, getSymbolName(expression.expression));
    });
  }

  /**
   * @description
   * A property can be a property inside a typescript class definition,
   * a property can also be a function parameter.
   */
  private visitPropertyOrParameter(node: propertyTypes): ParseProperty {
    const { location, name, tags }  = this.getBaseProperties(node);
    const type = (<any>node).type ? this.visitType((<any>node).type) : undefined;
    const value = (node.initializer) ? this.visit(node.initializer) : undefined;

    return new ParseProperty(location, name, tags, type, value);
  }

  /**
   * @description
   * Visits a method inside a typescript class or interface, or a plain function.
   * A method signature or declaration can look like: `method<T>(a: boolean, b: string): T;`
   */
  private visitMethod(node: methodTypes): ParseMethod {
    const { location, tags }  = this.getBaseProperties(node);
    const methodName = getSymbolName(node);
    const returnType = this.visitType(node.type);
    const parameters = this.getMethodParameters(node);
    const typeParameters = this.getTypeParametersOfNode(node);

    return new ParseMethod(location, methodName, tags, parameters, returnType, typeParameters);
  }

  /**
   * @description
   * Visits an Object Literal, this function is visiting all object members.
   */
  private visitObjectLiteral(node: ts.ObjectLiteralExpression): ParseObjectLiteral {
    const { location, tags }  = this.getBaseProperties(node);
    let properties: ParseProperty[] = [];

    if (node.properties) {
      properties = node.properties
        .map((property: ts.PropertyAssignment) => this.visit(property));
    }

    return new ParseObjectLiteral(location, tags, properties);
  }

  /**
   * @description
   * Visits an Array Literal, this function is visiting all array values.
   */
  private visitArrayLiteral(node: ts.ArrayLiteralExpression): ParseArrayLiteral {
    const { location, tags }  = this.getBaseProperties(node);
    let elements: ParseSimpleType[] = [];

    if (node.elements) {
      elements = node.elements
        .map((element: ts.Node) => this.visit(element));
    }

    return new ParseArrayLiteral(location, tags, elements);
  }

  /**
   * @description
   * Visits a variable declaration, a variable declaration can consist out of multiple
   * variable Statements.
   */
  private visitVariableStatement(node: ts.VariableStatement): ParseVariableDeclaration[] {
    return flatten(node.declarationList.declarations
      .map((declaration: ts.VariableDeclaration) =>
        this.visit(declaration)));
  }

  /**
   * @description
   * Visits a typescript variable declaration Node
   * Can resolve Object and array destruction patterns
   */
  private visitVariableDeclaration(node: ts.VariableDeclaration): ParseVariableDeclaration[] {
    const { location, name, tags }  = this.getBaseProperties(node);
    const type = this.visitType(node.type);
    const value = (node.initializer) ? this.visit(node.initializer) : undefined;

    // if the name is an object binding pattern it is an object or array destruction pattern
    if (node.name.kind === ts.SyntaxKind.ObjectBindingPattern && node.name.elements) {
      const declarations = [];

      (<any>node).name.elements
        .map((element: ts.BindingElement) => {
          return { name: getSymbolName(element), pos: element.pos };
        })
        .forEach((element: {name: string; pos: number}, index: number) => {
          const elementLocation = new ParseLocation(location.path, element.pos);
          const elementType = new ParseEmpty();
          let elementValue = undefined;
          // Object destruction
          if (value instanceof ParseObjectLiteral) {
            // find matching value for the name
            elementValue = value.properties
              .find((prop: ParseProperty) => prop.name === element.name).value;

          } else if (value instanceof ParseArrayLiteral) {
            elementValue = value.values[index];
          }
          const declaration = new ParseVariableDeclaration(
            elementLocation,
            element.name,
            tags,
            elementType,
            elementValue,
          );
          declarations.push(declaration);
        });
      return declarations;
    }
    return [new ParseVariableDeclaration(location, name, tags, type, value)];
  }

  /**
   * @description
   * Visits a typescript interface, an interface can have the following member types
   * - PropertySignature: `prop: number;`
   * - IndexSignature: `[prop: string]: any;`
   * - MethodSignature: `method();`
   * - CallSignature: `(...args): boolean`
   * - ConstructSignature: `new (...args): boolean;`
   */
  private visitInterfaceDeclaration(node: ts.InterfaceDeclaration): ParseInterfaceDeclaration {
    const { location, name, tags }  = this.getBaseProperties(node);
    const typeParameters = this.getTypeParametersOfNode(node);
    const members: ParseProperty[] = node.members ?
      node.members.map((member: signatureTypes) => this.visitSignature(member)) :
      [];

    const extending = this.getHeritageClauses(node, ts.SyntaxKind.ExtendsKeyword);

    return new ParseInterfaceDeclaration(location, name, tags, members, typeParameters, extending);
  }

  /**
   * @description
   * Visits a typescript parenthesized type, this is type that is surrounded by brackets
   * so that the inner type can be a union type, for example: `type a = (number | string)[]`
   */
  private visitParenthesizedType(node: ts.ParenthesizedTypeNode): ParseParenthesizedType {
    const location = this.getLocation(node);
    const type = this.visitType(node.type);
    return new ParseParenthesizedType(location, type);
  }

  /**
   * @description
   * Visit a typescript intersection type
   * An intersection type combines multiple types into onåe.
   * `method(): T & U {…}`
   * @see https://www.typescriptlang.org/docs/handbook/advanced-types.html
   */
  private visitIntersectionType(node: ts.IntersectionTypeNode): ParseIntersectionType {
    const location = this.getLocation(node);
    const types = node.types ? node.types
      .map((type: ts.TypeNode) => this.visitType(type)) : [];
    return new ParseIntersectionType(location, types);
  }

  /**
   * @description
   * Visits a typescript union type: `type a = 'x' | 'y';`
   */
  private visitUnionType(node: ts.UnionTypeNode): ParseUnionType {
    const location = this.getLocation(node);
    const types = node.types.map((type: ts.TypeNode) => this.visitType(type));
    return new ParseUnionType(location, types);
  }

  /**
   * @internal helper function to access the AST
   * @description
   * is visiting the HeritageClauses of an interface or class declaration
   */
  private getHeritageClauses(
    node: ts.ClassDeclaration | ts.InterfaceDeclaration,
    type: ts.SyntaxKind.ImplementsKeyword | ts.SyntaxKind.ExtendsKeyword,
  ): ParseReferenceType[] {
    if (!node.heritageClauses) {
      return [];
    }

    const clauses = node.heritageClauses
      .filter((clause: ts.HeritageClause) => clause.token === type)
      .map((clause: ts.HeritageClause) => this.visit(clause));
    return flatten(clauses);
  }

  /**
   * @internal helper function to access the AST
   * @description
   * provides the location, the name and the tags for a provided node
   */
  private getBaseProperties(node: ts.Node): BaseProperties  {
    const location = this.getLocation(node);
    const name = getSymbolName(node);
    const tags = getNodeTags(node);
    return { location, name, tags };
  }

  /**
   * @internal helper function to access the AST
   * @description
   * get the parameters of a typescript function
   */
  private getMethodParameters(node: methodTypes): ParseProperty[] {
    let parameters: ParseProperty[] = [];

    // if the method has parameters
    if (node.parameters && node.parameters.length) {
      parameters = node.parameters
        .map((parameter: ts.ParameterDeclaration) => this.visit(parameter));
    }

    return parameters;
  }

  /**
   * @internal helper function to access the AST
   * @description
   * Get the array of typescript type parameters of a node
   */
  private getTypeParametersOfNode(node: hasTypeParameterNode): ParseTypeParameter[] {
    let typeParameters: ParseTypeParameter[] = [];

    // check if the node has type parameters
    if (node.typeParameters && node.typeParameters.length) {
      typeParameters = node.typeParameters
        .map((parameter: ts.TypeParameterDeclaration) =>
          this.visitTypeParameter(parameter));
    }
    return typeParameters;
  }

  /**
   * @internal helper function to access the AST
   * @description
   * Get the location of any Node as unique identifier
   * @returns the ParseLocation that consists out of position in the file
   * and the fileName of the parent sourceFile.
   */
  private getLocation(node: ts.Node | ts.SourceFile): ParseLocation {
    const sourceFile: ts.SourceFile =
      node.kind === ts.SyntaxKind.SourceFile
        ? <ts.SourceFile>node
        : node.getSourceFile();

    return new ParseLocation(sourceFile.fileName, node.pos);
  }
}
