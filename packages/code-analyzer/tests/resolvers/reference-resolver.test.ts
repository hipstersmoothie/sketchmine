
import {
  ParseEmpty,
  ParseInterfaceDeclaration,
  ParseMethod,
  ParsePrimitiveType,
  ParseGeneric,
  ParseValueType,
  ReferenceResolver,
  ParseIntersectionType,
  ParseTypeLiteral,
  ParseProperty,
  ParseResult,
  LOOKUP_TABLE,
  applyTransformers,
} from '../../src';
import { getParsedResult, resolveReferences } from '../helpers';

describe('[code-analyzer] › Resolving References', () => {

  test('should return ParseEmpty if there is no matching reference', () => {
    const source = 'let x: UnknownType';
    const result = getParsedResult(source);
    const resolved = resolveReferences(result).nodes[0] as any;
    expect(resolved.type).toBeInstanceOf(ParseEmpty);
  });

  test('should return ParseEmpty if there is no matching method', () => {
    const source = 'const x = f()';
    const result = getParsedResult(source);
    const resolved = resolveReferences(result).nodes[0] as any;
    expect(resolved.value).toBeInstanceOf(ParseEmpty);
  });

  test('should replace reference type with matching root node', () => {
    const source = `
      interface X { x: number; }
      let a: X;
    `;
    const result = getParsedResult(source);
    const resolved = resolveReferences(result).nodes as any[];
    expect(resolved[1].type).toBeInstanceOf(ParseInterfaceDeclaration);
    expect(resolved[1].type.name).toBe('X');
    expect(resolved[1].type.members).toHaveLength(1);
  });

  test('should replace extending interfaces with the values', () => {
    const source = `
      interface Y { y: string; }
      interface X extends Y { x: number; }
      let a: X;
    `;
    const result = getParsedResult(source);
    const resolved = resolveReferences(result).nodes as any[];
    expect(resolved[2].type).toBeInstanceOf(ParseInterfaceDeclaration);
    expect(resolved[2].type.name).toBe('X');
    expect(resolved[2].type.members).toHaveLength(1);
    expect(resolved[2].type.extending).toMatchObject(resolved[0]);
  });

  test('should clone the object and not copy the reference', () => {
    const source = `
      interface Y { y: string; }
      interface X extends Y { x: number; }
      let a: X;
    `;
    const result = getParsedResult(source);
    const resolved = resolveReferences(result).nodes as any[];
    expect(resolved[2].type.extending).toMatchObject(resolved[0]);
    expect(resolved[2].type.extending).not.toBe(resolved[0]);
  });

  test('should resolve expression call with the declaration of the expression', () => {
    const source = `
      function f(): string { return 'a'; }
      const a = f();
    `;
    const result = getParsedResult(source);
    const resolved = resolveReferences(result).nodes as any[];

    expect(resolved[1].value).toBeInstanceOf(ParseMethod);
    expect(resolved[1].value.returnType).toBeInstanceOf(ParsePrimitiveType);
    expect(resolved[1].value.returnType.type).toBe('string');
  });

  test('should pass primitive arguments to expression call', () => {
    const source = `
      function f(a: string): string { return a; }
      const a = f('hello');
    `;
    const result = getParsedResult(source);
    const resolved = resolveReferences(result).nodes as any[];

    expect(resolved[1].value).toBeInstanceOf(ParseMethod);
    expect(resolved[1].value.returnType).toBeInstanceOf(ParsePrimitiveType);
    expect(resolved[1].value.returnType.type).toBe('string');
  });

  test('should pass primitive to un-resolvable type', () => {
    const source = `
      function f(a: asd): asd { }
      const a = f('hello');
    `;
    const result = getParsedResult(source);
    const resolved = resolveReferences(result).nodes as any[];

    expect(resolved[1].value).toBeInstanceOf(ParseMethod);
    expect(resolved[1].value.returnType).toBeNull();
  });

  test('should pass primitive arguments to expression call', () => {
    const source = `
      function f(a: object): object { return a; }
      const a = f({a: 'b'});
    `;
    const result = getParsedResult(source);
    const resolved = resolveReferences(result).nodes as any[];

    expect(resolved[1].value).toBeInstanceOf(ParseMethod);
    // object can not be resolved for now
    // TODO: rethink the returning null…
    expect(resolved[1].value.returnType).toBeNull();
  });

  test('should pass arguments to expression call with generic', () => {
    const source = `
      function f<T>(a: T): T { return a; }
      const a = f('hello');
    `;
    const result = getParsedResult(source);
    const resolved = resolveReferences(result).nodes as any[];

    expect(resolved[1].value).toBeInstanceOf(ParseMethod);
    expect(resolved[1].value.returnType).toBeInstanceOf(ParseGeneric);
    expect(resolved[1].value.returnType.value).toBeInstanceOf(ParseValueType);
    expect(resolved[1].value.returnType.value.value).toMatch('hello');
  });

  test('should use a cloned copy of the object when visiting expressions', () => {
    const source = `
      function f(): string { return 'a'; }
      const a = f();
    `;
    const result = getParsedResult(source);
    const resolved = resolveReferences(result).nodes as any[];

    expect(resolved[1].value).toMatchObject(resolved[0]);
    expect(resolved[1].value).not.toBe(resolved[0]);
  });

  test('passing data through arguments when resolving an expression statement', () => {
    const source = `
      function f<T, P>(a: T, b: P): P & T { return {...a, ...b}; }
      const a = f('a', 2);
    `;
    const result = getParsedResult(source);
    const resolved = resolveReferences(result).nodes as any[];

    const value = resolved[1].value;

    expect(value.returnType).toBeInstanceOf(ParseIntersectionType);
    expect(value.returnType.types[0]).toBeInstanceOf(ParseGeneric);
    expect(value.returnType.types[0].value).toBeInstanceOf(ParseValueType);
    expect(value.returnType.types[0].value.value).toBe(2);
    expect(value.returnType.types[1].value.value).toMatch('a');
  });

  test('passing data through typeArguments when resolving an expression statement', () => {
    const source = `
      function f<T, P>(): P & T {}
      const a = f<{a: string}, {b: number}>();
    `;
    const result = getParsedResult(source);
    const resolved = resolveReferences(result).nodes as any[];

    const value = resolved[1].value;

    expect(value.returnType.types[0].type).toBeInstanceOf(ParseTypeLiteral);
    expect(value.returnType.types[1].type).toBeInstanceOf(ParseTypeLiteral);
    expect(value.returnType.types[1].type.members[0]).toBeInstanceOf(ParseProperty);
  });
});

