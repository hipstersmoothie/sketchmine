import { Rule, Tree } from '@angular-devkit/schematics';
import { addStyles } from '../../utils/add-styles';

/**
 * Add library specific styling to the application
 * @param styles string array of the styles
 */
export function addStylesToTree(styles: string[], file: string): Rule {
  return (host: Tree) => {
    // if no styles are provided return.
    if (!styles.length) {
      return host;
    }
    addStyles(host, styles, file);
  };
}
