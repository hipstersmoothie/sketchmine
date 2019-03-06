import { flatten, concat } from 'lodash';
import { Method, Property } from '../interfaces';

type Member = Property | Method;

/**
 * Merge members from implement or extend with the original members of a component
 * @param originalMembers Array of Object with {key: any, value: any}
 * @param toBeMerged
 * @returns
 */
export function mergeClassMembers(...members: any[]): Member[] {

  // filter out undefined members
  const filtered = flatten(members).filter(m => !!m);
  const result: Member[] = [];

  if (!filtered.length) {
    return [];
  }

  for (let i = 0, max = filtered.length; i < max; i += 1) {

    const member: Member = filtered[i];
    // find members with the same key in the array if the key (name of a function or property) matches
    // check if they are from the same type in case we can only merge properties with properties and
    // methods with methods
    const index = result.findIndex(m => m.key === member.key && m.type === member.type);
    if (index > -1) {
      const found = result[index];
      if (found.type === 'property' && member.type === 'property') {
        const merged = concat([], member.value, found.value).filter(a => !!a);
        const value = Array.from(new Set<string>(merged));
        found.value = value;
      }
    } else {
      result.push(member);
    }
  }

  return result;
}
