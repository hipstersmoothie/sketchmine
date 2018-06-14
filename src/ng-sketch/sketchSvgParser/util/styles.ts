import { SvgStyle } from '../interfaces/svg.interface';
import { Style } from '../../sketchJSON/models/style';
import { IStyle } from '../../sketchJSON/interfaces/style.interface';

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
 * @param cssStyle CSSStyleDeclaration
 * @returns Map<SvgStyle, string>
 */
export function overrideSvgStyle(
  svgStyle: Map<SvgStyle, string>,
  cssStyle: CSSStyleDeclaration): Map<SvgStyle, string> {
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
 * create Style for SVG from CSSStyleDeclaration
 *
 * @param cssStyle CSSStyleDeclaration
 * @returns IStyle
 */
export function addCssStyleToSvg(cssStyle: CSSStyleDeclaration): IStyle {
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
