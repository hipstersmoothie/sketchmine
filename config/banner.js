/**
 * generates banner for rollup build
 * @param {Object} pkg package JSON
 */
export function banner(pkg) {
  return `/**
  * ${pkg.name} - ${pkg.version}
  * Description: ${pkg.description.replace(/\\n/g, '\n  *              ')}
  * Company: Dynatrace Austria GmbH
  * Homepage: ${pkg.homepage}
  * License: ${pkg.license}
  * Author: ${pkg.author}
  **/

`;
}
