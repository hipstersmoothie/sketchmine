import { NodeTags } from '../util';
import { ParsedVisitor } from './parsed-visitor';

export type ParseSimpleType =
  | ParseMethod // a function can be a type
  | ParsePrimitiveType
  | ParseReferenceType
  | ParseValueType;

export type ParseType =
  | ParseEmpty
  | ParseSimpleType
  | ParseUnionType;

export enum Primitives {
  String = 'string',
  Number = 'number',
  Undefined = 'undefined',
  Null = 'null',
  Boolean = 'boolean',
  Symbol = 'symbol',
}

/**
 * @description
 * Every Node that is Parsed extends from this basic class.
 * It provides the node with a location to identify its position
 */
export class ParseNode {
  constructor(public location: ParseLocation) { }
  visit(visitor: ParsedVisitor): any { return null; }
}

/**
 * @description
 * Empty class if node cannot be resolved
 */
export class ParseEmpty extends ParseNode {
  constructor() {
    super(null);
  }
  visit(visitor: ParsedVisitor): any { return null; }
}

/**
 * @description
 * The parse generic is being used as a placeholder during the transform process
 * to be replaced later on with the real value.
 */
export class ParseGeneric extends ParseEmpty {
  value: ParseNode;
  constructor(public name: string) {
    super();
  }
  visit(visitor: ParsedVisitor): any {
    return visitor.visitGeneric(this);
  }
}

/**
 * @description
 * The Position in the typescript source file of a node.
 * Is used as unique identifier for the node.
 */
export class ParseLocation {
  constructor(
    public path: string,
    public position: number,
  ) {}
}

/** * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * P A R S E D   T Y P E S
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

export class ParsePrimitiveType extends ParseNode {
  constructor(
    location: ParseLocation,
    public type: Primitives,
  ) {
    super(location);
  }
  visit(visitor: ParsedVisitor): any {
    return visitor.visitPrimitiveType(this);
  }
}

/**
 * @descriptions
 * Parses a Union type `type x = 'a' | 'b'`
 */
export class ParseUnionType extends ParseNode {

  constructor(
    location: ParseLocation,
    public types: ParseSimpleType[],
  ) {
    super(location);
  }
  visit(visitor: ParsedVisitor): any {
    return visitor.visitUnionType(this);
  }
}

/**
 * @descriptions
 * An intersection type combines multiple types into one.
 * `method(): T & U {…}`
 * @see https://www.typescriptlang.org/docs/handbook/advanced-types.html
 */
export class ParseIntersectionType extends ParseNode {

  constructor(
    location: ParseLocation,
    public types: ParseSimpleType[],
  ) {
    super(location);
  }
  visit(visitor: ParsedVisitor): any {
    return visitor.visitIntersectionType(this);
  }
}

/**
 * @descriptions
 * A parenthesized type combines multiple types to be applied for an array
 * type as an example: `type a = (number | string)[]`
 * So this array can hold numbers and strings
 */
export class ParseParenthesizedType extends ParseNode {

  constructor(
    location: ParseLocation,
    public type: ParseSimpleType,
  ) {
    super(location);
  }
  visit(visitor: ParsedVisitor): any {
    return visitor.visitParenthesizedType(this);
  }
}

/**
 * @description
 * A value type is every type that holds a real value (has to be a primitive type)
 * For example `const a = 'myValue';` or `const b = 2;`. In this cases 'myValue' and 2
 * where value types.
 */
export class ParseValueType extends ParseNode {
  constructor(
    location: ParseLocation,
    public value: string | boolean | number,
  ) {
    super(location);
  }
  visit(visitor: ParsedVisitor): any {
    return visitor.visitValueType(this);
  }
}

/**
 * @description
 * A type that holds a reference to another (ParseInterface, ParseType)
 * Can have `typeArguments` that are a kind of parameters for types.
 * Can be used to pass data to a generic
 */
export class ParseReferenceType extends ParseNode {
  constructor(
    location: ParseLocation,
    public name: string,
    public typeArguments: ParseType[] = [],
  ) {
    super(location);
  }

  visit(visitor: ParsedVisitor): any {
    return visitor.visitReferenceType(this);
  }
}

/**
 * @description
 * Visits a array type like `string[]`
 */
