const fs = require('fs');
const path = require('path');
const utils = require('./utils');

if (require.main === module) {
  const args = utils.parseCommandLineArgs(process.argv.slice(2));


  if (!args.p || !fs.existsSync(args.p)) {
    throw new Error('You have to provide a path to the package.json');
  }

  const version = require(path.join(process.cwd(), args.p)).version;
  console.log(version);
}
