export interface TransformValues {
  angle: number;
  scaleX: number;
  scaleY: number;
  skewX: number;
  skewY: number;
  translateX: number;
  translateY: number;
}

export function resolveTransform(transform: string): TransformValues | null {
  const match = transform.match(/matrix\((.*?)\)$/);

  if (!match) {  return null; }

  const matrix = match[1]
    .split(',')
    .map(s => +s.trim()); // trim and to integer

  return qrDecomposition(matrix);
}

/**
 * Decomposite a quadratic matrix form the transform value of getComputedStyle
 * "matrix(a,b,c,d,e,f)"
 *       / a b e \
 * T =  | c d f |
 *      \ 0 0 1  /
 * @param {number[]} a [a, b, c, d, e, f];
 * @see https://www.youtube.com/watch?v=51MRHjKSbtk
 */
function qrDecomposition(a: number[]): TransformValues {
  const angle = Math.atan2(a[1], a[0]);
  const denom = Math.pow(a[0], 2) + Math.pow(a[1], 2);
  const scaleX = Math.sqrt(denom);
  const scaleY = (a[0] * a[3] - a[2] * a[1]) / scaleX;
  const skewX = Math.atan2(a[0] * a[2] + a[1] * a[3], denom);

  return {
    angle: angle / (Math.PI / 180),  // this is rotation angle in degrees
    scaleX,                          // scaleX factor
    scaleY,                          // scaleY factor
    skewX: skewX / (Math.PI / 180),  // skewX angle degrees
    skewY: 0,                        // skewY angle degrees
    translateX: a[4],                // translation point  x
    translateY: a[5],                // translation point  y
  };
}