export class ParseArrayType extends ParseNode {
  constructor(
    location: ParseLocation,
    public type: ParseType,
  ) {
    super(location);
  }

  visit(visitor: ParsedVisitor): any {
    return visitor.visitArrayType(this);
  }
}

 /**
  * @description
  * A type parameter is passed like a generic `type a<T> = () => T`
  * it prov
  * @param constraint The constraint can extend the generic type T
  * like the following example `function f<T extends OtherType<I>>(): T`
  */
export class ParseTypeParameter extends ParseNode {
  constructor(
    location: ParseLocation,
    public name: string,
    public constraint?: ParseType,
  ) {
    super(location);
  }

  visit(visitor: ParsedVisitor): any {
    return visitor.visitTypeParameter(this);
  }
}

/** * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * P A R S E D   N O D E S
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/**
 * @description
 * A type Literal is an object inside an interface in typescript
 * for example: `interface a { b: string; c: { d: number }}`.
 * In this case c would be a TypeLiteral
 */
export class ParseTypeLiteral extends ParseNode {
  constructor(
    location: ParseLocation,
    public members: ParseProperty[] = [],
  ) {
    super(location);
  }

  visit(visitor: ParsedVisitor): any {
    return visitor.visitTypeLiteral(this);
  }
}

/**
 * @description
 * Visits a typescript visitDecorator
 */
export class ParseDecorator extends ParseNode {
  constructor(
    location: ParseLocation,
    public name: string,
    public args: ParseNode[] = [],
  ) {
    super(location);
  }

  visit(visitor: ParsedVisitor): any {
    return visitor.visitDecorator(this);
  }
}

/**
 * @description
 * Holds the information for a typescript expression more or less like
 * a reference to the declaration with values for the parameters
 */
export class ParseExpression extends ParseReferenceType {
  constructor(
    location: ParseLocation,
    name: string,
    typeArguments: ParseType[] = [],
    public args: ParseNode[] = [],
  ) {
    super(location, name, typeArguments);
  }

  visit(visitor: ParsedVisitor): any {
    return visitor.visitExpression(this);
  }
}

/**
 * @description
 * A parse object literal is an Object with properties.
 */
export class ParseObjectLiteral extends ParseNode {
  constructor(
    location: ParseLocation,
    public tags: NodeTags[],
    public properties: ParseProperty[],
  ) {
    super(location);
  }

  visit(visitor: ParsedVisitor): any {
    return visitor.visitObjectLiteral(this);
  }
}

/**
 * @description
 * A parse object literal is an Object with properties.
 */
export class ParseArrayLiteral extends ParseNode {
  constructor(
    location: ParseLocation,
    public tags: NodeTags[],
    public values: ParseSimpleType[],
  ) {
    super(location);
  }

  visit(visitor: ParsedVisitor): any {
    return visitor.visitArrayLiteral(this);
  }
}

/**
 * @description
 * A parse definition is every Root node in a SourceFile,
 * a ParseResult consist out of ParseDefinitions
 */
export class ParseDefinition extends ParseNode {

  /**
   * @param location location is the unique position in a file (consists out of filename and position)
   * @param name name of the definition (Symbol Name)
   * @param tags Array of jsDoc annotations like internal unrelated private or exported
   */
  constructor(
    public location: ParseLocation,
    public name: string,
    public tags: NodeTags[],
  ) {
    super(location);
  }
  visit(visitor: ParsedVisitor): any { return null; }
}

/**
 * @description
 * A parseProperty is used to hold the information of object, interface or class members
 * it can be either a value or a function.
 */
export class ParseProperty extends ParseDefinition {
  constructor(
    location: ParseLocation,
    name: string,
    tags: NodeTags[],
    public type: ParseType,
    public value?: any,
    public decorators?: ParseDecorator[],
  ) {
    super(location, name, tags);
  }

  isFunction(): boolean {
    return this.type instanceof ParseMethod;
  }

  visit(visitor: ParsedVisitor): any {
    return visitor.visitProperty(this);
  }
}

/**
 * @description
 * An index signature can be a member of a typescript interface.
 ```typescript
interface test {
  [key: string]: any
}
 ```
 */
export class ParseIndexSignature extends ParseDefinition {
  /**
   * @param name index name (key)
   * @param indexType the type of key
   * @param type  the type of the value
   */
  constructor(
    location: ParseLocation,
    name: string,
    tags: NodeTags[],
    public indexType: ParseType,
    public type: ParseType,
  ) {
    super(location, name, tags);
  }

