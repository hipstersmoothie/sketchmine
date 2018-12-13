
export async function asyncForEach(array, callback) {
  for (let i = 0, max = array.length; i < max; i += 1) {
    await callback(array[i], i, array);
  }
}
