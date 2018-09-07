import * as ts from 'typescript';
import * as path from 'path';
import { findNodes, createRoutes, createSketchLibraryModule, createImportDeclaration } from './ast';
import { getSymbolName } from '@angular-meta-parser/utils';
import { createDir } from '@utils';

/**
 * @class
 * @description
 * The MemoryCompiler holds all Source Files for the Variants
 * and compiles them into files and updates the imports for the modules.
 */
export class MemoryCompiler {
  private static _instance: MemoryCompiler;
  protected _sourceFiles: ts.SourceFile[] = [];
  libraryModule: ts.SourceFile;

  constructor() {
    if (MemoryCompiler._instance) {
      return MemoryCompiler._instance;
    }
    MemoryCompiler._instance = this;
  }

  /**
   * adds transformed examples to a list
   * @param sourceFiles SourceFile or array of SourceFiles with the examples
   */
  addSourceFiles(sourceFiles: ts.SourceFile | ts.SourceFile[]) {
    if (Array.isArray(sourceFiles)) {
      this._sourceFiles.push(...sourceFiles);
    } else {
      this._sourceFiles.push(sourceFiles);
    }
  }

  generateModule() {
    const moduleList = this.generateModuleList();
    const modules = [...moduleList.keys()];
    const blank = ts.createSourceFile(
      'sketch-library.module.ts', '', ts.ScriptTarget.Latest, false, ts.ScriptKind.TS,
    );
    const imports: ts.ImportDeclaration[] = [];
    moduleList.forEach((path, name) => {
      imports.push(createImportDeclaration([name], path));
    });

    this.libraryModule = ts.updateSourceFileNode(blank, [
      createImportDeclaration(['NgModule'], '@angular/core'),
      createImportDeclaration(['RouterModule', 'Routes'], '@angular/router'),
      createImportDeclaration(['HttpClientModule'], 'HttpClientModule'),
      createImportDeclaration(['BrowserModule'], '@angular/platform-browser'),
      createImportDeclaration(['AppComponent'], './app.component'),
      ...imports,
      createRoutes(modules),
      createSketchLibraryModule(modules),
    ]);
  }

  private generateModuleList(): Map<string, string> {
    const modules = new Map<string, string>();
    this._sourceFiles.forEach((sf) => {
      const classDec = findNodes(sf, ts.SyntaxKind.ClassDeclaration, 1)[0] as ts.ClassDeclaration;
      const modulePath = sf.fileName;
      modules.set(getSymbolName(classDec), sf.fileName);
    });
    return modules;
  }

  printFiles(writeToFile = false) {

    const baseDir = path.join(process.cwd(), 'dist', 'sketch-library', 'app');
    this.generateModule();

    const files = [...this._sourceFiles, this.libraryModule];
    for (let i = 0, max = files.length; i < max; i += 1) {
      const file = files[i];
      const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
      const resultFile = ts.createSourceFile(file.fileName, '', ts.ScriptTarget.Latest, false, ts.ScriptKind.TS);
      const result = printer.printNode(ts.EmitHint.Unspecified, file, resultFile);
      /** TODO: write the variant result to the filesystem */
      console.log(result);

      if (writeToFile) {
        const dir = path.dirname(file.fileName);
        // console.log(dir);
        createDir(path.join(baseDir, dir));
      }
    }
  }
}
