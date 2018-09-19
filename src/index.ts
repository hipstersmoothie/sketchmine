import { main as AngularMetaParser } from './angular-meta-parser/main';
import { main as AngularLibraryGenerator } from './angular-library-generator/main';
import { main as SketchGenerator } from './sketch-generator/main';
import { AMP } from '@angular-meta-parser/meta-information';
import { startServer } from './start-server';
import { writeJSON } from '@utils';

const config = {
  metaInformation: 'dist/sketch-library/src/assets/meta-information.json',
  host: {
    protocol: 'http',
    name: 'localhost',
    port: 4200,
  },
  rootElement: 'ng-component > * ',
  library: {
    app: 'dist/sketch-library',
  },
  pages: [
    '/',
  ],
  outFile: 'dt-asset-lib.sketch',
  chrome: {
    defaultViewport: {
      width: 800,
      height: 600,
      deviceScaleFactor: 1,
      isMobile: false,
      hasTouch: false,
      isLandscape: false,
    },
  },
};

export default async function main() {
  const meta = await AngularMetaParser(
    '_tmp',
    'src/lib',
    'meta-information.json',
    'index.ts',
    true,
  ) as AMP.Result;

  await AngularLibraryGenerator(meta, '_tmp/src/docs/components', 'dist/sketch-library');
  await writeJSON(config.metaInformation, meta);
  const server = await startServer(config);
  await SketchGenerator(config);
  server.kill();
}

main()
  .then(() => process.exit(0))
  .catch((error) =>  {
    console.error(error);
    process.exit(1);
  });
