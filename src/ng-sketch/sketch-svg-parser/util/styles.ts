import { SvgStyle } from '@sketch-svg-parser/interfaces';
import { Style } from '@sketch-draw/models/style';
import { IStyle } from '@sketch-draw/interfaces';
import { StyleDeclaration } from '../../../dom-traverser/dom-visitor';

/**
 * add Style attributes to a map if it has a value, so that no undefined values are in the map
 *
 * @param styles Map<SvgStyle, string>
 * @param node Element
 * @param attributeName string
 * @param mapName SvgStyle
 */
export function addStyle(styles: Map<SvgStyle, string>, node: Element, attributeName: string, mapName?: SvgStyle) {
  enum NONE_VALUES {
    'inherit',
    'transparent',
    'none',
    '0px',
  }

  const value = node.getAttribute(attributeName);
  if (value && !Object.values(NONE_VALUES).includes(value)) {
    styles.set(mapName || attributeName as SvgStyle, value);
  }
  return styles;
}

/**
 * ⌛️ [DEPRECATED: unused]
 * Overrides the parsed SVG styles (fill, stroke, stroke-width,...) with the css style declaration
 * gatherd by traversing the dom.
 *
 * @param svgStyle Map<SvgStyle, string>
 * @param cssStyle StyleDeclaration
 * @returns Map<SvgStyle, string>
 */
export function overrideSvgStyle(
  svgStyle: Map<SvgStyle, string>,
  cssStyle: StyleDeclaration): Map<SvgStyle, string> {
  if (cssStyle.fill) {
    svgStyle.set('fill', cssStyle.fill);
  }
  if (cssStyle.borderWidth) {
    svgStyle.set('strokeWidth', cssStyle.borderWidth);
  }
  if (cssStyle.borderColor) {
    svgStyle.set('stroke', cssStyle.borderColor);
  }
  return svgStyle;
}

/**
 * create Style for SVG from StyleDeclaration
 *
 * @param cssStyle StyleDeclaration
 * @returns IStyle
 */
export function addCssStyleToSvg(cssStyle: StyleDeclaration): IStyle {
  const style = new Style();

  const fill = cssStyle.fill;
  const border = cssStyle.borderColor;
  const borderWidth = parseInt(cssStyle.borderWidth, 10);
  const opacity = parseInt(cssStyle.opacity, 10);

  if (fill) {
    style.addColorFill(fill, opacity || 1);
  }
  if (borderWidth > 0) {
    style.addBorder(border, borderWidth);
  }
  if (opacity < 1) {
    style.opacity = opacity;
  }

  return style.generateObject();
}
