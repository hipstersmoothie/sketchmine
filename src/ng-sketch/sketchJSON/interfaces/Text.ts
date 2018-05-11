import { IColor } from "./Style";
import { IBase } from "./Base";

export interface IText extends IBase {
  attributedString: IAttributedString;
  automaticallyDrawOnUnderlyingPath: boolean;
  dontSynchroniseWithSymbol: boolean;
  glyphBounds: string;
  lineSpacingBehaviour: number;
  textBehaviour: number;
}

export interface ITextStyle {
  _class: string;
  do_objectID: string;
  encodedAttributes: ITextStyleEncodedAttribs;
  verticalAlignment: number;
}

export interface ITextStyleEncodedAttribs {
  MSAttributedStringFontAttribute: IMSArchive;
  paragraphStyle: IMSArchive;
  MSAttributedStringColorAttribute: IColor;
  kerning: number;
}

export interface IAttributedString {
  _class: string;
  archivedAttributedString: IMSArchive;
}

export interface IMSArchive {
  _archive: string
}
