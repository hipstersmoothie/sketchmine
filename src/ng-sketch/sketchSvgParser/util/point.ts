import { ISvgPoint } from '../interfaces/ISvg';

/**
 * Checks if the provided point is an Action Point like close Path or start drawing with a moveto
 *
 * @param point ISvgPoint
 * @returns boolean
 */
export function isActionPoint(point: ISvgPoint): boolean {
  return ['M', 'm', 'z', 'Z'].includes(point.code);
}
