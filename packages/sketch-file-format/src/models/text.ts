import { Base } from './base';
import {
  SketchBase,
  SketchText,
  SketchAttributedString,
  SketchFontDescriptor,
  SketchParagraphStyle,
  SketchEncodedAttributes,
  SketchObjectTypes,
  IBounding,
  SketchAttribute,
  SketchTextStyle,
  SketchFrame,
} from '../interfaces';
import {
  fixWhiteSpace,
  UnderlineStyle,
  StrikethroughStyle,
  TextTransform,
  fontMapping,
  fontStyle,
  TextBehaviour,
  kerningTableBernina,
} from '../helpers';
import { StyleDeclaration } from '@sketchmine/dom-agent';
import { resolveTextDecoration, TextDecoration } from '../helpers/resolve-text-decoration';
import { resolveTextAlign } from '../helpers/resolve-text-align';
import { colorToSketchColor } from '../helpers/color-to-sketch-color';
import { Style } from './style';

export class Text extends Base {
  private textContent = '';
  private multiline = false;
  textDecoration: TextDecoration | null;
  fontSize: number;

  set text(text: string) { this.textContent = fixWhiteSpace(text, this.styles.whiteSpace); }
  get text(): string { return this.textContent; }

  constructor(bounding: IBounding, public styles: StyleDeclaration) {
    super(bounding);
    super.className = SketchObjectTypes.Text;

    if (!styles) {
      throw new Error('Text always have to have a style!');
    }
    this.textDecoration = resolveTextDecoration(styles.textDecoration);
    this.fontSize = parseInt(this.styles.fontSize, 10) - 2; // Sketch does not calculate the font in px
  }

  addParagraphStyle(): SketchParagraphStyle {
    const lh = this.styles.lineHeight;
    const display = this.styles.display;
    /**
     * When the font size is normal the browser sets it of 1.2 of the font size:
     * @see https://www.w3.org/TR/CSS22/visudet.html#line-height
    */
    const lineHeight = (lh === 'normal' || display === 'inline') ? Math.ceil(this.fontSize * 1.2) : parseInt(lh, 10);
    return {
      _class: SketchObjectTypes.ParagraphStyle,
      alignment: resolveTextAlign(this.styles.textAlign),
      maximumLineHeight: lineHeight,
      minimumLineHeight: lineHeight,
      paragraphSpacing: 0,
      allowsDefaultTighteningForTruncation: 0,
    };
  }

  addUnderline(): number {
    if (this.textDecoration && this.textDecoration.type === 'underline') {
      switch (this.textDecoration.style) {
        case 'double': return UnderlineStyle.Double;
        case 'solid': return UnderlineStyle.Underline;
      }
    }
    return UnderlineStyle.None;
  }

  addStrikeThrough(): number {
    if (this.textDecoration && this.textDecoration.type === 'line-through') {
      return StrikethroughStyle.LineThrough;
    }
    return StrikethroughStyle.None;
  }

  addKerning(): number {
    let kerning = kerningTableBernina(this.fontSize);
    if (this.styles.letterSpacing !== 'normal') {
      kerning = parseFloat(this.styles.letterSpacing);
    }
    return kerning;
  }

  addTextTransform(): number {
    switch (this.styles.textTransform) {
      case 'uppercase':
        return TextTransform.Uppercase;
      case 'lowercase':
        return TextTransform.Lowercase;
      default:
        return TextTransform.None;
    }
  }

  addParagraphSpacing(): number | undefined {
    // TODO: need to implement
    return undefined;
  }

  createFontDescriptor(): SketchFontDescriptor {
    const fontFamily = this.styles.fontFamily.split(',')[0];
    const fontWeight = this.styles.fontWeight;
    const fontVariant = this.styles.fontStyle as fontStyle;

    return {
      _class: SketchObjectTypes.FontDescriptor,
      attributes: {
        name: fontMapping(fontFamily, fontWeight, fontVariant),
        size: this.fontSize,
      },
    };
  }

  createTextStyleAttributes() : SketchEncodedAttributes {
    return {
      kerning: this.addKerning(),
      MSAttributedStringColorAttribute: colorToSketchColor(this.styles.color),
      MSAttributedStringFontAttribute: this.createFontDescriptor(),
      MSAttributedStringTextTransformAttribute: this.addTextTransform(),
      paragraphSpacing: this.addParagraphSpacing(),
      paragraphStyle: this.addParagraphStyle(),
      strikethroughStyle: this.addStrikeThrough(),
      textStyleVerticalAlignmentKey: 0,
      underlineStyle: this.addUnderline(),
    };
  }

  createAttribute(location: number, length: number): SketchAttribute {
    return {
      _class: SketchObjectTypes.StringAttribute,
      location,
      length,
      attributes: this.createTextStyleAttributes(),
    };
  }

  createAttributedString(): SketchAttributedString {
    return {
      _class: SketchObjectTypes.AttributedString,
      string: `${this.textContent}`,
      attributes: [
        this.createAttribute(0, this.textContent.length),
      ],
    };
  }

  addTextStyle(): SketchTextStyle {
    return {
      _class: SketchObjectTypes.TextStyle,
      encodedAttributes: this.createTextStyleAttributes(),
      verticalAlignment: 0,
    };
  }

  generateGlyphBounds(frame: SketchFrame): string {
    let height = frame.height;

    // if style display inline the bounding client gets ignored for the size
    if (this.styles.display === 'inline') {
      height = Math.ceil(this.fontSize * 1.2);
    }

    return `{{${frame.x}, ${frame.y}}, {${frame.width}, ${height}}}`;
  }

  generateObject(): SketchText {
    const base: SketchBase = super.generateObject();
    base.style = new Style().generateObject();
    base.style.textStyle = this.addTextStyle();
    const frame = super.addFrame();

    if (frame.height > parseInt(this.styles.lineHeight, 10)) {
      this.multiline = true;
    }

    return {
      ...base,
      nameIsFixed: true,
      attributedString: this.createAttributedString(),
      frame,
      automaticallyDrawOnUnderlyingPath: false,
      dontSynchroniseWithSymbol: false,
      glyphBounds: this.generateGlyphBounds(frame),
      lineSpacingBehaviour: 2,
      textBehaviour: this.multiline ? TextBehaviour.Fixed : TextBehaviour.Auto,
    } as SketchText;
  }
}
