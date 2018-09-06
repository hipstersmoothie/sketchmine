import * as ts from 'typescript';

/**
 * @class
 * @description
 * The MemoryCompiler holds all Source Files for the Variants
 * and compiles them into files and updates the imports for the modules.
 */
export class MemoryCompiler {
  private static _instance: MemoryCompiler;
  protected _sourceFiles: ts.SourceFile[] = [];

  constructor() {
    if (MemoryCompiler._instance) {
      return MemoryCompiler._instance;
    }
    MemoryCompiler._instance = this;
  }

  addSourceFiles(sourceFiles: ts.SourceFile | ts.SourceFile[]) {
    if (Array.isArray(sourceFiles)) {
      this._sourceFiles.push(...sourceFiles);
    } else {
      this._sourceFiles.push(sourceFiles);
    }
  }

  printFiles() {
    for (let i = 0, max = this._sourceFiles.length; i < max; i += 1) {
      const file = this._sourceFiles[i];
      const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
      const resultFile = ts.createSourceFile(file.fileName, '', ts.ScriptTarget.Latest, false, ts.ScriptKind.TS);
      const result = printer.printNode(ts.EmitHint.Unspecified, file, resultFile);
      /** TODO: write the variant result to the filesystem */
      console.log(result);
    }
  }
}
