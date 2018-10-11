import { AMP } from '../meta-information';
import { camelCaseToKebabCase } from '../../utils';

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
export function generateVariantName(base: string, changes: (AMP.VariantMethod | AMP.VariantProperty)[]): string {

  const parts = [];
  const actions = [];

  changes.forEach((change: AMP.VariantMethod | AMP.VariantProperty) => {

    if (change.type === 'property') {
      const name = parseBooleanValue(change as AMP.VariantProperty);
      if (ACTIONS.includes(change.key)) {
        actions.push(name);
      } else {
        parts.push(name);
      }
    } else {
      throw Error(`The AMP.Variant with the type: ${change.type} is not handled yet!`);
    }
  });

  parts.sort();

  const actionPart = actions.length ? `/${actions.sort().join('/')}` : '/default';
  const variantPart = parts.length ? `/${parts.join('/')}` : '';
  const basePart = camelCaseToKebabCase(base);

  return `${basePart}${variantPart}${actionPart}`;
}

/**
 * parses the change to a string depending on the type. Booleans should return the key
 * in case of that true does not say anything and undefined and number get the key as well.
 * if it is a string than return just the value like "main", "primary" or "secondary"
 * @param change the change as property
 */
function parseBooleanValue(change: AMP.VariantProperty): string {
  if (change.value === 'undefined') {
    throw Error('Value have to be defined for name generation!');
  }
  switch (typeof JSON.parse(change.value)) {
    case 'boolean': return change.key;
    case 'number' : return `${change.key}-${change.value}`;
    default: return change.value.replace(/\"/g, '');
  }
}
