export class ParseLocation {
  constructor(public path: string) {}
}

export class ParseNode {
  constructor(public location: ParseLocation) { }
}

export class ParseDependency extends ParseNode {
  constructor(location: ParseLocation, public names: string[] = []) { super(location); }
}

export class ParseDefinition extends ParseNode {
  constructor(public name: string, location: ParseLocation) { super(location); }
}

export class ParseVariable extends ParseDefinition {
  constructor(name: string, location: ParseLocation, public type: string) { super(name, location); }
}

export class ParseFunction extends ParseDefinition {
  constructor(
    name: string,
    location: ParseLocation,
    public args: ParseVariable[],
    public returnType: string,
  ) {
    super(name, location);
  }
}

export class ParseInterface extends ParseDefinition {
  constructor(
    name: string,
    location: ParseLocation,
    public properties: ParseVariable[] = [],
    public methods: ParseFunction[] = [],
  ) {
    super(name, location);
  }
}
