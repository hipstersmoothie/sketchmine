import { Base } from "./Base";
import { IBounding, IBase } from "../interfaces/Base";
import { IText, IAttributedString, IMSAttributedStringFontAttribute, IParagraphStyle } from "../interfaces/Text";
import { parseArchive } from "../helpers/util";
import { Style } from "./Style";
import { IStyle } from "../interfaces/Style";

export class Text extends Base {
  private _text = '';
  private _styles: CSSStyleDeclaration;
  private _styleClass: Style;

  set text(text: string) { this._text = text; }

  constructor(bounding: IBounding, styles) {
    super();
    super.bounding = bounding;
    super.class = 'text';
    this._styles = styles;
    this._styleClass = new Style();
    // call setter
    super.style = this.generateStyle();
  }

  private generateAttributedString(): IAttributedString {
    console.log(this._styles.fontSize);
    return {
      _class: 'attributedString',
      string: `${this._text}`,
      attributes: [
        {
          _class: 'stringAttribute',
          location: 0,
          length: this._text.length,
          attributes: {
            MSAttributedStringFontAttribute: this.fontAttributes(),
            MSAttributedStringColorAttribute: this._styleClass.convertColor(this._styles.color),
            paragraphStyle: this.paragraphStyle(),
            kerning: 0
          }
        }
      ]
    };
  }

  private paragraphStyle(): IParagraphStyle {
    return {
      _class: 'paragraphStyle',
      alignment: 0,
      maximumLineHeight: 19,
      minimumLineHeight: 19,
      paragraphSpacing: 8,
      allowsDefaultTighteningForTruncation: 0
    }
  }

  private fontAttributes(): IMSAttributedStringFontAttribute {
    return {
      _class: 'fontDescriptor',
      attributes: {
        name: this._styles.fontFamily.split(',')[0],
        size: parseInt(this._styles.fontSize, 10)
      }
    }
  }

  private generateStyle(): IStyle {

    return  {
      ...this._styleClass.generateObject(),
      textStyle: {
        _class: 'textStyle',
        encodedAttributes: {
          MSAttributedStringColorAttribute: this._styleClass.convertColor(this._styles.color),
          MSAttributedStringFontAttribute:  this.fontAttributes(),
          paragraphStyle: this.paragraphStyle(),
          kerning: 0
        },
        verticalAlignment: 0
      }
    }
  }

  generateObject(): IText {
    const base: IBase = super.generateObject();
    console.log(JSON.stringify(this.generateAttributedString(),null, 2))
    return {
      ...base,
      nameIsFixed: true,
      attributedString: this.generateAttributedString(),
      frame: super.addFrame('rect'),
      automaticallyDrawOnUnderlyingPath: false,
      dontSynchroniseWithSymbol: false,
      glyphBounds: '{{0, 0}, {103, 18}}',
      lineSpacingBehaviour: 2,
      textBehaviour: 0
    }
  }
}
