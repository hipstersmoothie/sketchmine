import { Tree } from '@angular-devkit/schematics';
import { LINE_BREAK, LINE_BREAK_REGEX } from './constants';

/**
 * Updates the style file with the provided styles
 * @param tree Tree to be modified
 * @param styles the styles as array of strings (get joined with line breaks)
 * @param file the file-path to the style file that should be modified.
 */
export function addStyles(tree: Tree, styles: string[], file: string) {

  if (!tree.exists(file)) {
    throw new Error(`Cannot find '${file}' in the Tree.`);
  }

  const content = tree.read(file)!.toString('utf-8');
  const lines = content.split(LINE_BREAK_REGEX);

  const updatedIndex = [
    ...styles,
    ...lines,
  ];

  tree.overwrite(file, updatedIndex.join(LINE_BREAK));
  return tree;
}
