import { argv } from 'yargs';
import { generateSketchFile, readFile, zipToBuffer as unzip  } from '../utils';
import * as path from 'path';
import chalk from 'chalk';
import { ColorReplacer } from './color-replacer';
import { exec } from 'child_process';

process.env.SKETCH = 'open-close';

if (!argv.file || !argv.colors) {
  throw Error(`Please provide the path to the .sketch file and the legacy-colors.json`);
}

if (process.env.SKETCH === 'open-close') {
  exec(`osascript -e 'quit app "Sketch"'`);
}

unzip(argv.file).then(async (result) => {
  try {
    const colors = await readFile(argv.colors);
    const replacer = new ColorReplacer(JSON.parse(colors));
    await result.forEach((file) => {
      if (!file.path.match(/\.json/)) {
        return;
      }
      const content = JSON.parse(file.buffer.toString());
      const str = JSON.stringify(replacer.replace(content));
      file.buffer = new Buffer(str);
    });
    await generateSketchFile('_tmp', path.basename(argv.file, '.sketch'), result);
    if (process.env.SKETCH === 'open-close') {
      exec(`open ${path.resolve('_tmp', path.basename(argv.file))}`);
    }
  } catch (error) {
    if (process.env.DEBUG) {
      console.log(chalk`{bgRed Error Parsing Files:\n}`);
      console.log(error);
    }
  }
}).catch((error) => {
  throw error;
});
