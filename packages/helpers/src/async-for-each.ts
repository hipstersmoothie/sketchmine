export async function asyncForEach<T>(
  array: T[],
  callback: (item: T, i: number, array: T[]) => Promise<void>,
): Promise<void> {
  for (let i = 0, max = array.length; i < max; i += 1) {
    await callback(array[i], i, array);
  }
}
