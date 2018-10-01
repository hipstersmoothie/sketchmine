import { Base } from '@sketch-draw/models/base';
import {
  IBounding,
  IBase,
  IText,
  IAttributedString,
  IMSAttributedStringFontAttribute,
  IParagraphStyle,
  IEncodedAttributes,
} from '@sketch-draw/interfaces';
import { Style } from '@sketch-draw/models/style';
import { IStyle } from '@sketch-draw/interfaces/style.interface';
import { fixWhiteSpace, fontMapping, fontStyle } from '@sketch-draw/helpers/font';
import { StyleDeclaration } from '../../../dom-traverser/dom-visitor';
import { TextBehaviour } from '@sketch-draw/helpers/sketch-constants';

export class Text extends Base {
  private _text = '';
  private _multiline = false;
  private _styleClass: Style;

  set text(text: string) { this._text = fixWhiteSpace(text, this.styles.whiteSpace); }
  get text(): string { return this._text; }

  constructor(bounding: IBounding, public styles) {
    super();
    this.bounding = bounding;
    this.className = 'text';
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
    // NOT USED in the moment
    // const sp = this._styles.letterSpacing;
    // const spacing = (sp !== 'normal') ? parseFloat(sp) : undefined;
    return {
      MSAttributedStringFontAttribute: this.fontAttributes(),
      MSAttributedStringColorAttribute: this._styleClass.getColor(this.styles.color),
      paragraphStyle: this.paragraphStyle(),
      kerning: 0,
    };
  }

  private paragraphStyle(): IParagraphStyle {
    const lh = this.styles.lineHeight;
    // Disable lineheight (only needed for multi line text – otherwise conflicts with padding)
    const lineHeight = (lh !== 'normal') ? parseInt(lh, 10) : parseInt(this.styles.fontSize, 10);
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
    const fontFamily = this.styles.fontFamily.split(',')[0];
    const fontWeight = this.styles.fontWeight;
    const fontVariant = this.styles.fontStyle as fontStyle;

    return {
      _class: 'fontDescriptor',
      attributes: {
        name: fontMapping(fontFamily, fontWeight, fontVariant),
        size: parseInt(this.styles.fontSize, 10),
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
    const frame = super.addFrame('rect');

    if (frame.height > parseInt(this.styles.lineHeight, 10)) {
      this._multiline = true;
    }

    return {
      ...base,
      nameIsFixed: true,
      attributedString: this.generateAttributedString(),
      frame,
      automaticallyDrawOnUnderlyingPath: false,
      dontSynchroniseWithSymbol: false,
      glyphBounds: `{{${frame.x}, ${frame.y}}, {${frame.width}, ${frame.height}}}`,
      lineSpacingBehaviour: 2,
      textBehaviour: this._multiline ? TextBehaviour.Fixed : TextBehaviour.Auto,
    } as IText;
  }
}
