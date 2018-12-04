/**
 * Flattens an array with depths
 * @param arr array with arrays inside
 */
export function arrayFlatten(arr: any[]) {
  let a = arr;
  while (a.find(el => Array.isArray(el))) {
    a = Array.prototype.concat(...a);
  }
  return a;
}
