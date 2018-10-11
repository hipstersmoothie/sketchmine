import { AMP } from '../meta-information';
import { camelCaseToKebabCase } from '@utils';
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
      let nameValue = '';
      /** if the value is a boolean true then the key is enought and no value is needed */
      if (val !== 'true') {
        nameValue = `-${val.toString().replace(/\"/g, '')}`;
      }
      const changes = [{
        type: variant.type,
        key: variant.key,
        value: val,
      }];

      result.push({
        name: generateVariantName(component, changes).replace('/default', ''),
        changes,
      });
    });
  });

  return result;
}
