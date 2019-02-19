
import {
  ParseEmpty,
  ParseInterfaceDeclaration,
  ParseMethod,
  ParsePrimitiveType,
  ParseGeneric,
  ParseValueType,
  ReferenceResolver,
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

  test('should parse arguments to expression call', () => {
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

  test('should parse arguments to expression call with generic', () => {
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

});

describe('[code-analyzer] › Collect generics in reference resolver', () => {

  test('collect generic from interface', () => {
    const source = 'interface X<T> { member: T }';
    const result = getParsedResult(source);
    const referenceResolver = new ReferenceResolver([result]);

    expect(referenceResolver.lookupTable.size).toBe(0);
    result.visit(referenceResolver);
    expect(referenceResolver.lookupTable.size).toBe(1);
    const fileMap = referenceResolver.lookupTable.get('test-case.ts');
    expect(fileMap.size).toBe(1);
    const generic = Array.from(fileMap.values())[0];
    expect(generic).toBeInstanceOf(ParseGeneric);
    expect(generic.name).toBe('T');
  });

  test('collect generic from class declaration', () => {
    const source = 'class X<T> { member: T }';
    const result = getParsedResult(source);
    const referenceResolver = new ReferenceResolver([result]);

    expect(referenceResolver.lookupTable.size).toBe(0);
    result.visit(referenceResolver);
    expect(referenceResolver.lookupTable.size).toBe(1);
    const fileMap = referenceResolver.lookupTable.get('test-case.ts');
    expect(fileMap.size).toBe(1);
    const generic = Array.from(fileMap.values())[0];
    expect(generic).toBeInstanceOf(ParseGeneric);
    expect(generic.name).toBe('T');
  });

  test('collect generic from type declaration', () => {
    const source = 'type X<T> = () => T';
    const result = getParsedResult(source);
    const referenceResolver = new ReferenceResolver([result]);

    expect(referenceResolver.lookupTable.size).toBe(0);
    result.visit(referenceResolver);
    expect(referenceResolver.lookupTable.size).toBe(1);
    const fileMap = referenceResolver.lookupTable.get('test-case.ts');
    expect(fileMap.size).toBe(1);
    const generic = Array.from(fileMap.values())[0];
    expect(generic).toBeInstanceOf(ParseGeneric);
    expect(generic.name).toBe('T');
  });

  test('collect generic from method', () => {
    const source = 'function f<T>(a: T): T { return T; }';
    const result = getParsedResult(source);
    const referenceResolver = new ReferenceResolver([result]);

    expect(referenceResolver.lookupTable.size).toBe(0);
    result.visit(referenceResolver);
    expect(referenceResolver.lookupTable.size).toBe(1);
    const fileMap = referenceResolver.lookupTable.get('test-case.ts');
    expect(fileMap.size).toBe(1);
    const generic = Array.from(fileMap.values())[0];
    expect(generic).toBeInstanceOf(ParseGeneric);
    expect(generic.name).toBe('T');
  });

});
