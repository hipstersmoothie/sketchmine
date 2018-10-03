import { Text } from './text';
import { IBounding, SketchObjectTypes, SketchText, SketchColor } from '../interfaces';
import { StyleDeclaration } from '../../../dom-traverser/dom-visitor';
import { TextBehaviour, StrikethroughStyle, UnderlineStyle, TextAlignment } from '../helpers';

const TEXT = 'New Text for the test';

describe('[sketch-generator] › models › generate text', () => {
  let size: IBounding;
  let styles: StyleDeclaration;

  beforeEach(() => {
    size = { x: 0, y: 0, width: 100, height: 100 };
    styles = new StyleDeclaration();
  });

  test('generated object contains the right values', () => {
    const text = new Text(size, styles);
    text.text = TEXT;
    const sketchObject = text.generateObject();
    expect(sketchObject).toMatchObject(
      expect.objectContaining({
        _class: SketchObjectTypes.Text,
        do_objectID: expect.any(String),
        exportOptions: expect.anything(),
        isFlippedHorizontal: false,
        isFlippedVertical: false,
        isLocked: false,
        isVisible: true,
        layerListExpandedType: expect.any(Number),
        layers: undefined,
        name: expect.any(String),
        nameIsFixed: true,
        resizingConstraint: expect.any(Number),
        resizingType: expect.any(Number),
        rotation: expect.any(Number),
        shouldBreakMaskChain: false,
        style: expect.objectContaining({
          _class: SketchObjectTypes.Style,
          endMarkerType: expect.any(Number),
          miterLimit: expect.any(Number),
          startMarkerType: expect.any(Number),
          windingRule: 1,
          textStyle: expect.anything(),
        }),
        attributedString: expect.objectContaining({
          _class: SketchObjectTypes.AttributedString,
          string: TEXT,
          attributes: expect.any(Array),
        }),
        frame: expect.objectContaining({
          _class: SketchObjectTypes.Frame,
          constrainProportions: false,
          ...size,
        }),
        automaticallyDrawOnUnderlyingPath: false,
        dontSynchroniseWithSymbol: false,
        glyphBounds: `{{${size.x}, ${size.y}}, {${size.width}, ${size.height}}}`,
        lineSpacingBehaviour: 2,
        textBehaviour: TextBehaviour.Auto,
      }));
  });

  test('font color is correctly set', () => {
    styles.color = 'rgb(69, 70, 70)';
    const text = new Text(size, styles);
    text.text = TEXT;
    const sketchObject = text.generateObject();
    const attributes = sketchObject.style.textStyle.encodedAttributes;

    expect(attributes.MSAttributedStringColorAttribute).toMatchObject(
      expect.objectContaining({
        _class: SketchObjectTypes.Color,
        alpha: 1,
        red: 69 / 255,
        green: 70 / 255,
        blue: 70 / 255,
      } as SketchColor));
  });

  test('font weight normal gets set correctly', () => {
    styles.fontFamily = 'BerninaSansWeb';
    styles.fontWeight = '400';
    styles.fontStyle = 'normal';
    styles.fontSize = '14px';
    const text = new Text(size, styles);
    text.text = TEXT;
    const sketchObject = text.generateObject();
    const attributes = sketchObject.style.textStyle.encodedAttributes;

    expect(attributes.MSAttributedStringFontAttribute).toMatchObject(
      expect.objectContaining({
        _class: SketchObjectTypes.FontDescriptor,
        attributes: expect.objectContaining({
          name: 'BerninaSans',
          size: 14,
        }),
      }));
  });

  test('font weight italic with light variant', () => {
    styles.fontFamily = 'BerninaSansWeb';
    styles.fontWeight = '300';
    styles.fontStyle = 'italic';
    styles.fontSize = '15px';
    const text = new Text(size, styles);
    text.text = TEXT;
    const sketchObject = text.generateObject();
    const attributes = sketchObject.style.textStyle.encodedAttributes;

    expect(attributes.MSAttributedStringFontAttribute).toMatchObject(
      expect.objectContaining({
        _class: SketchObjectTypes.FontDescriptor,
        attributes: expect.objectContaining({
          name: 'BerninaSans-LightItalic',
          size: 15,
        }),
      }));
  });

  test('paragraph styling with lineheight normal inherits from fontsize', () => {
    styles.fontSize = '15px';
    styles.lineHeight = 'normal';
    styles.textAlign = 'right';
    const text = new Text(size, styles);
    text.text = TEXT;
    const sketchObject = text.generateObject();
    const attributes = sketchObject.style.textStyle.encodedAttributes;

    expect(attributes.paragraphStyle).toMatchObject(
      expect.objectContaining({
        _class: SketchObjectTypes.ParagraphStyle,
        alignment: TextAlignment.Right,
        maximumLineHeight: 15,
        minimumLineHeight: 15,
        paragraphSpacing: 0,
        allowsDefaultTighteningForTruncation: 0,
      }));
  });

  test('paragraph styling with lineheight set in px', () => {
    styles.fontSize = '15px';
    styles.lineHeight = '22px';
    styles.textAlign = 'center';
    const text = new Text(size, styles);
    text.text = TEXT;
    const sketchObject = text.generateObject();
    const attributes = sketchObject.style.textStyle.encodedAttributes;

    expect(attributes.paragraphStyle).toMatchObject(
      expect.objectContaining({
        _class: SketchObjectTypes.ParagraphStyle,
        alignment: TextAlignment.Center,
        maximumLineHeight: 22,
        minimumLineHeight: 22,
        paragraphSpacing: 0,
        allowsDefaultTighteningForTruncation: 0,
      }));
  });

  test('if none strike through style is set', () => {
    const text = new Text(size, styles);
    text.text = TEXT;
    const sketchObject = text.generateObject();
    const attributes = sketchObject.style.textStyle.encodedAttributes;
    expect(attributes.strikethroughStyle).toEqual(StrikethroughStyle.None);
  });

  test('if strike through text style is set', () => {
    styles.textDecoration = 'line-through solid rgb(0, 0, 0)';
    const text = new Text(size, styles);
    text.text = TEXT;
    const sketchObject = text.generateObject();
    const attributes = sketchObject.style.textStyle.encodedAttributes;
    expect(attributes.strikethroughStyle).toEqual(StrikethroughStyle.LineThrough);
    expect(attributes.underlineStyle).toEqual(UnderlineStyle.None);
  });

  test('if underline text style is set', () => {
    styles.textDecoration = 'underline solid rgb(0,0,0)';
    const text = new Text(size, styles);
    text.text = TEXT;
    const sketchObject = text.generateObject();
    const attributes = sketchObject.style.textStyle.encodedAttributes;
    expect(attributes.underlineStyle).toEqual(UnderlineStyle.Underline);
    expect(attributes.strikethroughStyle).toEqual(StrikethroughStyle.None);
  });

  test('if underline double text style is set', () => {
    styles.textDecoration = 'underline double rgb(0,0,0)';
    const text = new Text(size, styles);
    text.text = TEXT;
    const sketchObject = text.generateObject();
    const attributes = sketchObject.style.textStyle.encodedAttributes;
    expect(attributes.underlineStyle).toEqual(UnderlineStyle.Double);
    expect(attributes.strikethroughStyle).toEqual(StrikethroughStyle.None);
  });

  test('unknown text decoration like blink', () => {
    styles.textDecoration = 'blink solid rgb(0,0,0)';
    const text = new Text(size, styles);
    text.text = TEXT;
    expect(text.textDecoration.type).toMatch('blink');
    const sketchObject = text.generateObject();
    const attributes = sketchObject.style.textStyle.encodedAttributes;
    expect(attributes.underlineStyle).toEqual(UnderlineStyle.None);
    expect(attributes.strikethroughStyle).toEqual(StrikethroughStyle.None);
  });
});
