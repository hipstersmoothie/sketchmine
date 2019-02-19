import {
  ParseArrayLiteral,
  ParseArrayType,
  ParseClassDeclaration,
  ParseDecorator,
  ParseExpression,
  ParseGeneric,
  ParseIndexSignature,
  ParseInterfaceDeclaration,
  ParseIntersectionType,
  ParseMethod,
  ParseNode,
  ParseObjectLiteral,
  ParseParenthesizedType,
  ParsePrimitiveType,
  ParseProperty,
  ParseReferenceType,
  ParseResult,
  ParseTypeAliasDeclaration,
  ParseTypeLiteral,
  ParseTypeParameter,
  ReferenceTreeVisitor,
  ParseUnionType,
  ParseValueType,
  ParseVariableDeclaration,
  ParseLocation,
  NullVisitor,
  NodeVisitor,
  TreeVisitor,
  ParseDefinition,
  ParseDependency,
} from '../../src/v2/parsed-nodes';
import { getParsedResult } from '../helpers';

describe('[code-analyzer] › Parsed tree visitor', () => {

  const nullVisitor = new NullVisitor();
  const nodeVisitor = new NodeVisitor();
  const treeVisitor = new TreeVisitor();

  test('Visit ArrayLiteral', () => {
    const source = 'let a = ["a"]';
    const result = getParsedResult(source) as any;
    const variable = result.nodes[0].value as ParseArrayLiteral;

    const visitArrayLiteralFn = jest.spyOn(treeVisitor, 'visitArrayLiteral');

    expect(nullVisitor.visit(variable)).toBeNull();
    expect(nodeVisitor.visit(variable)).toBeInstanceOf(ParseArrayLiteral);
    expect(nodeVisitor.visit(variable)).toBe(variable);
    expect(visitArrayLiteralFn).not.toHaveBeenCalled();
    treeVisitor.visit(variable);
    expect(visitArrayLiteralFn).toHaveBeenCalledWith(variable);
    expect(visitArrayLiteralFn).toReturnWith(variable);
    visitArrayLiteralFn.mockRestore();
  });

  test('Visit ParseArrayType', () => {
    const source = 'let a: string[]';
    const result = getParsedResult(source) as any;
    const arrayType = result.nodes[0].type as ParseArrayType;

    const visitArrayTypeFn = jest.spyOn(treeVisitor, 'visitArrayType');
    const visitPrimitiveTypeFn = jest.spyOn(treeVisitor, 'visitPrimitiveType');
    const visitFn = jest.spyOn(treeVisitor, 'visit');

    expect(nullVisitor.visit(arrayType)).toBeNull();
    expect(nodeVisitor.visit(arrayType)).toBeInstanceOf(ParseArrayType);
    expect(nodeVisitor.visit(arrayType)).toBe(arrayType);
    expect(visitArrayTypeFn).not.toHaveBeenCalled();
    expect(visitFn).toHaveBeenCalledTimes(0);
    treeVisitor.visit(arrayType);
    expect(visitArrayTypeFn).toHaveBeenCalledWith(arrayType);
    // visit function was called on arrayType and on visiting the type
    // visiting the primitive type
    expect(visitFn).toHaveBeenCalledTimes(2);
    expect(visitPrimitiveTypeFn).toHaveBeenCalledTimes(1);
    expect(visitPrimitiveTypeFn).toHaveBeenCalledWith(arrayType.type);
    expect(visitPrimitiveTypeFn).toReturnWith(arrayType.type);
    visitPrimitiveTypeFn.mockRestore();
    visitArrayTypeFn.mockRestore();
    visitFn.mockRestore();
  });

  test('Visit ClassDeclaration', () => {
    const source = 'class a {}';
    const result = getParsedResult(source) as any;
    const classDec = result.nodes[0] as ParseClassDeclaration;

    const visitClassDeclarationFn = jest.spyOn(treeVisitor, 'visitClassDeclaration');

    expect(nullVisitor.visit(classDec)).toBeNull();
    expect(nodeVisitor.visit(classDec)).toBeInstanceOf(ParseClassDeclaration);
    expect(nodeVisitor.visit(classDec)).toBe(classDec);
    expect(visitClassDeclarationFn).not.toHaveBeenCalled();
    treeVisitor.visit(classDec);
    expect(visitClassDeclarationFn).toHaveBeenCalledWith(classDec);
    expect(visitClassDeclarationFn).toReturnWith(classDec);
    visitClassDeclarationFn.mockRestore();
  });

  test('Visit Decorator', () => {
    const source = '@Component() class a {}';
    const result = getParsedResult(source) as any;
    const decorator = result.nodes[0].decorators[0] as ParseDecorator;

    const visitDecoratorFn = jest.spyOn(treeVisitor, 'visitDecorator');

    expect(nullVisitor.visit(decorator)).toBeNull();
    expect(nodeVisitor.visit(decorator)).toBeInstanceOf(ParseDecorator);
    expect(nodeVisitor.visit(decorator)).toBe(decorator);
    expect(visitDecoratorFn).not.toHaveBeenCalled();
    treeVisitor.visit(decorator);
    expect(visitDecoratorFn).toHaveBeenCalledWith(decorator);
    expect(visitDecoratorFn).toReturnWith(decorator);
    visitDecoratorFn.mockRestore();
  });

  test('visiting definition is only used for extending, should always return null', () => {
    const definition = new ParseDefinition(new ParseLocation('test.ts', 0), 'definition', []);
    expect(nullVisitor.visit(definition)).toBeNull();
    expect(nodeVisitor.visit(definition)).toBeNull();
    expect(treeVisitor.visit(definition)).toBeNull();
  });

  test('visiting dependency should always return null, only used for creating a dependency tree', () => {
    const dependency = new ParseDependency(new ParseLocation('test.ts', 0), './file.ts', new Set());
    expect(nullVisitor.visit(dependency)).toBeNull();
    expect(nodeVisitor.visit(dependency)).toBeNull();
    expect(treeVisitor.visit(dependency)).toBeNull();
  });

  test('Visit Expression', () => {
    const source = 'const x = myFunction("myStringValue")';
    const result = getParsedResult(source) as any;
    const expr = result.nodes[0].value as ParseExpression;

    const visitExpressionFn = jest.spyOn(treeVisitor, 'visitExpression');

    expect(nullVisitor.visit(expr)).toBeNull();
    expect(nodeVisitor.visit(expr)).toBeInstanceOf(ParseExpression);
    expect(nodeVisitor.visit(expr)).toBe(expr);
    expect(visitExpressionFn).not.toHaveBeenCalled();
    treeVisitor.visit(expr);
    expect(visitExpressionFn).toHaveBeenCalledWith(expr);
    expect(visitExpressionFn).toReturnWith(expr);
    visitExpressionFn.mockRestore();
  });

  test('Visit Generic', () => {
    const generic = new ParseGeneric(new ParseLocation('./file.ts', 85), 'T');
    const visitGenericFn = jest.spyOn(treeVisitor, 'visitGeneric');

    expect(nullVisitor.visit(generic)).toBeNull();
    expect(nodeVisitor.visit(generic)).toBeInstanceOf(ParseGeneric);
    expect(nodeVisitor.visit(generic)).toBe(generic);
    expect(visitGenericFn).not.toHaveBeenCalled();
    treeVisitor.visit(generic);
    expect(visitGenericFn).toHaveBeenCalledWith(generic);
    expect(visitGenericFn).toReturnWith(generic);
    visitGenericFn.mockRestore();
  });

  test('Visit Generic that was filled with a value, it should return the value instead of the generic', () => {
    const location = new ParseLocation('./other-file.ts', 80);
    const value = new ParseValueType(location, 'value');
    const generic = new ParseGeneric(new ParseLocation('./file.ts', 85), 'T');
    generic.value = value;
    const visitFn = jest.spyOn(treeVisitor, 'visit');

    expect(visitFn).not.toHaveBeenCalled();
    treeVisitor.visit(generic);
    expect(visitFn).toHaveBeenCalledWith(generic.value);
    // now it should return the value of the generic
    expect(visitFn).toReturnWith(generic.value);
    visitFn.mockRestore();
  });

  test('Visit IndexSignature', () => {
    const source = 'interface test { [key: string]: any }';
    const result = getParsedResult(source) as any;
    const indexSig = result.nodes[0].members[0] as ParseIndexSignature;

    const visitIndexSignatureFn = jest.spyOn(treeVisitor, 'visitIndexSignature');

    expect(nullVisitor.visit(indexSig)).toBeNull();
    expect(nodeVisitor.visit(indexSig)).toBeInstanceOf(ParseIndexSignature);
    expect(nodeVisitor.visit(indexSig)).toBe(indexSig);
    expect(visitIndexSignatureFn).not.toHaveBeenCalled();
    treeVisitor.visit(indexSig);
    expect(visitIndexSignatureFn).toHaveBeenCalledWith(indexSig);
    expect(visitIndexSignatureFn).toReturnWith(indexSig);
    visitIndexSignatureFn.mockRestore();
  });

  test('Visit InterfaceDeclaration', () => {
    const source = 'interface test { [key: string]: any }';
    const result = getParsedResult(source) as any;
    const interfaceDec = result.nodes[0] as ParseInterfaceDeclaration;

    const visitInterfaceDeclarationFn = jest.spyOn(treeVisitor, 'visitInterfaceDeclaration');

    expect(nullVisitor.visit(interfaceDec)).toBeNull();
    expect(nodeVisitor.visit(interfaceDec)).toBeInstanceOf(ParseInterfaceDeclaration);
    expect(nodeVisitor.visit(interfaceDec)).toBe(interfaceDec);
    expect(visitInterfaceDeclarationFn).not.toHaveBeenCalled();
    treeVisitor.visit(interfaceDec);
    expect(visitInterfaceDeclarationFn).toHaveBeenCalledWith(interfaceDec);
    visitInterfaceDeclarationFn.mockRestore();
  });

  test('Visit IntersectionType', () => {
    const source = 'type x = A & B';
    const result = getParsedResult(source) as any;
    const intersectionType = result.nodes[0].type as ParseIntersectionType;

    const visitIntersectionTypeFn = jest.spyOn(treeVisitor, 'visitIntersectionType');

    expect(nullVisitor.visit(intersectionType)).toBeNull();
    expect(nodeVisitor.visit(intersectionType)).toBeInstanceOf(ParseIntersectionType);
    expect(nodeVisitor.visit(intersectionType)).toBe(intersectionType);
    expect(visitIntersectionTypeFn).not.toHaveBeenCalled();
    treeVisitor.visit(intersectionType);
    expect(visitIntersectionTypeFn).toHaveBeenCalledWith(intersectionType);
    expect(visitIntersectionTypeFn).toReturnWith(intersectionType);
    visitIntersectionTypeFn.mockRestore();
  });

  test('Visit Method', () => {
    const source = 'function f() {}';
    const result = getParsedResult(source) as any;
    const method = result.nodes[0] as ParseMethod;

    const visitMethodFn = jest.spyOn(treeVisitor, 'visitMethod');

    expect(nullVisitor.visit(method)).toBeNull();
    expect(nodeVisitor.visit(method)).toBeInstanceOf(ParseMethod);
    expect(nodeVisitor.visit(method)).toBe(method);
    expect(visitMethodFn).not.toHaveBeenCalled();
    treeVisitor.visit(method);
    expect(visitMethodFn).toHaveBeenCalledWith(method);
    expect(visitMethodFn).toReturnWith(method);
    visitMethodFn.mockRestore();
  });

  test('visiting a parsed node should always return null, is only used for extending', () => {
    const node = new ParseNode(new ParseLocation('test.ts', 0));
    expect(nullVisitor.visit(node)).toBeNull();
    expect(nodeVisitor.visit(node)).toBeNull();
    expect(treeVisitor.visit(node)).toBeNull();
  });

  test('Visit ObjectLiteral', () => {
    const source = 'const x = {a: "b"}';
    const result = getParsedResult(source) as any;
    const obj = result.nodes[0].value as ParseObjectLiteral;

    const visitObjectLiteralFn = jest.spyOn(treeVisitor, 'visitObjectLiteral');

    expect(nullVisitor.visit(obj)).toBeNull();
    expect(nodeVisitor.visit(obj)).toBeInstanceOf(ParseObjectLiteral);
    expect(nodeVisitor.visit(obj)).toBe(obj);
    expect(visitObjectLiteralFn).not.toHaveBeenCalled();
    treeVisitor.visit(obj);
    expect(visitObjectLiteralFn).toHaveBeenCalledWith(obj);
    expect(visitObjectLiteralFn).toReturnWith(obj);
    visitObjectLiteralFn.mockRestore();
  });

  test('Visit ParenthesizedType', () => {
    const source = 'type a = (string | number)[]';
    const result = getParsedResult(source) as any;
    const node = result.nodes[0].type.type as ParseParenthesizedType;

    const visitParenthesizedTypeFn = jest.spyOn(treeVisitor, 'visitParenthesizedType');

    expect(nullVisitor.visit(node)).toBeNull();
    expect(nodeVisitor.visit(node)).toBeInstanceOf(ParseParenthesizedType);
    expect(nodeVisitor.visit(node)).toBe(node);
    expect(visitParenthesizedTypeFn).not.toHaveBeenCalled();
    treeVisitor.visit(node);
    expect(visitParenthesizedTypeFn).toHaveBeenCalledWith(node);
    expect(visitParenthesizedTypeFn).toReturnWith(node);
    visitParenthesizedTypeFn.mockRestore();
  });

  test('Visit PrimitiveType', () => {
    const source = 'type a = string';
    const result = getParsedResult(source) as any;
    const node = result.nodes[0].type as ParsePrimitiveType;

    const visitPrimitiveTypeFn = jest.spyOn(treeVisitor, 'visitPrimitiveType');

    expect(nullVisitor.visit(node)).toBeNull();
    expect(nodeVisitor.visit(node)).toBeInstanceOf(ParsePrimitiveType);
    expect(nodeVisitor.visit(node)).toBe(node);
    expect(visitPrimitiveTypeFn).not.toHaveBeenCalled();
    treeVisitor.visit(node);
    expect(visitPrimitiveTypeFn).toHaveBeenCalledWith(node);
    expect(visitPrimitiveTypeFn).toReturnWith(node);
    visitPrimitiveTypeFn.mockRestore();
  });

  test('Visit Property', () => {
    const source = 'class a { two = 2 }';
    const result = getParsedResult(source) as any;
    const node = result.nodes[0].members[0] as ParseProperty;

    const visitPropertyFn = jest.spyOn(treeVisitor, 'visitProperty');

    expect(nullVisitor.visit(node)).toBeNull();
    expect(nodeVisitor.visit(node)).toBeInstanceOf(ParseProperty);
    expect(nodeVisitor.visit(node)).toBe(node);
    expect(visitPropertyFn).not.toHaveBeenCalled();
    treeVisitor.visit(node);
    expect(visitPropertyFn).toHaveBeenCalledWith(node);
    expect(visitPropertyFn).toReturnWith(node);
    visitPropertyFn.mockRestore();
  });

  test('Visit ReferenceType', () => {
    const source = 'type x = A';
    const result = getParsedResult(source) as any;
    const node = result.nodes[0].type as ParseReferenceType;

    const visitReferenceTypeFn = jest.spyOn(treeVisitor, 'visitReferenceType');

    expect(nullVisitor.visit(node)).toBeNull();
    expect(nodeVisitor.visit(node)).toBeInstanceOf(ParseReferenceType);
    expect(nodeVisitor.visit(node)).toBe(node);
    expect(visitReferenceTypeFn).not.toHaveBeenCalled();
    treeVisitor.visit(node);
    expect(visitReferenceTypeFn).toHaveBeenCalledWith(node);
    expect(visitReferenceTypeFn).toReturnWith(node);
    visitReferenceTypeFn.mockRestore();
  });

  test('Visit Result', () => {
    const source = 'type x = A';
    const result = getParsedResult(source);

    const visitResultFn = jest.spyOn(treeVisitor, 'visitResult');

    expect(nullVisitor.visit(result)).toBeNull();
    expect(nodeVisitor.visit(result)).toBeInstanceOf(ParseResult);
    expect(nodeVisitor.visit(result)).toBe(result);
    expect(visitResultFn).not.toHaveBeenCalled();
    treeVisitor.visit(result);
    expect(visitResultFn).toHaveBeenCalledWith(result);
    expect(visitResultFn).toReturnWith(result);
    visitResultFn.mockRestore();
  });

  test('Visit TypeAliasDeclaration', () => {
    const source = 'type x = A';
    const result = getParsedResult(source) as any;
    const node = result.nodes[0] as ParseTypeAliasDeclaration;

    const visitTypeAliasDeclarationFn = jest.spyOn(treeVisitor, 'visitTypeAliasDeclaration');

    expect(nullVisitor.visit(node)).toBeNull();
    expect(nodeVisitor.visit(node)).toBeInstanceOf(ParseTypeAliasDeclaration);
    expect(nodeVisitor.visit(node)).toBe(node);
    expect(visitTypeAliasDeclarationFn).not.toHaveBeenCalled();
    treeVisitor.visit(node);
    expect(visitTypeAliasDeclarationFn).toHaveBeenCalledWith(node);
    expect(visitTypeAliasDeclarationFn).toReturnWith(node);
    visitTypeAliasDeclarationFn.mockRestore();
  });

  test('Visit TypeLiteral', () => {
    const source = 'interface a { b: string; c: { d: number }}';
    const result = getParsedResult(source) as any;
    const node = result.nodes[0].members[1].type as ParseTypeLiteral;

    const visitTypeLiteralFn = jest.spyOn(treeVisitor, 'visitTypeLiteral');

    expect(nullVisitor.visit(node)).toBeNull();
    expect(nodeVisitor.visit(node)).toBeInstanceOf(ParseTypeLiteral);
    expect(nodeVisitor.visit(node)).toBe(node);
    expect(visitTypeLiteralFn).not.toHaveBeenCalled();
    treeVisitor.visit(node);
    expect(visitTypeLiteralFn).toHaveBeenCalledWith(node);
    expect(visitTypeLiteralFn).toReturnWith(node);
    visitTypeLiteralFn.mockRestore();
  });

  test('Visit TypeParameter', () => {
    const source = 'type myType<T> = () => T';
    const result = getParsedResult(source) as any;
    const node = result.nodes[0].typeParameters[0] as ParseTypeParameter;

    const visitTypeParameterFn = jest.spyOn(treeVisitor, 'visitTypeParameter');

    expect(nullVisitor.visit(node)).toBeNull();
    expect(nodeVisitor.visit(node)).toBeInstanceOf(ParseTypeParameter);
    expect(nodeVisitor.visit(node)).toBe(node);
    expect(visitTypeParameterFn).not.toHaveBeenCalled();
    treeVisitor.visit(node);
    expect(visitTypeParameterFn).toHaveBeenCalledWith(node);
    expect(visitTypeParameterFn).toReturnWith(node);
    visitTypeParameterFn.mockRestore();
  });

  test('Visit UnionType', () => {
    const source = 'type a = number | string';
    const result = getParsedResult(source) as any;
    const node = result.nodes[0].type as ParseUnionType;

    const visitUnionTypeFn = jest.spyOn(treeVisitor, 'visitUnionType');

    expect(nullVisitor.visit(node)).toBeNull();
    expect(nodeVisitor.visit(node)).toBeInstanceOf(ParseUnionType);
    expect(nodeVisitor.visit(node)).toBe(node);
    expect(visitUnionTypeFn).not.toHaveBeenCalled();
    treeVisitor.visit(node);
    expect(visitUnionTypeFn).toHaveBeenCalledWith(node);
    expect(visitUnionTypeFn).toReturnWith(node);
    visitUnionTypeFn.mockRestore();
  });

  test('Visit ValueType', () => {
    const source = 'type hasToBeTrue = true';
    const result = getParsedResult(source) as any;
    const node = result.nodes[0].type as ParseValueType;

    const visitValueTypeFn = jest.spyOn(treeVisitor, 'visitValueType');

    expect(nullVisitor.visit(node)).toBeNull();
    expect(nodeVisitor.visit(node)).toBeInstanceOf(ParseValueType);
    expect(nodeVisitor.visit(node)).toBe(node);
    expect(visitValueTypeFn).not.toHaveBeenCalled();
    treeVisitor.visit(node);
    expect(visitValueTypeFn).toHaveBeenCalledWith(node);
    expect(visitValueTypeFn).toReturnWith(node);
    visitValueTypeFn.mockRestore();
  });

  test('Visit VariableDeclaration', () => {
    const source = 'let a = ["a"]';
    const result = getParsedResult(source) as any;
    const variable = result.nodes[0] as ParseVariableDeclaration;

    const visitVariableDeclarationFn = jest.spyOn(treeVisitor, 'visitVariableDeclaration');

    expect(nullVisitor.visit(variable)).toBeNull();
    expect(nodeVisitor.visit(variable)).toBeInstanceOf(ParseVariableDeclaration);
    expect(nodeVisitor.visit(variable)).toBe(variable);
    expect(visitVariableDeclarationFn).not.toHaveBeenCalled();
    treeVisitor.visit(variable);
    expect(visitVariableDeclarationFn).toHaveBeenCalledWith(variable);
    expect(visitVariableDeclarationFn).toReturnWith(variable);
    visitVariableDeclarationFn.mockRestore();
  });
});

