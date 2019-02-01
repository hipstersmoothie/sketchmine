import { StyleDeclaration } from '@sketchmine/helpers';

export function isHidden(style: StyleDeclaration) {
  if (style.visibility === 'hidden' || style.display === 'none') {
    return true;
  }
  return false;
}
