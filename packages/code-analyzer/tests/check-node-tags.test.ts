import * as ts from 'typescript';
import { getNodeTags } from '../src';

describe('[code-analyzer] › utils › check node tags', () => {

  test('normal node should return no node tags', () => {
    const code = 'const VARIABLE = "test";';
    const sourceFile = ts.createSourceFile('', code, ts.ScriptTarget.Latest, true);
    const tags = getNodeTags(sourceFile.statements[0]);
    expect(tags).toBeInstanceOf(Array);
    expect(tags).toHaveLength(0);
  });

  test('exported node should contain exported', () => {
    const code = 'export const VARIABLE = "test";';
    const sourceFile = ts.createSourceFile('', code, ts.ScriptTarget.Latest, true);
    const tags = getNodeTags(sourceFile.statements[0]);
    expect(tags).toBeInstanceOf(Array);
    expect(tags).toHaveLength(1);
    expect(tags).toContain('exported');
  });

  test('jsdoc with design unrelated', () => {
    const code = `
/** @design-unrelated */
const VARIABLE = "test";`;
    const sourceFile = ts.createSourceFile('', code, ts.ScriptTarget.Latest, true);
    const tags = getNodeTags(sourceFile.statements[0]);
    expect(tags).toBeInstanceOf(Array);
    expect(tags).toHaveLength(1);
    expect(tags).toContain('unrelated');
  });

  test('jsdoc with design unrelated and internal', () => {
    const code = `
/** @internal */
/** @design-unrelated */
export const VARIABLE = "test";`;
    const sourceFile = ts.createSourceFile('', code, ts.ScriptTarget.Latest, true);
    const tags = getNodeTags(sourceFile.statements[0]);
    expect(tags).toBeInstanceOf(Array);
    expect(tags).toHaveLength(3);
    expect(tags).toContain('internal');
    expect(tags).toContain('unrelated');
    expect(tags).toContain('exported');
  });

  test('jsdoc with underscore variable', () => {
    const code = 'const _underscored = "test";';
    const sourceFile = ts.createSourceFile('', code, ts.ScriptTarget.Latest, true);
    const tags = getNodeTags(sourceFile.statements[0]);
    expect(tags).toBeInstanceOf(Array);
    expect(tags).toHaveLength(1);
    expect(tags).toContain('hasUnderscore');
  });

  test('private property in class', () => {
    const code = `
export class Test {
  private propertyItem: string = 'test';
}
`;
    const sourceFile = ts.createSourceFile('', code, ts.ScriptTarget.Latest, true);
    const tags = getNodeTags((sourceFile.statements[0] as ts.ClassDeclaration).members[0]);
    expect(tags).toBeInstanceOf(Array);
    expect(tags).toHaveLength(1);
    expect(tags).toContain('private');
  });

  test('private property with jsdoc design unrelated in class', () => {
    const code = `
export class Test {
  /** @design-unrelated */
  private propertyItem: string = 'test';
}
`;
    const sourceFile = ts.createSourceFile('', code, ts.ScriptTarget.Latest, true);
    const tags = getNodeTags((sourceFile.statements[0] as ts.ClassDeclaration).members[0]);
    expect(tags).toBeInstanceOf(Array);
    expect(tags).toHaveLength(2);
    expect(tags).toContain('private');
    expect(tags).toContain('unrelated');
  });

  test('component that does not need combinations', () => {
    const code = `
/**
 * some comment for the component
 * @see linktoanything
 * @no-design-combinations
 * @example
 */
@Component({
  moduleId: module.id,
  selector: 'dt-icon',
})
export class DtIcon {
  /** @design-unrelated */
  private propertyItem: string = 'test';
}
`;
    const sourceFile = ts.createSourceFile('', code, ts.ScriptTarget.Latest, true);
    const tags = getNodeTags((sourceFile.statements[0]));
    expect(tags).toBeInstanceOf(Array);
    expect(tags).toHaveLength(2);
    expect(tags).toContain('exported');
    expect(tags).toContain('noCombinations');
  });
});
