import * as path from 'path';
import { AMP } from '@sketchmine/code-analyzer';
import { readDirRecursively } from '@sketchmine/helpers';
import { MemoryCompiler } from './memory-compiler';
import { generateExample } from './generate-example';

/**
 * Modifies the angular app shell with all the examples and update the module
 * @param meta the Object with the variants of the components
 * @param dir path to the pure examples
 * @param appShell path to the angular app alias appshell that should be modified
 */
export async function main(meta: AMP.Result, dir: string, appShell: string): Promise<number> {
  /** RegEx for detecting the pure default examples */
  const files = await readDirRecursively(dir, /.*?examples\/.*?pure-example.*?\.ts$/);
  const compiler = new MemoryCompiler();

  files.forEach((file: string) => {
    /**
     * regex for detecting component folder
     * @example https://regex101.com/r/BhZbSN/1
     * */
    const component = /.+?\/([^\/]+?)\/examples$/.exec(path.dirname(file))[1];
    /** if we have an entry in our meta information JSON for the component */
    if (meta.components.hasOwnProperty(component)) {
      const cmp = meta.components[component];
      compiler.addSourceFiles(generateExample(file, cmp));
    }
  });

  await compiler.printFiles(appShell);
  return 0;
}
