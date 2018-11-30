/**
 * use class for this, because class can used as interface
 * for return types and you can iterate over the keys with
 * `Object.keys(new StyleDeclaration())` – reduces redundant code
 * of an array and an interface.
 *
 * @description
 * Interface for the used properties of the CSSStyleDeclaration that is gathered
 * with the `getComputedStyle(element: HTMLElement)` function in the @sketchmine/dom-agent
 */
export class StyleDeclaration {
  backgroundColor = 'rgba(0, 0, 0, 0)';
  backgroundImage = 'none';
  borderTop = '0px none rgb(0, 0, 0)';
  borderLeft = '0px none rgb(0, 0, 0)';
  borderBottom = '0px none rgb(0, 0, 0)';
  borderRight = '0px none rgb(0, 0, 0)';
  borderColor = 'rgb(0, 0, 0)';
  borderTopLeftRadius = '0px';
  borderTopRightRadius = '0px';
  borderBottomRightRadius = '0px';
  borderBottomLeftRadius = '0px';
  borderWidth = '0px';
  boxShadow = 'none';
  padding = '0px';
  color = 'rgb(0, 0, 0)';
  display = 'block';
  fill = 'rgb(0, 0, 0)';
  fontFamily = 'Helvetica Neue';
  fontSize = '16px';
  fontStyle = 'normal';
  fontWeight = '400';
  letterSpacing = 'normal';
  lineHeight = 'normal';
  opacity = '1';
  strokeWidth = '1px';
  textDecoration = 'none solid rgb(0, 0, 0)';
  textAlign = 'start';
  textTransform = 'none';
  transform = 'none';
  visibility = 'visible';
  whiteSpace = 'normal';
}
