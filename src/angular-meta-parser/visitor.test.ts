import * as fs from 'fs';
import * as ts from 'typescript';
import * as path from 'path';

import { delDir, readFile } from '@utils';
import { Visitor } from './visitor';

const COMPONENTS = [
  path.join(__dirname, 'fixtures/button.ts'),
];

describe('➡ Angular AST Transformer', () => {
  const sourceFiles: ts.SourceFile[] = [];

  beforeAll((done) => {
    COMPONENTS.forEach(async (fileName: string) => {
      const sourceText = await readFile(fileName).toString();
      sourceFiles.push(
        ts.createSourceFile(
          fileName,
          sourceText,
          ts.ScriptTarget.ES2015,
          true, // setParentNodes
        ),
      );
      done();
    });
  });

  describe('Source File generation', () => {
    it('shoud generate ts.SourceFile[] form components', () => {
      expect(sourceFiles.length).toBe(COMPONENTS.length);
      sourceFiles.forEach((file) => {
        const visitor = new Visitor(file.fileName);
        visitor.visit(file);
        expect(file).not.toBeUndefined();
      });
    });
  });

});
