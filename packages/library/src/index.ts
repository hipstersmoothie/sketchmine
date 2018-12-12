import { main as AngularMetaParser, Result as MetaResult } from '@sketchmine/code-analyzer';
import { main as AngularLibraryGenerator } from '@sketchmine/app-builder';
import { main as SketchGenerator } from '@sketchmine/sketch-builder';
import { writeJSON, Logger } from '@sketchmine/node-helpers';
import { startServer } from './start-server';
import chalk from 'chalk';
import { resolve } from 'path';

const log = new Logger();

const config = require(resolve('./config.json'));

export default async function main() {
  log.info(chalk`{blue ==>} start generating the meta-information.json\n\n`);
  const meta = await AngularMetaParser(
    '_tmp',
    'src/lib',
    'meta-information.json',
    'index.ts',
    'tsconfig.json',
    true,
  ) as MetaResult;

  log.info(chalk`{blue ==>} generating the angular app from the meta-information\n\n`);
  await AngularLibraryGenerator(meta, '_tmp/src/docs/components', 'dist/sketch-library');
  await writeJSON(config.metaInformation, meta);
  const server = await startServer(config);
  log.info(chalk`{blue ==>} generate the .sketch file\n\n`);
  await SketchGenerator(config['sketch-builder'], meta);
  server.kill();
}

main()
  .then(() => process.exit(0))
  .catch((error) =>  {
    console.error(error);
    process.exit(1);
  });
