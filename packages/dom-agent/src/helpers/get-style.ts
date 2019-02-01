import { StyleDeclaration } from '@sketchmine/helpers';
import { elementNode, StyleOptions } from '../interfaces';
import { isHidden } from './is-hidden';

/**
 * The property keys that are used to identify if the element
 * has default styling behaviors for the background.
 * uses the values from `new StyleDeclaration()`.
 */
const DEFAULT_STYLING_VALUES = [
  'backgroundColor',
  'backgroundImage',
  'borderWidth',
  'boxShadow',
  'padding',
];

/**
 * Gathers the CSS Style Declaration of an Element
 * @param element Element
 * @param textNode boolean that checks if it is a text node (for default styling ignore on text node)
 * @returns StyleDeclaration or null if it has default styling
 */
export function getStyle(element: elementNode, pseudoElement?: ':after' | ':before'): StyleOptions {
  const defaultStyling = new Set<boolean>();
  const styles = new StyleDeclaration();
  const tempStyle = getComputedStyle(element, pseudoElement);

  for (const key of Object.keys(styles)) {
    defaultStyling.add(DEFAULT_STYLING_VALUES.includes(key) && styles[key] !== tempStyle[key]);
    styles[key] = tempStyle[key];
  }

  return {
    styles,
    isHidden: isHidden(styles),
    hasDefaultStyling: defaultStyling.size < 2,
  };
}
