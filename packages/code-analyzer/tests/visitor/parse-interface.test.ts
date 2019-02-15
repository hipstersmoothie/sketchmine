import {
  ParseResult,
  ParseInterfaceDeclaration,
  ParseLocation,
  ParseProperty,
  ParsePrimitiveType,
  ParseMethod,
  ParseTypeParameter,
  ParseReferenceType,
  ParseTypeLiteral,
  ParseIndexSignature,
  ParseValueType,
} from '../../src/v2/parsed-nodes';
import { getParsedResult } from '../helpers';

describe('[code-analyzer] › ParseInterfaceDeclaration', () => {

  test('detecting interfaces', () => {
    const source = 'interface TestInterface {}';
    const result = getParsedResult(source).nodes[0];
    expect(result).toBeInstanceOf(ParseInterfaceDeclaration);
    expect(result.tags).toHaveLength(0);
    expect(result.name).toBe('TestInterface');
    expect((<ParseInterfaceDeclaration>result).members).toHaveLength(0);
    expect(result.location).toBeInstanceOf(ParseLocation);
  });

  test('interface has multiple members', () => {
    const source = 'interface TestInterface { a: number; b: string; }';
    const result = getParsedResult(source).nodes[0] as ParseInterfaceDeclaration;
    expect(result).toBeInstanceOf(ParseInterfaceDeclaration);
    expect(result.tags).toHaveLength(0);
    const members = result.members as ParseProperty[];
    expect(members).toHaveLength(2);
    expect((members[0].type as ParsePrimitiveType).type).toBe('number');
    expect((members[1].type as ParsePrimitiveType).type).toBe('string');
  });

  test('interface can have nested objects', () => {
    const source = 'interface TestInterface { a: number; b: string; c: { d: number }}';
    const result = getParsedResult(source).nodes[0] as ParseInterfaceDeclaration;
    expect(result).toBeInstanceOf(ParseInterfaceDeclaration);
    expect(result.tags).toHaveLength(0);
    const members = result.members as ParseProperty[];
    expect(members).toHaveLength(3);
    expect(members[2].type).toBeInstanceOf(ParseTypeLiteral);
    const literal = members[2].type as ParseTypeLiteral;
    expect(literal.members).toHaveLength(1);
    expect(literal.members[0].name).toBe('d');
    expect((literal.members[0].type as ParsePrimitiveType).type).toBe('number');
  });

  test('interface to have PropertySignature member', () => {
    const source = 'interface TestInterface { prop: boolean; }';
    const result = getParsedResult(source).nodes[0] as ParseInterfaceDeclaration;
    const members = result.members as ParseProperty[];
    expect(members).toHaveLength(1);
    expect(members[0]).toBeInstanceOf(ParseProperty);
    expect(members[0].name).toBe('prop');
    expect(members[0].type).toBeInstanceOf(ParsePrimitiveType);
    expect(members[0].tags).toHaveLength(0);
  });

  test('interface to have indexSignature member', () => {
    const source = 'interface TestInterface { [key: string]: any; }';
    const result = getParsedResult(source).nodes[0] as ParseInterfaceDeclaration;
    const members = result.members;
    expect(members).toHaveLength(1);
    expect(members[0]).toBeInstanceOf(ParseIndexSignature);
    const indexSignature = members[0] as ParseIndexSignature;
    expect(indexSignature.name).toBe('key');
    expect(indexSignature.indexType).toBeInstanceOf(ParsePrimitiveType);
    expect((indexSignature.indexType as any).type).toBe('string');
    expect(indexSignature.type).toBeInstanceOf(ParseValueType);
    expect((indexSignature.type as any).value).toBe('any');
  });

  test('interface to have MethodSignature member', () => {
    const source = 'interface a { method<T>(a: boolean, b: string): T; }';
    const result = getParsedResult(source).nodes[0] as ParseInterfaceDeclaration;
    const members = result.members;
    expect(members).toHaveLength(1);
    expect(members[0]).toBeInstanceOf(ParseMethod);
    const prop = members[0] as ParseMethod;
    expect(prop.name).toBe('method');
    expect(prop.returnType).toBeInstanceOf(ParseReferenceType);
    expect(prop.typeParameters).toHaveLength(1);
    expect(prop.typeParameters[0]).toBeInstanceOf(ParseTypeParameter);
    expect(prop.parameters).toHaveLength(2);
  });

  test('interface has type parameters', () => {
    const source = 'interface a<T> { method<T>(a: boolean, b: string): T; }';
    const result = getParsedResult(source).nodes[0] as ParseInterfaceDeclaration;
    const members = result.members;
    expect(members).toHaveLength(1);
    expect(members[0]).toBeInstanceOf(ParseMethod);
    const prop = members[0] as unknown as ParseMethod;
    expect(prop.name).toBe('method');
    expect(prop.returnType).toBeInstanceOf(ParseReferenceType);
    expect(prop.typeParameters).toHaveLength(1);
    expect(prop.typeParameters[0]).toBeInstanceOf(ParseTypeParameter);
    expect(prop.parameters).toHaveLength(2);
  });

  test('interface extends another interface', () => {
    const source = `
    interface a { a: number; }
    interface b extends a { b: string; }`;
    const result = getParsedResult(source).nodes as ParseInterfaceDeclaration[];
    expect(result).toHaveLength(2);
    expect(result[0].extending).toBeUndefined();
    expect(result[1].extending).toBeInstanceOf(ParseReferenceType);
    expect(result[1].extending.name).toBe('a');
  });
});
