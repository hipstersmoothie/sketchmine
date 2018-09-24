import { ElementFetcher } from './element-fetcher';
import { SketchGenerator } from './sketch-generator';
import { exec } from 'child_process';

export async function main(config: SketchGenerator.Config): Promise<number> {
  /** close sketch */
  if (process.env.SKETCH === 'open-close') {
    exec(`osascript -e 'quit app "Sketch"'`);
  }

  const elementFetcher = new ElementFetcher(config);
  await elementFetcher.collectElements();
  return await elementFetcher.generateSketchFile();
}
