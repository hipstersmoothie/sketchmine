import * as ts from 'typescript';
import { visitJsDoc } from './visit-jsdoc';

const jsdoc = `/**
 * Some variable description
 * @design-unrelated
 */`;

const jsdocOneline = '/** @design-unrelated */';

const comment = `
${jsdoc}
export const variableName = 'asdf';`;

const onelineComment = `
${jsdocOneline}
export const variableName = 'asdf';`;

const doulbeComment = `
${jsdoc}
${jsdocOneline}
export const variableName = 'asdf';`;

describe('[angular-meta-paser] › utils › visit jsdoc comments', () => {

  test('if the jsdoc comment get extracted from the node', () => {
    const sourceFile = ts.createSourceFile(
      'testfile.ts',
      comment,
      ts.ScriptTarget.Latest,
      true,
    );
    const doc = visitJsDoc(sourceFile.statements[0]);
    expect(doc).toEqual(jsdoc);
  });

  test('if the one line jsdoc comment get extracted from the node', () => {
    const sourceFile = ts.createSourceFile(
      'testfile.ts',
      onelineComment,
      ts.ScriptTarget.Latest,
      true,
    );
    const doc = visitJsDoc(sourceFile.statements[0]);
    expect(doc).toEqual(jsdocOneline);
  });

  test('if two jsdoc comments get extracted from the node', () => {
    const sourceFile = ts.createSourceFile(
      'testfile.ts',
      doulbeComment,
      ts.ScriptTarget.Latest,
      true,
    );
    const doc = visitJsDoc(sourceFile.statements[0]);
    expect(doc).toMatch(`${jsdoc}\n${jsdocOneline}`);
  });

});