  visit(visitor: ParsedVisitor): any {
    return visitor.visitIndexSignature(this);
  }
}

/**
 * @description
 * A method signature can be a member of a typescript interface.
 ```typescript
interface test {
  tick<T>(..args);
}
 ```
 */
export class ParseMethod extends ParseDefinition {
  /**
   * @param name index name (key)
   * @param indexType the type of key
   * @param type  the type of the value
   */
  constructor(
    location: ParseLocation,
    name: string,
    tags: NodeTags[],
    public parameters: ParseProperty[],
    public returnType: ParseType,
    public typeParameters: ParseTypeParameter[] = [],
    public decorators?: ParseDecorator[],
  ) {
    super(location, name, tags);
  }

  visit(visitor: ParsedVisitor): any {
    return visitor.visitMethod(this);
  }
}

/**
 * @description
 * A ParseDependency is an import or export statement.
 * It is only used to build a dependency tree.
 */
export class ParseDependency extends ParseNode {
  constructor(
    location: ParseLocation,
    public path: string,
    public values: Set<string>,
  ) {
    super(location);
  }

  visit(visitor: ParsedVisitor): null { return null; }
}

/**
 * @description
 * The Results are stored in this class it holds all dependency paths of a file
 * and all parsed definitions. A Parse Result represents a parsed Typescript file.
 */
export class ParseResult extends ParseNode {
  constructor(
    location: ParseLocation,
    public nodes: ParseDefinition[],
    public dependencyPaths: ParseDependency[],
  ) {
    super(location);
  }

  visit(visitor: ParsedVisitor): any {
    return visitor.visitResult(this);
  }
}

/**
 * @description
 * The variable declaration that can store any value, it can be every
 * `const`, `let`, `var` statement.
 */
export class ParseVariableDeclaration extends ParseDefinition {
  constructor(
    location: ParseLocation,
    name: string,
    tags: NodeTags[],
    public type: ParseType,
    public value: ParseType,
  ) {
    super(location, name, tags);
  }

  visit(visitor: ParsedVisitor): any {
    return visitor.visitVariableDeclaration(this);
  }
}

/**
 * @description
 * A type alias declaration holds a type for a reference type
 * `type myType<T> = () => T;`
 */
export class ParseTypeAliasDeclaration extends ParseProperty {
  constructor(
    location: ParseLocation,
    name: string,
    tags: NodeTags[],
    type: ParseType,
    public typeParameters: ParseTypeParameter[] = [],
  ) {
    super(location, name, tags, type);
  }

  visit(visitor: ParsedVisitor): any {
    return visitor.visitTypeAliasDeclaration(this);
  }
}

/**
 * @description
 * Hold type information for objects or classes
 */
export class ParseInterfaceDeclaration extends ParseDefinition {
  constructor(
    location: ParseLocation,
    name: string,
    tags: NodeTags[],
    public members: (ParseProperty | ParseMethod | ParseIndexSignature)[] = [],
    public typeParameters: ParseTypeParameter[] = [],
    public extending: ParseReferenceType = undefined,
  ) {
    super(location, name, tags);
  }

  visit(visitor: ParsedVisitor): any {
    return visitor.visitInterfaceDeclaration(this);
  }
}

/**
 * @description
 * Is a parsed node for a typescript `class a {}` often used
 * to merge interfaces or heritage clauses
 */
export class ParseClassDeclaration extends ParseInterfaceDeclaration {
  constructor(
    location: ParseLocation,
    name: string,
    tags: NodeTags[],
    members: (ParseProperty | ParseMethod)[] = [],
    typeParameters: ParseTypeParameter[] = [],
    extending: ParseReferenceType = undefined,
    public implementing?: ParseReferenceType[],
    public decorators?: ParseDecorator[],
  ) {
    super(location, name, tags, members, typeParameters, extending);
  }

  isAngularComponent(): boolean {
    if (!this.decorators || !this.decorators.length) { return false; }
    return !!this.decorators
      .find((decorator: ParseDecorator) =>
        decorator.name === 'Component');
  }

  visit(visitor: ParsedVisitor): any {
    return visitor.visitClassDeclaration(this);
  }
}
