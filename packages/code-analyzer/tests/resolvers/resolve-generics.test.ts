import {
  ParseTypeAliasDeclaration,
  ParseTypeParameter,
  ParseReferenceType,
  ParsePrimitiveType,
  ParseUnionType,
  ParseValueType,
  ParseMethod,
  ParseResult,
  ParseGeneric,
  ReferenceResolver,
  ParseInterfaceDeclaration,
  ParseIntersectionType,
  ParseClassDeclaration,
} from '../../src';
import { getParsedResult, resolveReferences } from '../helpers';

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

  test('generic typeParameter is reference object to return type', () => {
    const source = 'export type Constructor<T> = new(...args: any[]) => T;';
    const result = getParsedResult(source);
    const nodes = resolveReferences(result).nodes as any[];

    const constructorReturnType = nodes[0].type.returnType as ParseGeneric;
    expect(nodes[0].typeParameters[0]).toMatchObject(constructorReturnType);
  });

  test('generic resolves with string as return value: type test<T> = () => T; const a: test<string>;', () => {
    const source = 'type test<T> = () => T; let a: test<string>';
    const result = getParsedResult(source);
    const transformed = resolveReferences(result) as any;
    const a = transformed.nodes[1].type;

    expect(a).toBeInstanceOf(ParseTypeAliasDeclaration);
    expect(a.type).toBeInstanceOf(ParseMethod);
    expect(a.type.returnType).toBeInstanceOf(ParseGeneric);
    expect(a.type.returnType.type).toBeInstanceOf(ParsePrimitiveType);
    expect(a.type.returnType.type.type).toBe('string');
  });

  test('generic resolves with a reference type as parameter', () => {
    const source = 'type test<T> = () => T; let a: test<myType>; type myType = "value" | "test";';
    const result = getParsedResult(source) as any;

    expect(result.nodes[1].type).toBeInstanceOf(ParseReferenceType);
    expect(result.nodes[1].type.name).toBe('test');
    expect(result.nodes[1].type.typeArguments[0]).toBeInstanceOf(ParseReferenceType);
    expect(result.nodes[1].type.typeArguments[0].name).toBe('myType');

    const transformed = resolveReferences(result) as any;
    const a = transformed.nodes[1].type;

    expect(a).toBeInstanceOf(ParseTypeAliasDeclaration);
    expect(a.type).toBeInstanceOf(ParseMethod);
    expect(a.type.returnType).toBeInstanceOf(ParseGeneric);
    expect(a.type.returnType.type).toBeInstanceOf(ParseTypeAliasDeclaration);
    expect(a.type.returnType.type.type).toBeInstanceOf(ParseUnionType);
    expect(a.type.returnType.type.type.types[0]).toBeInstanceOf(ParseValueType);
    expect(a.type.returnType.type.type.types[0].value).toMatch('value');
    expect(a.type.returnType.type.type.types[1]).toBeInstanceOf(ParseValueType);
    expect(a.type.returnType.type.type.types[1].value).toMatch('test');
  });

  test('multiple generics with where the inner generic should be taken for the reference', () => {
    const source = `
      type test<T> = () => T;
      let a: test<myType>;
      type myType = "value" | "test";
      class X<T> {
        x: T;
        y<T>(a: T): T { return a }
      }
    `;
    const result = getParsedResult(source) as any;
    expect(result.nodes).toHaveLength(4);
    expect(result.nodes[0].typeParameters[0].name).toBe('T');
    expect(result.nodes[3].typeParameters[0].name).toBe('T');
    expect(result.nodes[3].members[1].typeParameters[0].name).toBe('T');

    const nodes = resolveReferences(result).nodes as any[];

    const outerGeneric = nodes[3].members[0].type as ParseGeneric;
    const innerGeneric = nodes[3].members[1].returnType as ParseGeneric;
    // the typeParameter on the class X<T>
    expect(nodes[3].typeParameters[0]).toMatchObject(outerGeneric);
    // the typeParameter y<T>
    expect(nodes[3].members[1].typeParameters[0]).toMatchObject(innerGeneric);
    // the method argument (a: T)
    expect(nodes[3].members[1].parameters[0].type).toMatchObject(innerGeneric);

    expect(outerGeneric.value).toBeUndefined();
    expect(outerGeneric.value).toBeUndefined();
  });

  test('generic extends from interface', () => {
    const source = `
      export type Constructor<T> = new(...args: any[]) => T;
      interface I1 { i: boolean; }
      interface I2  { i2: number; }
      function f<T extends Constructor<I1>>(a: T): T & Constructor<I2> { return a as any; }
    `;
    const result = getParsedResult(source);
    const nodes = resolveReferences(result).nodes as any[];

    const interface1 = nodes[1] as ParseInterfaceDeclaration;
    const interface2 = nodes[2] as ParseInterfaceDeclaration;
    const constructorReturnType = nodes[0].type.returnType as ParseGeneric;
    const functionTypeParameter = nodes[3].typeParameters[0];

    expect(nodes[0].typeParameters[0]).toMatchObject(constructorReturnType);

    expect(functionTypeParameter).toBeInstanceOf(ParseGeneric);
    expect(functionTypeParameter.value).toBeUndefined();
    expect(functionTypeParameter.constraint).toBeInstanceOf(ParseTypeAliasDeclaration);
    // test constraints
    expect(functionTypeParameter.constraint.name).toBe('Constructor');
    expect(functionTypeParameter.constraint.type).toBeInstanceOf(ParseMethod);
    expect(functionTypeParameter.constraint.type.returnType.type).toMatchObject(interface1);

    const functionParameterA = nodes[3].parameters[0];
    // function parameter matches the extended Constructor
    expect(functionParameterA.type).toMatchObject(functionTypeParameter);

    const returnType = nodes[3].returnType.types;
    expect(returnType[0]).toMatchObject(functionTypeParameter);
    expect(returnType[1]).toBeInstanceOf(ParseTypeAliasDeclaration);
    expect(returnType[1].type.returnType).toBeInstanceOf(ParseGeneric);
    expect(returnType[1].type.returnType.type).toMatchObject(interface2);
  });

  test('pass interfaces and types through the typeArguments to the generic', () => {
    const source = `
      function mixinColor<T, P >(base: T, defaultColor?: P): Constructor<P> & T { }
      type Constructor<T> = new(...args: any[]) => T;
      type DtButtonThemePalette = 'main' | 'warning' | 'cta';
      class DtButtonBase {
        constructor(public _elementRef: ElementRef) { }
      }

      const mixinBase = mixinColor<Constructor<DtButtonBase>, DtButtonThemePalette>(DtButtonBase, 'main');
    `;
    const result = getParsedResult(source);
    const nodes = resolveReferences(result).nodes as any[];

    const mixinValue = nodes[4].value.returnType;

    // first part of intersection type should be main
    expect(mixinValue).toBeInstanceOf(ParseIntersectionType);
    expect(mixinValue.types[0]).toBeInstanceOf(ParseTypeAliasDeclaration);
    expect(mixinValue.types[0].type).toBeInstanceOf(ParseMethod);
    expect(mixinValue.types[0].type.returnType.type).toBeInstanceOf(ParseGeneric);
    expect(mixinValue.types[0].type.returnType.type).toBeInstanceOf(ParseGeneric);
    expect(mixinValue.types[0].type.returnType.type.value).toBeInstanceOf(ParseValueType);
    expect(mixinValue.types[0].type.returnType.type.value.value).toMatch('main');
    expect(mixinValue.types[0].type.returnType.type.type).toBeInstanceOf(ParseTypeAliasDeclaration);


    const themePalette = mixinValue.types[0].type.returnType;
    console.log(themePalette);

    // TODO: lukas.holzer
    // second part should be the button theme palette
    // expect(mixinValue.types[1]).toBeInstanceOf(ParseGeneric);
    // expect(mixinValue.types[1].value).toBeInstanceOf(ParseClassDeclaration);
    // expect(mixinValue.types[1].value.name).toBe('DtButtonBase');
    // expect(mixinValue.types[1].value).toMatchObject(nodes[3]);

    // console.log(mixinValue.types[1].value)
  });
});
