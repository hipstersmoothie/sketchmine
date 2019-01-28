import { getTags } from './version-control/get-tags';
import { writeFile } from '@sketchmine/node-helpers';
import { resolve } from 'path';

/**
 * -r (repository name as slug)
 * -p, (project scope like UX/ RX)
 * -f (filename for version)
 */
async function main(args: string[]) {
  const { r, p, f } = require('minimist')(args);

  const tags = await getTags(p, r);
  const tag = (tags && tags.length) ? tags[0] : 'no-tag';

  const outFile = f || 'VERSION';

  await writeFile(resolve(outFile), tag);
}

main(process.argv)
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
