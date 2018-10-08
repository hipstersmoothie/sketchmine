import { Property } from '../ast/json-visitor';
import { AMP } from '../meta-information';

export function variantGenerator(baseName: string, ...variants: Property[]): AMP.Variant[] {
  const result: AMP.Variant[] = [];
  const length = variants.length - 1;

  // add undefined to mutate single values as well
  variants.map(variant => variant.value.push(undefined));

  function helper(changes: (AMP.VariantMethod | AMP.VariantProperty)[], name: string, i: number) {
    const variant = variants[i];
    let stackedName = name;

    for (let j = 0, l = variant.value.length; j < l; j += 1) {
      const value = variant.value[j];
      const newChanges = changes.slice(0); // clone arr
      if (value) {
        newChanges.push({
          type: variant.type,
          key: variant.key,
          value,
        });
        stackedName += `/${variant.key}/${value.replace(/\"/g, '')}`;
      }
      if (i === length) {
        if (newChanges.length) {
          result.push({
            name: stackedName,
            changes: newChanges,
          });
          // reset stackedName to baseName for next change
          stackedName = baseName;
        }
      } else {
        helper(newChanges, stackedName, i + 1);
      }
    }
  }

  helper([], baseName, 0);
  return result;
}
