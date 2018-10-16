import { SketchObjectTypes } from './base.interface';
import { SketchColor } from './color.interface';
import { TextTransform, StrikethroughStyle, UnderlineStyle } from '../helpers';
import { SketchLocalSharedStyle } from './style.interface';

export interface SketchTextStyle {
  _class: SketchObjectTypes.TextStyle;
  encodedAttributes: SketchEncodedAttributes;
  verticalAlignment: number;
}
export interface SketchForeignTextStyles {
  _class: 'MSImmutableForeignTextStyle';
  libraryID: string;
  sourceLibraryName: string;
  symbolPrivate: boolean;
  localSharedStyle: SketchLocalSharedStyle;
  remoteStyleID: string;
}
export interface SketchEncodedAttributes {
  kerning?: number;
  MSAttributedStringColorAttribute: SketchColor;
  MSAttributedStringFontAttribute: SketchFontDescriptor;
  MSAttributedStringTextTransformAttribute: TextTransform;
  paragraphSpacing?: number;
  paragraphStyle: SketchParagraphStyle;
  strikethroughStyle: StrikethroughStyle;
  textStyleVerticalAlignmentKey: number;
  underlineStyle?: UnderlineStyle;
}
export interface SketchParagraphStyle {
  _class: SketchObjectTypes.ParagraphStyle;
  alignment: number;
  maximumLineHeight: number;
  minimumLineHeight: number;
  paragraphSpacing: number;
  allowsDefaultTighteningForTruncation: number;
}
export interface SketchFontDescriptor {
  _class: SketchObjectTypes.FontDescriptor;
  attributes: SketchFontDescriptorAttributes;
}
export interface SketchFontDescriptorAttributes {
  name: string;
  size: number;
}
