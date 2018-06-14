import { Base } from './Base';
import { IBounding, IBase } from '../interfaces/Base';
import {
  IText,
  IAttributedString,
  IMSAttributedStringFontAttribute,
  IParagraphStyle,
  IEncodedAttributes,
} from '../interfaces/text.interface';
import { Style } from './Style';
import { IStyle } from '../interfaces/style.interface';
import { fixWhiteSpace, fontMapping, fontStyle } from '../helpers/font';

// TODO: multiline text attribute
export class Text extends Base {
  private _text = '';
  private _styles: CSSStyleDeclaration;
  private _styleClass: Style;

  set text(text: string) { this._text = fixWhiteSpace(text, this._styles.whiteSpace); }

  constructor(bounding: IBounding, styles) {
    super();
    this.bounding = bounding;
    this.class = 'text';
    this._styles = styles;
    this._styleClass = new Style();
    // call setter
    this.style = this.generateStyle();
  }

  private generateAttributedString(): IAttributedString {
    return {
      _class: 'attributedString',
      string: `${this._text}`,
      attributes: [
        {
          _class: 'stringAttribute',
          location: 0,
          length: this._text.length,
          attributes: this.attributes(),
        },
      ],
    };
  }

  private attributes(): IEncodedAttributes {
    const sp = this._styles.letterSpacing;
    const spacing = (sp !== 'normal') ? parseFloat(sp) : undefined;
    return {
      MSAttributedStringFontAttribute: this.fontAttributes(),
      MSAttributedStringColorAttribute: this._styleClass.convertColor(this._styles.color),
      paragraphStyle: this.paragraphStyle(),
      kerning: 0,
    };
  }

  private paragraphStyle(): IParagraphStyle {
    const lh = this._styles.lineHeight;
    // Disable lineheight (only needed for multi line text – otherwise conflicts with padding)
    const lineHeight = parseInt(this._styles.fontSize, 10); // (lh !== 'normal') ? parseInt(lh, 10) : undefined;
    return {
      _class: 'paragraphStyle',
      alignment: 0,
      maximumLineHeight: lineHeight,
      minimumLineHeight: lineHeight,
      paragraphSpacing: 0,
      allowsDefaultTighteningForTruncation: 0,
    };
  }

  private fontAttributes(): IMSAttributedStringFontAttribute {
    const fontFamily = this._styles.fontFamily.split(',')[0];
    const fontWeight = this._styles.fontWeight;
    const fontVariant = this._styles.fontStyle as fontStyle;

    return {
      _class: 'fontDescriptor',
      attributes: {
        name: fontMapping(fontFamily, fontWeight, fontVariant),
        size: parseInt(this._styles.fontSize, 10),
      },
    };
  }

  private generateStyle(): IStyle {
    return  {
      ...this._styleClass.generateObject(),
      textStyle: {
        _class: 'textStyle',
        encodedAttributes: this.attributes(),
        verticalAlignment: 0,
      },
    };
  }

  generateObject(): IText {
    const base: IBase = super.generateObject();
    return {
      ...base,
      nameIsFixed: true,
      attributedString: this.generateAttributedString(),
      frame: super.addFrame('rect'),
      automaticallyDrawOnUnderlyingPath: false,
      dontSynchroniseWithSymbol: false,
      glyphBounds: '{{0, 0}, {103, 18}}',
      lineSpacingBehaviour: 2,
      textBehaviour: 0,
    };
  }
}
