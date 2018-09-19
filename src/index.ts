import { main as AngularMetaParser } from './angular-meta-parser/main';
import { main as AngularLibraryGenerator } from './angular-library-generator/main';
import { AMP } from '@angular-meta-parser/meta-information';

export default async function main() {
  const meta = await AngularMetaParser(
    '_tmp',
    'src/lib',
    'meta-information.json',
    'index.ts',
    true,
  ) as AMP.Result;

  await AngularLibraryGenerator(
    meta,
    '_tmp/src/docs/components',
    'dist/sketch-library',
  );

}

main()
  .then(() => process.exit(0))
  .catch((error) =>  {
    console.error(error);
    process.exit(1);
  });
