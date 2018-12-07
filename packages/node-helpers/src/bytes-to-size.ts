/**
 * Displays bytes in a human readable format.
 * Used for displaying file sizes.
 * @param bytes number of bytes
 */
export function bytesToSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) {
    return '0 Byte';
  }
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const pow = bytes / Math.pow(1024, i);
  return `${Math.round(pow)} ${sizes[i]}`;
}
