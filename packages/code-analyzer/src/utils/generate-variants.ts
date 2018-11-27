import { AMP } from '../meta-information';
import { kebabCase } from 'lodash';
import { Property } from '../ast/json-visitor';
import { generateVariantName } from './generate-variant-name';

/**
 * generates the changes from the variants with unique names that represent
 * the value and the key of the change
 * @param component needed for the variant name
 * @param variants Array of Variants
 */
export function generateVariants(component: string, variants: Property[]): AMP.Variant[] {
  const result: AMP.Variant[] = [];

  variants.forEach((variant) => {
    variant.value.forEach((val: string) => {

      if (val && val !== undefined) {
        const changes = [{
          type: variant.type,
          key: variant.key,
          value: val,
        }];

        result.push({
          name: generateVariantName(component, changes),
          changes,
        });
      }
    });
  });

  return result;
}
