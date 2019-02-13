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
import { getResult } from './get-result';

describe('ParseInterfaceDeclaration', () => {

  test('detecting interfaces', () => {
    const interfaceSource = 'interface TestInterface {}';
    const result = getResult(interfaceSource).nodes[0];
    expect(result).toBeInstanceOf(ParseInterfaceDeclaration);
    expect(result.tags).toHaveLength(0);
    expect(result.name).toBe('TestInterface');
    expect((<ParseInterfaceDeclaration>result).members).toHaveLength(0);
    expect(result.location).toBeInstanceOf(ParseLocation);
  });

  test('interface has multiple members', () => {
    const interfaceSource = 'interface TestInterface { a: number; b: string; }';
    const result = getResult(interfaceSource).nodes[0];

    expect(result).toBeInstanceOf(ParseInterfaceDeclaration);
    expect(result.tags).toHaveLength(0);
    const members = (<ParseInterfaceDeclaration>result).members;
    expect(members).toHaveLength(2);
    expect((members[0].type as ParsePrimitiveType).type).toBe('number');
    expect((members[1].type as ParsePrimitiveType).type).toBe('string');
  });

  test('interface can have nested objects', () => {
    const interfaceSource = 'interface TestInterface { a: number; b: string; c: { d: number }}';
    const result = getResult(interfaceSource).nodes[0];
    expect(result).toBeInstanceOf(ParseInterfaceDeclaration);
    expect(result.tags).toHaveLength(0);
    const members = (<ParseInterfaceDeclaration>result).members;
    expect(members).toHaveLength(3);
    expect(members[2].type).toBeInstanceOf(ParseTypeLiteral);
    const literal = members[2].type as ParseTypeLiteral;
    expect(literal.members).toHaveLength(1);
    expect(literal.members[0].name).toBe('d');
    expect((literal.members[0].type as ParsePrimitiveType).type).toBe('number');
  });

  test('interface to have PropertySignature member', () => {
    const interfaceSource = 'interface TestInterface { prop: boolean; }';
    const result = getResult(interfaceSource).nodes[0];
    const members = (<ParseInterfaceDeclaration>result).members;
    expect(members).toHaveLength(1);
    expect(members[0]).toBeInstanceOf(ParseProperty);
    expect(members[0].name).toBe('prop');
    expect(members[0].type).toBeInstanceOf(ParsePrimitiveType);
    expect(members[0].tags).toHaveLength(0);
  });

  test('interface to have indexSignature member', () => {
    const interfaceSource = 'interface TestInterface { [key: string]: any; }';
    const result = getResult(interfaceSource).nodes[0];
    const members = (<ParseInterfaceDeclaration>result).members;
    expect(members).toHaveLength(1);
    expect(members[0]).toBeInstanceOf(ParseIndexSignature);
    const indexSignature = members[0] as unknown as ParseIndexSignature;
    expect(indexSignature.name).toBe('key');
    expect(indexSignature.indexType).toBeInstanceOf(ParsePrimitiveType);
    expect((indexSignature.indexType as any).type).toBe('string');
    expect(indexSignature.type).toBeInstanceOf(ParseValueType);
    expect((indexSignature.type as any).value).toBe('any');
  });

  test('interface to have MethodSignature member', () => {
    const interfaceSource = 'interface a { method<T>(a: boolean, b: string): T; }';
    const result = getResult(interfaceSource).nodes[0];
    const members = (<ParseInterfaceDeclaration>result).members;
    expect(members).toHaveLength(1);
    expect(members[0]).toBeInstanceOf(ParseMethod);
    const prop = members[0] as unknown as ParseMethod;
    expect(prop.name).toBe('method');
    expect(prop.returnType).toBeInstanceOf(ParseReferenceType);
    expect(prop.typeParameters).toHaveLength(1);
    expect(prop.typeParameters[0]).toBeInstanceOf(ParseTypeParameter);
    expect(prop.parameters).toHaveLength(2);
  });

  test('interface has type parameters', () => {
    const interfaceSource = 'interface a<T> { method<T>(a: boolean, b: string): T; }';
    const result = getResult(interfaceSource).nodes[0];
    const members = (<ParseInterfaceDeclaration>result).members;
    expect(members).toHaveLength(1);
    expect(members[0]).toBeInstanceOf(ParseMethod);
    const prop = members[0] as unknown as ParseMethod;
    expect(prop.name).toBe('method');
    expect(prop.returnType).toBeInstanceOf(ParseReferenceType);
    expect(prop.typeParameters).toHaveLength(1);
    expect(prop.typeParameters[0]).toBeInstanceOf(ParseTypeParameter);
    expect(prop.parameters).toHaveLength(2);
  });
});
