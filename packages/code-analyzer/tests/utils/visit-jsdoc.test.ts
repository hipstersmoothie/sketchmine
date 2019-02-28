import { createSourceFile, ScriptTarget} from 'typescript';
import { visitJsDoc } from '../../src';

const jsdoc = `/**
 * Some variable description
 * @design-unrelated
 */`;

const jsdocOneLine = '/** @design-unrelated */';

const comment = `
${jsdoc}
export const variableName = 'test';`;

const oneLineComment = `
${jsdocOneLine}
export const variableName = 'test';`;

const doubleComment = `
${jsdoc}
${jsdocOneLine}
export const variableName = 'test';`;

describe('[code-analyzer] › utils › visit jsdoc comments', () => {

  test('if no jsdoc comment is on node return null', () => {
    const sourceFile = createSourceFile('test-file.ts', 'const varName = "a"', ScriptTarget.Latest,  true);
    const doc = visitJsDoc(sourceFile.statements[0]);
    expect(doc).toBeNull();
  });

  test('if the jsdoc comment get extracted from the node', () => {
    const sourceFile = createSourceFile('test-file.ts', comment, ScriptTarget.Latest,  true);
    const doc = visitJsDoc(sourceFile.statements[0]);
    expect(doc).toEqual(jsdoc);
  });

  test('if the one line jsdoc comment get extracted from the node', () => {
    const sourceFile = createSourceFile('test-file.ts', oneLineComment, ScriptTarget.Latest,  true);
    const doc = visitJsDoc(sourceFile.statements[0]);
    expect(doc).toEqual(jsdocOneLine);
  });

  test('if two jsdoc comments get extracted from the node', () => {
    const sourceFile = createSourceFile('test-file.ts', doubleComment, ScriptTarget.Latest,  true);
    const doc = visitJsDoc(sourceFile.statements[0]);
    expect(doc).toMatch(`${jsdoc}\n${jsdocOneLine}`);
  });

});
