import { main } from './main';
import { SketchGenerator } from './sketch-generator';

export async function commandLineExecutor(): Promise<number> {
  const config = require('./config.json') as SketchGenerator.Config;
  return await main(config) as number;
}

/** Call the main function with command line args */
commandLineExecutor().then((code: number) => {
  process.exit(code);
}).then((err) => {
  console.error(err);
  process.exit(1);
});
