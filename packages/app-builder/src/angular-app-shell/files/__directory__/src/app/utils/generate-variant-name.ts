import { kebabCase } from 'lodash';
import { VariantChange } from '../app.component';

const ACTIONS = ['disabled', 'active', 'hover', 'click'];

/**
 * generates a name for the sketch symbol out of the changes array
 * @param base basename of the component like button
 * @param changes the changes that can be applied
 * @example
 * button/main/primary
 * button/main/disalbed
 * button/warning
 * ...
 */
export function generateVariantName(base: string, theme: string, changes: VariantChange[]): string {

  const parts = [];
  const actions = [];

  changes.forEach((change: VariantChange) => {

    if (change.type === 'property') {
      const name = parseValue(change);
      if (ACTIONS.includes(change.key)) {
        actions.push(name);
      } else {
        parts.push(name);
      }
    } else {
      throw Error(`The Variant with the type: ${change.type} is not handled yet!`);
    }
  });

  parts.sort();
  actions.sort();

  const actionPart = actions.length ? `/${actions.join('/')}` : '/default';
  const variantPart = parts.length ? `/${parts.join('/')}` : '';
  const basePart = kebabCase(base);

  return `${basePart}/${theme}${variantPart}${actionPart}`;
}

/**
 * parses the change to a string depending on the type. Booleans should return the key of the change
 * in case, that true does not specify the name very well.
 * For example disabled -> true would only return disabled.
 * If the value is a string return the string.
 * @param change the change as property
 */
function parseValue(change: VariantChange): string {
  if (change.value === 'undefined') {
    throw Error('Value have to be defined for name generation!');
  }
  let val;

  try {
    val = JSON.parse(change.value);
  } catch (e) {
    throw new Error(`generate-variant-name.ts › parseBooleanValue() => Cannot JSON.parse: ${change.value}`);
  }

  switch (typeof val) {
    case 'boolean': return change.key;
    case 'number' : return `${change.key}-${change.value}`;
  }
  return change.value.replace(/\"/g, '');
}
