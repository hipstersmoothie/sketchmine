import { SketchBuilderConfig } from '../config.interface';
import { writeFile } from '@sketchmine/node-helpers';
import { join } from 'path';

export async function saveConfig(answers: {[key: string]: any}): Promise<string> {
  const { outFile, url, saveConfig } = answers;
  const filePath = join(process.cwd(), saveConfig);

  const config: SketchBuilderConfig  = {
    outFile,
    url,
  };
  await writeFile(filePath, JSON.stringify(config));
  return filePath;
}
