import { VariantProperty, VariantMethod } from '@sketchmine/code-analyzer/lib/@types';
import { kebabCase } from 'lodash';

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
export function generateVariantName(base: string, changes: (VariantMethod | VariantProperty)[]): string {

  const parts = [];
  const actions = [];

  changes.forEach((change: VariantMethod | VariantProperty) => {

    if (change.type === 'property') {
      const name = parseBooleanValue(change as VariantProperty);
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

  const actionPart = actions.length ? `/${actions.sort().join('/')}` : '/default';
  const variantPart = parts.length ? `/${parts.join('/')}` : '';
  const basePart = kebabCase(base);

  return `${basePart}${variantPart}${actionPart}`;
}

/**
 * parses the change to a string depending on the type. Booleans should return the key
 * in case of that true does not say anything and undefined and number get the key as well.
 * if it is a string than return just the value like "main", "primary" or "secondary"
 * @param change the change as property
 */
function parseBooleanValue(change: VariantProperty): string {
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
