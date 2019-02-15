import {
  ParseTypeAliasDeclaration,
  ParseTypeParameter,
  ParseReferenceType,
  ParsePrimitiveType,
  ParseUnionType,
  ParseValueType,
  ParseMethod,
  FOUND_TO_EQUAL_GENERICS_ERROR,
} from '../../src';
import { getParsedResult, applyResolvers } from '../helpers';



describe('[code-analyzer] › Resolving Generic Types', () => {

  test('typeParameters is present on node with generics', () => {
    const result = getParsedResult('type test<T> = () => T').nodes[0] as ParseTypeAliasDeclaration;
    expect(result).toHaveProperty('typeParameters');
    expect(result.typeParameters).toBeInstanceOf(Array);
    expect(result.typeParameters).toHaveLength(1);
    expect(result.typeParameters[0]).toBeInstanceOf(ParseTypeParameter);
    expect(result.typeParameters[0].name).toBe('T');
  });

  test('typeParameters is a array of generics: type test<T, P>', () => {
    const source = 'type test<T, P, C> = () => T';
    const result = getParsedResult(source).nodes[0] as ParseTypeAliasDeclaration;
    expect(result.typeParameters).toHaveLength(3);
    expect(result.typeParameters[0]).toBeInstanceOf(ParseTypeParameter);
    expect(result.typeParameters[0].name).toBe('T');
    expect(result.typeParameters[1]).toBeInstanceOf(ParseTypeParameter);
    expect(result.typeParameters[1].name).toBe('P');
    expect(result.typeParameters[2]).toBeInstanceOf(ParseTypeParameter);
    expect(result.typeParameters[2].name).toBe('C');
  });

  test('generic type as return value is a reference type', () => {
    const source = 'type test<T> = () => T';
    const result = getParsedResult(source).nodes[0] as ParseTypeAliasDeclaration;
    const returnType = (result.type as ParseMethod).returnType as ParseReferenceType;

    expect(returnType).toBeInstanceOf(ParseReferenceType);
    expect(returnType.name).toBe('T');
  });

  test('generic resolves with string as return value: type test<T> = () => T; const a: test<string>;', () => {
    const source = 'type test<T> = () => T; let a: test<string>';
    const result = getParsedResult(source);
    const transformed = applyResolvers(result) as any;
    const a = transformed.nodes[1].type;

    expect(a).toBeInstanceOf(ParseTypeAliasDeclaration);
    expect(a.type).toBeInstanceOf(ParseMethod);
    expect(a.type.returnType).toBeInstanceOf(ParsePrimitiveType);
    expect(a.type.returnType.type).toBe('string');
  });

  test('generic resolves with a reference type as parameter', () => {
    const source = 'type test<T> = () => T; let a: test<myType>; type myType = "value" | "test";';
    const result = getParsedResult(source) as any;

    expect(result.nodes[1].type).toBeInstanceOf(ParseReferenceType);
    expect(result.nodes[1].type.name).toBe('test');
    expect(result.nodes[1].type.typeArguments[0]).toBeInstanceOf(ParseReferenceType);
    expect(result.nodes[1].type.typeArguments[0].name).toBe('myType');

    const transformed = applyResolvers(result) as any;
    const a = transformed.nodes[1].type;

    expect(a).toBeInstanceOf(ParseTypeAliasDeclaration);
    expect(a.type).toBeInstanceOf(ParseMethod);
    expect(a.type.returnType).toBeInstanceOf(ParseTypeAliasDeclaration);
    expect(a.type.returnType.type).toBeInstanceOf(ParseUnionType);
    expect(a.type.returnType.type.types[0]).toBeInstanceOf(ParseValueType);
    expect(a.type.returnType.type.types[0].value).toMatch('value');
    expect(a.type.returnType.type.types[1]).toBeInstanceOf(ParseValueType);
    expect(a.type.returnType.type.types[1].value).toMatch('test');
  });

  test('multiple generics with the same reference in one file', () => {
    const source = `
      type test<T> = () => T;
      let a: test<myType>;
      type myType = "value" | "test";
      abstract class x<T> {
        abstract y<T>():T;
      }
    `;
    const result = getParsedResult(source) as any;
    expect(result.nodes).toHaveLength(4);
    expect(result.nodes[0].typeParameters[0].name).toBe('T');
    expect(result.nodes[3].typeParameters[0].name).toBe('T');

    expect(() => applyResolvers(result)).not.toThrowError(FOUND_TO_EQUAL_GENERICS_ERROR);
  });
});
