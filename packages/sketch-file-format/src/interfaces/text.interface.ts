import { SketchBase, SketchObjectTypes } from './base.interface';
import { SketchStyle } from './style.interface';
import { SketchEncodedAttributes } from './text-style.interface';

export interface SketchText extends SketchBase {
  _class: SketchObjectTypes.Text;
  style: SketchStyle;
  attributedString: SketchAttributedString;
  automaticallyDrawOnUnderlyingPath: boolean;
  dontSynchroniseWithSymbol: boolean;
  glyphBounds: string;
  lineSpacingBehaviour: number;
  sharedStyleID?: string;
  textBehaviour: number;
}
export interface SketchAttributedString {
  _class: string;
  string: string;
  attributes: SketchAttribute[];
}
export interface SketchAttribute {
  _class: SketchObjectTypes.StringAttribute;
  location: number;
  length: number;
  attributes: SketchEncodedAttributes;
}
