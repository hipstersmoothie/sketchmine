import { IBase } from './Base';
import { IStyle, IColor } from './Style';

export interface IText extends IBase {
  style: IStyle;
  attributedString: IAttributedString;
  automaticallyDrawOnUnderlyingPath: boolean;
  dontSynchroniseWithSymbol: boolean;
  glyphBounds: string;
  lineSpacingBehaviour: number;
  textBehaviour: number;
}
export interface IAttributedString {
  _class: string;
  string: string;
  attributes: IAttribute[];
}
export interface IAttribute {
  _class: string;
  location: number;
  length: number;
  attributes: IEncodedAttributes;
}
export interface ITextStyle {
  _class: string;
  encodedAttributes: IEncodedAttributes;
  verticalAlignment: number;
}
export interface IEncodedAttributes {
  MSAttributedStringColorAttribute: IColor;
  MSAttributedStringFontAttribute: IMSAttributedStringFontAttribute;
  paragraphStyle: IParagraphStyle;
  kerning: number;
}
export interface IParagraphStyle {
  _class: string;
  alignment: number;
  maximumLineHeight: number;
  minimumLineHeight: number;
  paragraphSpacing: number;
  allowsDefaultTighteningForTruncation: number;
}
export interface IMSAttributedStringFontAttribute {
  _class: string;
  attributes: IMSAttributedStringFontAttributes;
}
export interface IMSAttributedStringFontAttributes {
  name: string;
  size: number;
}
