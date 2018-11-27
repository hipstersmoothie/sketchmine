import { generateSketchFile, readFile, zipToBuffer as unzip, Logger  } from '@sketchmine/helpers';
import * as path from 'path';
import minimist from 'minimist';
import { ColorReplacer } from './color-replacer';
import { exec } from 'child_process';

const log = new Logger();

process.env.SKETCH = 'open-close';

if (process.env.SKETCH === 'open-close') {
  exec(`osascript -e 'quit app "Sketch"'`);
}

export async function main(args: string[]) {
  const { colors, file } = minimist(args);

  if (!file || !colors) {
    throw Error(
      'Please pass the --file flag with the path to the .sketch file ' +
      'and the --colors flag for the legacy-colors.json');
  }

  return unzip(file).then(async (result) => {
    const colorsString = await readFile(colors);
    const replacer = new ColorReplacer(JSON.parse(colorsString));
    await result.forEach((file) => {
      if (!file.path.match(/\.json/)) {
        return;
      }
      const content = JSON.parse(file.buffer.toString());
      const str = JSON.stringify(replacer.replace(content));
      file.buffer = new Buffer(str);
    });
    await generateSketchFile('_tmp', path.basename(file, '.sketch'), result);
    if (process.env.SKETCH === 'open-close') {
      exec(`open ${path.resolve('_tmp', path.basename(file))}`);
    }
    return 0;
  });
}
/** Call the main function with command line args */
if (require.main === module) {
  const args = process.argv.slice(2);
  main(args).catch((err) => {
    log.error(err as any);
    process.exit(1);
  })
  .then((code: number) => {
    process.exit(code);
  });
}
