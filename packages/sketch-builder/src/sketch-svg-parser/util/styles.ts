import { SvgStyle, ISvgShape, ISvgView } from '@sketch-svg-parser/interfaces';
import { Style } from '@sketch-draw/models/style';
import { SketchStyle } from '@sketch-draw/interfaces';
import { StyleDeclaration } from '../../../dom-traverser/dom-visitor';
import { Logger } from '@utils';

const log = new Logger();
/**
 * add Style attributes to a map if it has a value, so that no undefined values are in the map
 *
 * @param styles Map<SvgStyle, string>
 * @param node Element
 * @param attributeName string
 * @param mapName SvgStyle
 */
export function addStyle(
  styles: Map<SvgStyle, string>,
  node: Element,
  viewBox: ISvgView,
  attributeName: string,
  mapName?: SvgStyle,
) {
  enum NONE_VALUES {
    'inherit',
    'transparent',
    'none',
    '0px',
  }

  let value: string | number = node.getAttribute(attributeName);
  if (value && !Object.values(NONE_VALUES).includes(value)) {

    if (attributeName === 'stroke-width') {
      value = Math.ceil((viewBox.width / parseInt(value, 10)) / viewBox.width * 16);
    }
    styles.set(mapName || attributeName as SvgStyle, `${value}`);
  }
  return styles;
}

/**
* Check if the svg Element has style attributes like fill or stroke
*
* @param node Element
* @param element ISvgShape
* @returns ISvgShape
*/

export function addStyles(node: Element, element: ISvgShape, viewBox: ISvgView): ISvgShape {
  const styles: Map<SvgStyle, string> = new Map();
  addStyle(styles, node, viewBox, 'fill');
  addStyle(styles, node, viewBox, 'stroke');
  addStyle(styles, node, viewBox, 'stroke-width', 'strokeWidth');
  addStyle(styles, node, viewBox, 'fill-opacity', 'fillOpacity');
  addStyle(styles, node, viewBox, 'stroke-opacity', 'strokeOpacity');

  element.style = styles;
  return element;
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
export function addCssStyleToSvg(cssStyle: StyleDeclaration): SketchStyle {
  const style = new Style();

  const fill = cssStyle.fill;
  const border = cssStyle.borderColor;
  const borderWidth = parseInt(cssStyle.borderWidth, 10);
  const opacity = parseInt(cssStyle.opacity, 10);

  if (fill) {
    style.addFill(fill, opacity || 1);
  }
  if (borderWidth > 0) {
    style.addBorder(border, borderWidth);
  }
  if (opacity < 1) {
    style.opacity = opacity;
  }

  return style.generateObject();
}
