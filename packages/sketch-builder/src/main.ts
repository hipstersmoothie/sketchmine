import { ElementFetcher } from './element-fetcher';
import { SketchBuilderConfig } from './config.interface';
import { exec } from 'child_process';
import { Result as MetaResult } from '@sketchmine/code-analyzer';

export async function main(config: SketchBuilderConfig, meta?: MetaResult): Promise<number> {
  /** close sketch */
  if (process.env.SKETCH === 'open-close') {
    exec(`osascript -e 'quit app "Sketch"'`);
  }

  const elementFetcher = new ElementFetcher(config, meta);
  await elementFetcher.collectElements();
  return await elementFetcher.generateSketchFile();
}
