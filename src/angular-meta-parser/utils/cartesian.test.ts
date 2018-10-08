import { Property } from '../ast/json-visitor';

// import { cartesian } from './cartesian';

export function variantGenerator(baseName: string, ...variants: Property[]): any {
  const result = [];
  const length = variants.length - 1;

  // add undefined to mutate single values as well
  variants.map(variant => variant.value.push(undefined));

  function helper(changes, name: string, i: number) {
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

const BUTTON_VARIANTS: Property[] = [
  { type: 'property', key: 'disabled', value: ['true'] },
  { type: 'property', key: 'color', value: ['"main"', '"warning"', '"cta"'] },
  { type: 'property', key: 'variant', value: ['"primary"', '"secondary"'] },
];

test('cartesian', () => {

  

    // {
    //   name: `${baseName}-${variant.key}${nameValue}`,
    //   changes: [{
    //     type: variant.type,
    //     key: variant.key,
    //     value: val,
    //   }],
    // }
  
  const result2 = variantGenerator('button', ...BUTTON_VARIANTS);
  console.log(JSON.stringify(result2, null, 2));
  //   [1, undefined],
  //   [2, 3, 4, undefined],
  //   [5, 6, undefined],
  // );

  // const arr = [
  //   [1],
  //   [2, 3, 4],
  //   [5, 6],
  // ];

  // const r = [];
  // for (let i = 0, maxi = arr.length; i < maxi; i += 1) {

  //   for (let j = 0, maxj = arr[i].length; j < maxj; j += 1) {
  //     r.push([arr[i][j]]);
  //   }
  // }
  // console.log(r);







});

// test('', () => {

//   // const result = cartesian(
//   //   [true],
//   //   ['main', 'accent', 'warning', 'error', 'cta', undefined],
//   //   ['primary', 'secondary', 'nested'],
//   //   );
//   // console.log(result);
// });



/**
 * {
        "type": "property",
        "key": "disabled",
        "value": [
          "true"
        ]
      },
      {
        "type": "property",
        "key": "color",
        "value": [
          "\"main\"",
          "\"accent\"",
          "\"warning\"",
          "\"error\"",
          "\"cta\"",
          "undefined"
        ]
      },
      {
        "type": "property",
        "key": "variant",
        "value": [
          "\"primary\"",
          "\"secondary\"",
          "\"nested\""
        ]
      }

 */
