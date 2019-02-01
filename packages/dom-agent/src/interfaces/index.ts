import { StyleDeclaration } from '@sketchmine/helpers';

export type elementNode = HTMLElement | SVGSVGElement | HTMLImageElement;

export interface StyleOptions {
  styles: StyleDeclaration;
  isHidden: boolean;
  hasDefaultStyling: boolean;
}
