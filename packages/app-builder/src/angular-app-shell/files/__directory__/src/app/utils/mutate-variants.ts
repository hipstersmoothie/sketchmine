import { Component, Method, Property } from '@sketchmine/code-analyzer';
import { generateVariantName } from './generate-variant-name';

export function mutateVariants(component: Component, theme: string) {
  const baseName = component.component;
  const members = component.members.filter(m => m.type === 'property') as Property[];
  const result = component.combinedVariants
    ? variantCombinationGenerator(baseName, theme, members)
    : singleVariantGenerator(baseName, theme, members);

  return result;
}

export function singleVariantGenerator(baseName: string, theme: string, variants: Property[]): any[] {
  const result = [];
  for (let i = 0, max = variants.length; i < max; i += 1) {
    const variant = variants[i];

    for (let j = 0, l = variant.value.length; j < l; j += 1) {
      const value = variant.value[j];
      if (value && value !== 'undefined') {
        const change = [{
          type: variant.type,
          key: variant.key,
          value,
        }];

        result.push({
          name: generateVariantName(baseName, theme, change),
          changes: change,
        });
      }
    }
  }
  return result;
}

export function variantCombinationGenerator(baseName: string, theme: string, variants: Property[]): any[] {
  if (!variants || !Array.isArray(variants) || !variants.length) {
    return [];
  }
  const result = [];
  const length = variants.length - 1;

  // add undefined to mutate single values as well
  variants.forEach((variant) => {
    // only add undefined if it is not there otherwise we get duplicates
    if (!variant.value.includes(undefined)) {
      variant.value.push(undefined);
    }
  });

  function helper(changes: any[], i: number) {
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
            name: generateVariantName(baseName, theme, newChanges),
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
