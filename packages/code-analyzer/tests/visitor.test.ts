import * as ts from 'typescript';
import { ParseResult, ParseComponent, ParseProperty, ParseReferenceType, ParseDependency } from '../src/ast';
import { tsVisitorFactory } from '../src/visitor';

import * as fs from 'fs';

const TEST_FILE_PATH = `${process.cwd()}/tests/fixtures/button.ts`;

describe('[code-analyzer] › visitor', () => {
  let sourceFile: ts.SourceFile;

  beforeAll(() => {
    const file = fs.readFileSync(TEST_FILE_PATH).toString();
    sourceFile = ts.createSourceFile(
      TEST_FILE_PATH,
      file,
      ts.ScriptTarget.Latest,
      true,
    );
  });

  it('should have generated a ts.Sourcefile from the testfile.', () => {
    expect(sourceFile).not.toBeUndefined();
    expect(sourceFile.fileName).toBe(TEST_FILE_PATH);
    expect(sourceFile.statements.length).toBeGreaterThan(0);
  });

  describe('generate typescript visitorFactory', () => {
    let result: ParseResult;

    beforeAll(() => {
      const paths = new Map<string, string>();
      const visitor = tsVisitorFactory(paths, '');
      result = visitor(sourceFile);
    });

    it('should generate the factory to visit the source file', () => {
      expect(result).toBeInstanceOf(ParseResult);
    });

    it('should add one file to the dependency path', () => {
      expect(result.dependencyPaths.length).toBe(1);
      expect(result.dependencyPaths[0]).toBeInstanceOf(ParseDependency);
    });

    describe('sholud contain component', () => {
      let component;
      let comp: ParseComponent;
      beforeAll(() => {
        component = result.nodes.filter(node => node instanceof ParseComponent) as ParseComponent[];
        comp = component[0];
      });
      it('exist is in AST', () => {
        expect(component.length).toBe(1);
        expect(comp).not.toBeUndefined();
        expect(comp.location.path).toBe(TEST_FILE_PATH);
      });
      it('should have correct className', () => {
        expect(comp.name).toBe('DtButton');
      });
      it('should have selector', () => {
        expect(comp.selector).toBeInstanceOf(Array);
        expect(comp.selector.length).toBe(2);
      });
      it('sholud contain JSDoc annotations in comment', () => {
        expect(comp.tags).toContain('unrelated');
        expect(comp.clickable).toBeTruthy();
        expect(comp.hoverable).toBeTruthy();
      });

      it('should have three members', () => {
        expect(comp.members).toBeInstanceOf(Array);
        expect(comp.members.length).toBe(3);
        comp.members.forEach((member) => {
          expect(member).toBeInstanceOf(ParseProperty);
        });
      });
      it('Expect third memeber to be a ButtonVariant', () => {
        expect(comp.members[2].type).toBeInstanceOf(ParseReferenceType);
        expect((comp.members[2].type as ParseReferenceType).name).toBe('ButtonVariant');
      });
    });
  });
});
