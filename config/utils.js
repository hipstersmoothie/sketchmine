const https = require("https");

/**
 * uses the node native https to get a JSON
 * @param {string} url url to get
 * @param {string} encoding default utf8
 * @returns {Object}
 */
function getJSON(url, encoding = 'utf8') {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      res.setEncoding(encoding);
      let body = '';
      res.on('data', data => body += data);
      res.on('end', () => resolve(JSON.parse(body)))
    }).on('error', e => reject(e));
  })
}


/**
 * @param {string} endpoint The endpoint to fetch the data from the dynatrace artifactory
 * @returns {string} latest version from artifactory
 */
async function getLatestVersion(endpoint) {
  const data = await getJSON(endpoint);
  return data['dist-tags'].latest;
}

/**
 * parses the command line arguments from `process.argv.slice(2)`
 * @param {string[]} args array of arguments
 */
function parseCommandLineArgs(args) {
  const obj = {};
  let key = '';
  for (let i = 0, max = args.length; i < max; i++) {
    if (i % 2 === 0) {
      key = args[i].replace(/^-+/gm, '');
    } else {
      obj[key] = args[i];
    }
  }
  return obj;
}


exports.getJSON = getJSON;
exports.getLatestVersion = getLatestVersion;
exports.parseCommandLineArgs = parseCommandLineArgs;
