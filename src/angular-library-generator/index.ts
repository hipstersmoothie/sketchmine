import * as path from 'path';
import { AMP } from '../angular-meta-parser/meta-information';
import { readDirRecursively } from '@utils';
import { MemoryCompiler } from './memory-compiler';
import { generateExample } from './generate-example';

const CONFIG = require('./config.json');

export async function main(): Promise<number> {

  const meta = require(path.join(process.cwd(), CONFIG.args.metaInformation)) as AMP.Result;
  const dir = path.join(path.resolve(CONFIG.args.rootDir), CONFIG.args.components);
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

  await compiler.printFiles();
  return Promise.resolve(0);
}

/** Call the main function with command line args */
if (require.main === module) {
  main().then((code: number) => {
    process.exit(code);
  }).then((err) => {
    console.error(err);
    process.exit(1);
  });
}
