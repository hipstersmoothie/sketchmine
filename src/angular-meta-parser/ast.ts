export class ParseLocation {
  constructor(public path: string) {}
}

export class ParseNode {
  constructor(public location: ParseLocation) { }
}

export class ParseEmpty extends ParseNode {
  constructor(location: ParseLocation) { super(location); }
}

export class ParseDependency extends ParseNode {
  constructor(location: ParseLocation, public names: string[] = []) { super(location); }
}

export class ParseDefinition extends ParseNode {
  constructor(public name: string, location: ParseLocation) { super(location); }
}

export class ParseValueType extends ParseNode {
  constructor(location: ParseLocation, public value: string) { super(location); }
}

export type Primitive = 'string' | 'number' | 'undefined' | 'null' | 'boolean' | 'symbol';
export class ParsePrimitiveType extends ParseNode {
  constructor(location: ParseLocation, public type: Primitive) { super(location); }
}

export class ParseReferenceType extends ParseNode {
  constructor(location: ParseLocation, public value: string) { super(location); }
}

export class ParseFunctionType extends ParseNode {
  constructor(
    location: ParseLocation,
    public args: ParseProperty[],
    public returnType: ParseType,
  ) {
    super(location);
  }
}

export type ParseSimpleType = ParseValueType | ParsePrimitiveType | ParseReferenceType | ParseFunctionType;

export class ParseUnionType extends ParseNode {
  constructor(location: ParseLocation, public types: ParseSimpleType) { super(location); }
}

export type ParseType = ParseSimpleType | ParseUnionType;

export class ParseProperty extends ParseDefinition {
  constructor(name: string, location: ParseLocation, public type: ParseType) { super(name, location); }

  isFunction(): boolean {
    return this.type instanceof ParseFunctionType;
  }
}

export class ParseInterface extends ParseDefinition {
  constructor(
    name: string,
    location: ParseLocation,
    public members: ParseProperty[] = [],
  ) {
    super(name, location);
  }
}

export class ParseResult extends ParseNode {
  constructor(
    location: ParseLocation,
    public nodes: ParseNode[],
    public dependencyPaths: Set<string>,
  ) {
    super(location);
  }
}
