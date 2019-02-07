import * as ts from 'typescript';
import {
  ValuesResolver,
  ReferenceResolver,
  tsVisitorFactory,
  ParseResult,
  ParseTypeAliasDeclaration,
  ParseTypeParameter,
  ParseReferenceType,
  ParseFunctionType,
  ParsePrimitiveType,
  ParseUnionType,
  ParseValueType,
} from '../src';

describe('[code-analyzer] › Resolving Generic Types', () => {

  let visitor: (sourceFile: ts.SourceFile) => ParseResult;

  beforeAll(() => {
    const paths = new Map<string, string>();
    visitor = tsVisitorFactory(paths, 'node_modules');
  });

  test('typeParameters is present on node with generics', () => {
    const sourceFile = createSourceFile('type test<T> = () => T');
    const result = visitor(sourceFile);
    const typeAlias = result.nodes[0] as ParseTypeAliasDeclaration;

    expect(typeAlias).toHaveProperty('typeParamter');
    expect(typeAlias.typeParamter).toBeInstanceOf(Array);
    expect(typeAlias.typeParamter).toHaveLength(1);
    expect(typeAlias.typeParamter[0]).toBeInstanceOf(ParseTypeParameter);
    expect(typeAlias.typeParamter[0].name).toBe('T');
  });

  test('typeParameters is a array of generics: type test<T, P>', () => {
    const sourceFile = createSourceFile('type test<T, P, C> = () => T');
    const result = visitor(sourceFile);
    const typeAlias = result.nodes[0] as ParseTypeAliasDeclaration;

    expect(typeAlias.typeParamter).toHaveLength(3);
    expect(typeAlias.typeParamter[0]).toBeInstanceOf(ParseTypeParameter);
    expect(typeAlias.typeParamter[0].name).toBe('T');
    expect(typeAlias.typeParamter[1]).toBeInstanceOf(ParseTypeParameter);
    expect(typeAlias.typeParamter[1].name).toBe('P');
    expect(typeAlias.typeParamter[2]).toBeInstanceOf(ParseTypeParameter);
    expect(typeAlias.typeParamter[2].name).toBe('C');
  });

  test('generic type as return value is a reference type', () => {
    const sourceFile = createSourceFile('type test<T> = () => T');
    const result = visitor(sourceFile);
    const returnType = (<any>result).nodes[0].type.returnType;

    expect(returnType).toBeInstanceOf(ParseReferenceType);
    expect(returnType.name).toBe('T');
  });

  test('generic resolves with string as return value: type test<T> = () => T; const a: test<string>;', () => {
    const sourceFile = createSourceFile('type test<T> = () => T; const a: test<string>');
    const result = visitor(sourceFile);
    const referenceResolver = new ReferenceResolver([result]);
    const valuesResolver = new ValuesResolver();
    let transformedResult = result.visit(referenceResolver);
    transformedResult = result.visit(valuesResolver);

    const a = transformedResult.nodes[1].type;

    expect(a).toBeInstanceOf(ParseTypeAliasDeclaration);
    expect(a.type).toBeInstanceOf(ParseFunctionType);
    expect(a.type.returnType).toBeInstanceOf(ParsePrimitiveType);
    expect(a.type.returnType.type).toBe('string');
  });

  test('generic resolves with a reference type as parameter', () => {
    const source = 'type test<T> = () => T; const a: test<myType>; type myType = "value" | "test";';
    const sourceFile = createSourceFile(source);
    const result = visitor(sourceFile);
    const referenceResolver = new ReferenceResolver([result]);
    const valuesResolver = new ValuesResolver();
    let transformedResult = result.visit(referenceResolver);
    transformedResult = result.visit(valuesResolver);

    const a = transformedResult.nodes[1].type;

    expect(a).toBeInstanceOf(ParseTypeAliasDeclaration);
    expect(a.type).toBeInstanceOf(ParseFunctionType);
    expect(a.type.returnType).toBeInstanceOf(ParseTypeAliasDeclaration);
    expect(a.type.returnType.type).toBeInstanceOf(ParseUnionType);
    expect(a.type.returnType.type.types[0]).toBeInstanceOf(ParseValueType);
    expect(a.type.returnType.type.types[0].value).toBe('value');
    expect(a.type.returnType.type.types[1]).toBeInstanceOf(ParseValueType);
    expect(a.type.returnType.type.types[1].value).toBe('test');
  });
});

// Helper functions
function createSourceFile(source: string): ts.SourceFile {
  return ts.createSourceFile(
    'test.ts',
    source,
    ts.ScriptTarget.Latest,
    true,
  );
}
