import path from 'path';
import fs from 'fs';
import { readFile } from '@utils/read-file';
import { Visitor } from './visitor';

const COMPONENTS = [
  path.join(__dirname, './fixtures/button.ts'),
];

COMPONENTS.forEach(async (inputFile: string) => {
  const inputSourceCode = await readFile(inputFile) as string;
  const visitor = new Visitor(inputFile);
  visitor.instrument(inputSourceCode);

  console.log(JSON.stringify(visitor.meta, null, 2));
});