describe('[code-analyzer] › Collect generics in reference resolver', () => {

  beforeEach(() => {
    LOOKUP_TABLE.clear();
  });

  test('collect generic from interface', () => {
    const source = 'interface X<T> { member: T }';
    const result = getParsedResult(source);
    const results = new Map<string, ParseResult>();
    results.set('test-case.ts', result);
    const referenceResolver = new ReferenceResolver(results);

    expect(LOOKUP_TABLE.size).toBe(0);
    result.visit(referenceResolver);
    expect(LOOKUP_TABLE.size).toBe(1);
    const fileMap = LOOKUP_TABLE.get('test-case.ts');
    expect(fileMap.size).toBe(1);
    const generic = Array.from(fileMap.values())[0];
    expect(generic).toBeInstanceOf(ParseGeneric);
    expect(generic.name).toBe('T');
  });

  test('collect generic from class declaration', () => {
    const source = 'class X<T> { member: T }';
    const result = getParsedResult(source);
    const results = new Map<string, ParseResult>();
    results.set('test-case.ts', result);
    const referenceResolver = new ReferenceResolver(results);

    expect(LOOKUP_TABLE.size).toBe(0);
    result.visit(referenceResolver);
    expect(LOOKUP_TABLE.size).toBe(1);
    const fileMap = LOOKUP_TABLE.get('test-case.ts');
    expect(fileMap.size).toBe(1);
    const generic = Array.from(fileMap.values())[0];
    expect(generic).toBeInstanceOf(ParseGeneric);
    expect(generic.name).toBe('T');
  });

  test('collect generic from type declaration', () => {
    const source = 'type X<T> = () => T';
    const result = getParsedResult(source);
    const results = new Map<string, ParseResult>();
    results.set('test-case.ts', result);
    const referenceResolver = new ReferenceResolver(results);

    expect(LOOKUP_TABLE.size).toBe(0);
    result.visit(referenceResolver);
    expect(LOOKUP_TABLE.size).toBe(1);
    const fileMap = LOOKUP_TABLE.get('test-case.ts');
    expect(fileMap.size).toBe(1);
    const generic = Array.from(fileMap.values())[0];
    expect(generic).toBeInstanceOf(ParseGeneric);
    expect(generic.name).toBe('T');
  });

  test('collect generic from method', () => {
    const source = 'function f<T>(a: T): T { return T; }';
    const result = getParsedResult(source);
    const results = new Map<string, ParseResult>();
    results.set('test-case.ts', result);
    const referenceResolver = new ReferenceResolver(results);

    expect(LOOKUP_TABLE.size).toBe(0);
    result.visit(referenceResolver);
    expect(LOOKUP_TABLE.size).toBe(1);
    const fileMap = LOOKUP_TABLE.get('test-case.ts');
    expect(fileMap.size).toBe(1);
    const generic = Array.from(fileMap.values())[0];
    expect(generic).toBeInstanceOf(ParseGeneric);
    expect(generic.name).toBe('T');
  });
});
