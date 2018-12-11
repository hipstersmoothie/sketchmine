import { flatten } from 'lodash';

/**
 * Merge members from implement or extend with the original members of a component
 * @param originalMembers Array of Object with {key: any, value: any}
 * @param toBeMerged
 * @returns
 */
export function mergeClassMembers(originalMembers: any[], toBeMerged: any[]): any[] {
  if (!toBeMerged.length) {
    return originalMembers;
  }
  // store in result so that we don't need to
  // modify the parameter originalMembers!
  const result = originalMembers;

  // loop over each member and check if we find the same keys like has the to beMerged
  // a color property like the original. If we have the same keys than extend the properties.
  toBeMerged.forEach((member) => {
    // find the same key like (color property) that should be matched
    // and extended
    const index = result.findIndex(m => m.key === member.key);
    // property exists in original Members
    if (index > -1) {
      // value is null and can be replaced with new results
      if (result[index].value === null || result[index].value.length === 0) {
        result[index].value = member.value;
      } else {
        // value exists so make an array and merge them
        const value = Array.isArray(member.value) ?
          [result[index].value, ...member.value] :  [result[index].value, member.value];
        // make set to delete duplicates
        result[index].value = Array.from(new Set<string>(flatten(value)));
      }
    } else {
      // if the property does not exist in the original object just add it.
      result.push(member);
    }
  });

  return result;
}
