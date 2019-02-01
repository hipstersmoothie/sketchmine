import { elementNode } from '../interfaces';

export function getClassName(element: elementNode): string {
  return (typeof element.className === 'string') ? element.className.split(' ').join('\/') : ''
}