describe('[code-analyzer] › Reference tree visitor', () => {

  test('Collecting generics from ClassDeclaration', () => {
    const refTreeVisitor = new ReferenceTreeVisitor();
    const source = 'class a<T> { method<T>(...args: any[]): T { return null;}}';
    const result = getParsedResult(source) as any;
    const node = result.nodes[0] as ParseClassDeclaration;

    const visitClassDeclarationFn = jest.spyOn(refTreeVisitor, 'visitClassDeclaration');

    const lookupTable = refTreeVisitor.lookupTable;

    expect(lookupTable.size).toBe(0);
    expect(visitClassDeclarationFn).not.toBeCalled();
    refTreeVisitor.visit(node);
    expect(lookupTable.size).toBe(1);
    expect([...lookupTable.get('test-case.ts').values()][0]).toBe('T');
    visitClassDeclarationFn.mockRestore();
  });

  test('Collecting generics from TypeAliasDeclaration', () => {
    const refTreeVisitor = new ReferenceTreeVisitor();
    const source = 'type myFunc<T> = () => T';
    const result = getParsedResult(source) as any;
    const node = result.nodes[0] as ParseClassDeclaration;

    const visitTypeAliasDeclarationFn = jest.spyOn(refTreeVisitor, 'visitTypeAliasDeclaration');

    const lookupTable = refTreeVisitor.lookupTable;

    expect(lookupTable.size).toBe(0);
    expect(visitTypeAliasDeclarationFn).not.toBeCalled();
    refTreeVisitor.visit(node);
    expect(lookupTable.size).toBe(1);
    expect([...lookupTable.get('test-case.ts').values()][0]).toBe('T');
    visitTypeAliasDeclarationFn.mockRestore();
  });

  test('Adding generic to existing lookup table to the same file', () => {
    const refTreeVisitor = new ReferenceTreeVisitor();
    const source = 'type myFunc<T> = () => T; type secondFunc<P> = () => P';
    const result = getParsedResult(source) as any;

    const lookupTable = refTreeVisitor.lookupTable;

    expect(lookupTable.size).toBe(0);
    refTreeVisitor.visit(result.nodes[0]);
    expect(lookupTable.size).toBe(1);
    expect(lookupTable.get('test-case.ts').size).toBe(1);
    expect([...lookupTable.get('test-case.ts').values()][0]).toBe('T');

    refTreeVisitor.visit(result.nodes[1]);
    expect(lookupTable.size).toBe(1);
    expect(lookupTable.get('test-case.ts').size).toBe(2);

  });
});
