import { Property } from '../ast/json-visitor';
import * as AMP from '../meta-information';
import { generateVariantName } from './generate-variant-name';

/**
 * generate all the combined variants of a component
 * @param baseName name of the component for example button, or alert, ...
 * @param variants the Porperty or methods that can be applied
 */
export function variantCombinationGenerator(baseName: string, ...variants: Property[]): AMP.Variant[] {
  if (!variants || !Array.isArray(variants) || !variants.length) {
    return [];
  }
  const result: AMP.Variant[] = [];
  const length = variants.length - 1;

  // add undefined to mutate single values as well
  variants.forEach((variant) => {
    // only add undefined if it is not there otherwise we get duplicates
    if (!variant.value.includes(undefined)) {
      variant.value.push(undefined);
    }
  });

  function helper(changes: (AMP.VariantMethod | AMP.VariantProperty)[], i: number) {
    const variant = variants[i];

    for (let j = 0, l = variant.value.length; j < l; j += 1) {
      const value = variant.value[j];
      const newChanges = changes.slice(0); // clone arr
      if (value && value !== 'undefined') {
        newChanges.push({
          type: variant.type,
          key: variant.key,
          value,
        });
      }
      if (i === length) {
        if (newChanges.length) {
          result.push({
            name: generateVariantName(baseName, newChanges),
            changes: newChanges,
          });
        }
      } else {
        helper(newChanges, i + 1);
      }
    }
  }

  helper([], 0);
  return result.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
}
