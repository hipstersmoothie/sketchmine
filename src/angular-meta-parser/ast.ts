export class ParseLocation {
  constructor(public path: string) {}
}

export class ParseNode {
  constructor(public location: ParseLocation) { }
  visit(visitor: AstVisitor): any { return null; }
}

export class ParseDependency extends ParseNode {
  constructor(location: ParseLocation, public names: string[] = []) { super(location); }
  visit(visitor: AstVisitor): any { return null; }
}

export class ParseDefinition extends ParseNode {
  constructor(public name: string, location: ParseLocation) { super(location); }
  visit(visitor: AstVisitor): any { return null; }
}

export class ParseValueType extends ParseNode {
  constructor(location: ParseLocation, public value: string) { super(location); }
  visit(visitor: AstVisitor): any { return visitor.visitValueType(this); }
}

export type Primitive = 'string' | 'number' | 'undefined' | 'null' | 'boolean' | 'symbol';
export class ParsePrimitiveType extends ParseNode {
  constructor(location: ParseLocation, public type: Primitive) { super(location); }
  visit(visitor: AstVisitor): any { return visitor.visitPrimitiveType(this); }
}

export class ParseReferenceType extends ParseNode {
  constructor(location: ParseLocation, public name: string) { super(location); }
  visit(visitor: AstVisitor): any { return visitor.visitReferenceType(this); }
}

export class ParseFunctionType extends ParseNode {
  constructor(
    location: ParseLocation,
    public args: ParseProperty[],
    public returnType: ParseType,
  ) { super(location); }
  visit(visitor: AstVisitor): any { return visitor.visitFunctionType(this); }
}

export type ParseSimpleType = ParseValueType | ParsePrimitiveType | ParseReferenceType | ParseFunctionType;

export class ParseUnionType extends ParseNode {
  constructor(location: ParseLocation, public types: ParseSimpleType[]) { super(location); }
  visit(visitor: AstVisitor): any { return visitor.visitUnionType(this); }
}

export type ParseType = ParseSimpleType | ParseUnionType;

export class ParseProperty extends ParseDefinition {
  constructor(name: string, location: ParseLocation, public type: ParseType) { super(name, location); }
  isFunction(): boolean { return this.type instanceof ParseFunctionType; }
  visit(visitor: AstVisitor): any { return visitor.visitProperty(this); }
}

export class ParseInterface extends ParseDefinition {
  constructor(
    name: string,
    location: ParseLocation,
    public members: ParseProperty[] = [],
  ) { super(name, location); }
  visit(visitor: AstVisitor): any { return visitor.visitInterface(this); }
}

export class ParseResult extends ParseNode {
  constructor(
    location: ParseLocation,
    public nodes: ParseNode[],
    public dependencyPaths: Set<string>,
  ) { super(location); }
  visit(visitor: AstVisitor): any { return visitor.visitResult(this); }
}

export interface AstVisitor {
  visitNode(node: ParseNode): any;
  visitDependency(node: ParseDependency): any;
  visitDefinition(node: ParseDefinition): any;
  visitValueType(node: ParseValueType): any;
  visitPrimitiveType(node: ParsePrimitiveType): any;
  visitReferenceType(node: ParseReferenceType): any;
  visitFunctionType(node: ParseFunctionType): any;
  visitSimpleType(node: ParseSimpleType): any;
  visitUnionType(node: ParseUnionType): any;
  visitProperty(node: ParseProperty): any;
  visitInterface(node: ParseInterface): any;
  visitResult(node: ParseResult): any;
}

export class JSONVisitor implements AstVisitor {
  visitNode(node: ParseNode): any { return null; }
  visitDependency(node: ParseDependency): any { return null; }
  visitDefinition(node: ParseDefinition): any { return null; }
  visitValueType(node: ParseValueType): string { return node.value; }
  visitPrimitiveType(node: ParsePrimitiveType): string {
    return node.type;
  }
  visitReferenceType(node: ParseReferenceType): string { return node.name; }
  visitFunctionType(node: ParseFunctionType): any {
    return {
      args: this.visitAll(node.args),
      returnType: node.returnType ? node.returnType.visit(this) : null,
    };
  }
  visitSimpleType(node: ParseSimpleType): any { return null; }
  visitUnionType(node: ParseUnionType): any {
    return this.visitAll(node.types);
  }
  visitProperty(node: ParseProperty): any {
    return {
      key: node.name,
      value: node.type ? node.type.visit(this) : null,
    };
  }
  visitInterface(node: ParseInterface): any {
    return {
      location: node.location.path,
      name: node.name,
      members: this.visitAll(node.members),
    };
  }
  visitResult(node: ParseResult): any {
    return this.visitAll(node.nodes);
  }

  visitAll(nodes: ParseNode[]) {
    return nodes.map(node => node.visit(this));
  }
}
