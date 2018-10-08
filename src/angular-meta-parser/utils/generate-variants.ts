import { AMP } from '../meta-information';
import { camelCaseToKebabCase } from '@utils';
import { Property } from '../ast/json-visitor';

/**
 * generates the changes from the variants with unique names that represent
 * the value and the key of the change
 * @param variants Array of Variants
 * @param className needed for the variant name
 */
export function generateVariants(variants: Property[], className: string): AMP.Variant[] {
  const result: AMP.Variant[] = [];
  const baseName = camelCaseToKebabCase(className);

  console.log(variants)

  variants.forEach((variant) => {
    variant.value.forEach((val: string) => {
      let nameValue = '';
      /** if the value is a boolean true then the key is enought and no value is needed */
      if (val !== 'true') {
        nameValue = `-${val.toString().replace(/\"/g, '')}`;
      }
      result.push({
        name: `${baseName}-${variant.key}${nameValue}`,
        changes: [{
          type: variant.type,
          key: variant.key,
          value: val,
        }],
      });
    });
  });

  return result;
}


