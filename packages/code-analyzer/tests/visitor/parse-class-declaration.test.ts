import {
  ParseLocation,
  ParseProperty,
  ParsePrimitiveType,
  ParseMethod,
  ParseTypeParameter,
  ParseReferenceType,
  ParseValueType,
  ParseClassDeclaration,
  ParseDecorator,
  ParseObjectLiteral,
  ParseEmpty,
  ParseArrayLiteral,
} from '../../src/v2/parsed-nodes';
import { getResult } from './get-result';

describe('[code-analyzer] › ParseClassDeclaration', () => {

  test('detecting classes', () => {
    const source = 'class Test {}';
    const result = getResult(source).nodes[0];
    expect(result).toBeInstanceOf(ParseClassDeclaration);
    expect(result.tags).toHaveLength(0);
    expect(result.name).toBe('Test');
    expect((<ParseClassDeclaration>result).members).toHaveLength(0);
    expect(result.location).toBeInstanceOf(ParseLocation);
  });

  test('class has multiple members with different keywords', () => {
    const source = 'class Test { a: number; private b: string = "my-value"; }';
    const result = getResult(source).nodes[0] as ParseClassDeclaration;
    expect(result).toBeInstanceOf(ParseClassDeclaration);
    expect(result.tags).toHaveLength(0);
    const members = result.members as ParseProperty[];
    expect(members).toHaveLength(2);
    expect((members[0].type as ParsePrimitiveType).type).toBe('number');
    expect((members[0].type as any).type.value).toBeUndefined();
    expect((members[1].type as ParsePrimitiveType).type).toBe('string');
    expect(members[1].tags).toHaveLength(1);
    expect(members[1].tags[0]).toBe('private');
    expect((members[1].value as any).value).toMatch(/my-value/);
  });

  test('class has heritage clauses', () => {
    const source = `
    class Test implements hasUnderscore extends MethodA {
      _hasUnderscore = false;
      constructor() {}
      private method(b: string): void {}
      public methodB(a: number): boolean { return true;}
    }`;
    const result = getResult(source).nodes[0] as ParseClassDeclaration;
    expect(result).toBeInstanceOf(ParseClassDeclaration);
    expect(result.tags).toHaveLength(0);
    const extending = result.extending;
    expect(extending).toBeInstanceOf(ParseReferenceType);
    expect(extending.name).toBe('MethodA');

    const implementing = result.implementing;
    expect(implementing).toHaveLength(1);
    expect(implementing[0]).toBeInstanceOf(ParseReferenceType);
    expect(implementing[0].name).toBe('hasUnderscore');

    expect(result.isAngularComponent()).toBe(false);
  });

  test('class is Angular Component', () => {
    const source = `
    @Component()
    class TestComponent implements OnDestroy {
      ngOnDestroy(): void { }
    }`;
    const result = getResult(source).nodes[0] as ParseClassDeclaration;
    expect(result.isAngularComponent()).toBe(true);

    expect(result.decorators).toHaveLength(1);
    expect(result.decorators[0]).toBeInstanceOf(ParseDecorator);
    expect(result.decorators[0].args).toHaveLength(0);
  });

  test('class is Angular Component', () => {
    const source = `
    @Component({
      selector: 'button[dt-button]',
    })
    class TestComponent implements OnDestroy {
      ngOnDestroy(): void { }
    }`;
    const result = getResult(source).nodes[0] as ParseClassDeclaration;
    expect(result.isAngularComponent()).toBe(true);

    expect(result.decorators).toHaveLength(1);
    expect(result.decorators[0]).toBeInstanceOf(ParseDecorator);
    expect(result.decorators[0].args).toHaveLength(1);
    expect(result.decorators[0].args[0]).toBeInstanceOf(ParseObjectLiteral);

    const props = (<any>result).decorators[0].args[0].properties;
    expect(props).toHaveLength(1);
    expect(props[0]).toBeInstanceOf(ParseProperty);
    expect(props[0].name).toBe('selector');
    expect(props[0].value).toBeInstanceOf(ParseValueType);
    expect(props[0].value.value).toMatch('button[dt-button]');
  });

  test('class has no members when only params are in the constructor', () => {
    const source = `
    class TestComponent {
      constructor(...args: any[])
    }`;
    const result = getResult(source).nodes[0] as ParseClassDeclaration;
    expect(result.members).toHaveLength(0);
  });

  test('class has public properties in constructor', () => {
    const source = `
    class TestComponent {
      constructor(public isCool: boolean, ...args: any[])
    }`;
    const result = getResult(source).nodes[0] as ParseClassDeclaration;
    expect(result.members).toHaveLength(1);
    expect(result.members[0]).toBeInstanceOf(ParseProperty);

    const prop = result.members[0] as ParseProperty;
    expect(prop.name).toBe('isCool');
    expect(prop.value).toBeUndefined();
    expect(prop.type).toBeInstanceOf(ParsePrimitiveType);
    expect((<any>prop).type.type).toBe('boolean');
  });

  test('class has getter members', () => {
    const source = `
    class TestComponent {
      private _x = 1;
      get x(): number { return this._x; }
    }`;
    const result = getResult(source).nodes[0] as ParseClassDeclaration;
    expect(result.members).toHaveLength(2);
    expect(result.members[0]).toBeInstanceOf(ParseProperty);
    expect(result.members[1]).toBeInstanceOf(ParseProperty);

    const prop = result.members[0] as ParseProperty;
    expect(prop.name).toBe('_x');
    expect(prop.value).toBeInstanceOf(ParseValueType);
    expect(prop.type).toBeInstanceOf(ParseEmpty);
    expect((<any>prop).value.value).toBe(1);

    const getter = result.members[1] as ParseProperty;
    expect(getter.name).toBe('x');
    expect(getter.value).toBeUndefined();
    expect(getter.type).toBeInstanceOf(ParsePrimitiveType);
    expect((<any>getter).type.type).toBe('number');
  });

  test('class has setter members', () => {
    const source = `
    class TestComponent {
      private _x = 1;
      set x(n: number): void { this._x = n; }
      get x(): number { return this._x; }
    }`;
    const result = getResult(source).nodes[0] as ParseClassDeclaration;
    expect(result.members).toHaveLength(3);
    expect(result.members[0]).toBeInstanceOf(ParseProperty);
    expect(result.members[1]).toBeInstanceOf(ParseMethod);
    expect(result.members[2]).toBeInstanceOf(ParseProperty);

    const setter = result.members[1] as ParseMethod;
    expect(setter.name).toBe('x');
    expect(setter.parameters).toHaveLength(1);
    expect(setter.returnType).toBeInstanceOf(ParseValueType);
    expect((<any>setter).returnType.value).toBe('void');
    expect(setter.parameters[0]).toBeInstanceOf(ParseProperty);
    expect(setter.parameters[0].name).toBe('n');
    expect(setter.parameters[0].type).toBeInstanceOf(ParsePrimitiveType);
    expect((<any>setter).parameters[0].type.type).toBe('number');
  });

  test('class has @Input decorator on setter', () => {
    const source = `
    class TestComponent {
      private _x = 1;
      @Input()
      set x(n: number): void { this._x = n; }
    }`;
    const result = getResult(source).nodes[0] as ParseClassDeclaration;
    expect(result.members).toHaveLength(2);
    expect(result.members[1]).toBeInstanceOf(ParseMethod);
    const setter = result.members[1] as ParseMethod;
    expect(setter.decorators).toHaveLength(1);
    expect(setter.decorators[0].name).toBe('Input');
    expect(setter.decorators[0].args).toHaveLength(0);
  });

  test('class has @Input and @HostListener decorators on property', () => {
    const source = `
    @Component()
    class TestComponent {
      @Input()
      @HostListener('click', ['$event'])
      onClick: Function;
    }`;
    const result = getResult(source).nodes[0] as ParseClassDeclaration;
    expect(result.members).toHaveLength(1);
    const fn = result.members[0] as ParseProperty;
    expect(fn).toBeInstanceOf(ParseProperty);
    expect(fn.name).toBe('onClick');
    expect(fn.decorators).toHaveLength(2);
    expect(fn.decorators[0].name).toBe('Input');
    expect(fn.decorators[0].args).toHaveLength(0);
    expect(fn.decorators[1].name).toBe('HostListener');
    expect(fn.decorators[1].args).toHaveLength(2);
    const hostListener = fn.decorators[1].args as any[];
    expect(hostListener[0]).toBeInstanceOf(ParseValueType);
    expect(hostListener[0].value).toMatch('click');
    expect(hostListener[1]).toBeInstanceOf(ParseArrayLiteral);
    expect(hostListener[1].values[0]).toBeInstanceOf(ParseValueType);
    expect(hostListener[1].values[0].value).toMatch('$event');
  });

  test('class has a generic as typeParameter', () => {
    const source = `
    class TestComponent<T> {
      method: T;
    }`;
    const result = getResult(source).nodes[0] as ParseClassDeclaration;
    expect(result.typeParameters).toHaveLength(1);
    expect(result.typeParameters[0]).toBeInstanceOf(ParseTypeParameter);
    expect(result.typeParameters[0].name).toBe('T');
    expect(result.typeParameters[0].constraint).toBeUndefined();
  });

  test('class has a generic as typeParameter that has a constraint', () => {
    const source = `
    class TestComponent<T extends P> {
      method: T;
    }`;
    const result = getResult(source).nodes[0] as any;
    expect(result.typeParameters[0].constraint).toBeInstanceOf(ParseReferenceType);
    expect(result.typeParameters[0].constraint.name).toBe('P');
  });

  test('class is exported', () => {
    const source = 'export class TestComponent { }';
    const result = getResult(source).nodes[0] as ParseClassDeclaration;
    expect(result.tags).toHaveLength(1);
    expect(result.tags[0]).toBe('exported');
  });

  test('class is design unrelated', () => {
    const source = '/** @design-unrelated */export class TestComponent { }';
    const result = getResult(source).nodes[0] as ParseClassDeclaration;
    expect(result.tags).toHaveLength(2);
    expect(result.tags).toEqual(
      expect.arrayContaining(['exported', 'unrelated']),
    );
  });

  test('component has no design combination', () => {
    const source = `
      /**
       * @design-unrelated
       * @no-design-combinations
       */
      @Component()
      export class TestComponent { }`;
    const result = getResult(source).nodes[0] as ParseClassDeclaration;
    expect(result.tags).toHaveLength(3);
    expect(result.tags).toEqual(
      expect.arrayContaining(['exported', 'unrelated', 'noCombinations']),
    );
  });
});
