import { ElementFetcher } from './element-fetcher';
import { SketchGenerator } from './sketch-generator';
import { exec } from 'child_process';
import { AMP } from '../angular-meta-parser/meta-information';

export async function main(config: SketchGenerator.Config, meta?: AMP.Result): Promise<number> {
  /** close sketch */
  if (process.env.SKETCH === 'open-close') {
    exec(`osascript -e 'quit app "Sketch"'`);
  }

  const elementFetcher = new ElementFetcher(config, meta);
  await elementFetcher.collectElements();
  return await elementFetcher.generateSketchFile();
}
