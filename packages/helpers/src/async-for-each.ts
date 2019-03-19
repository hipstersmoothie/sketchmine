/**
 * @description
 * An async/await able implementation of the forEach loop.
 * @param array The array that should be async looped
 * @param callback The callback function that should be
 */
export async function asyncForEach<T>(
  array: T[],
  callback: (item: T, i: number, array: T[]) => Promise<void>,
) {
  for (let i = 0, max = array.length; i < max; i += 1) {
    await callback(array[i], i, array);
  }
}
