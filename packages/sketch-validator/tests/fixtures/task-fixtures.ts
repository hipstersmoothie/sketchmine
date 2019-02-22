import { SketchObjectTypes, SketchStyle } from '@sketchmine/sketch-file-format/src/interfaces';
import { IValidationContextParents, IValidationContext } from '../../src/interfaces';
import { ARTBOARD_SIZES, HEADLINE_TEXT_STYLES } from '../../src/config';

export const getTaskFixtures = (sketchDocument) :IValidationContext[] => [
  {
    _class: SketchObjectTypes.Text,
    do_objectID: 'E5874602-F156-41A6-9C46-EA5BE2C23F12',
    name: 'Test',
    parents: {
      page: '1280',
      artboard: '1280-test-ab',
      symbolMaster: undefined,
    } as IValidationContextParents,
    ruleNames: [],
    ruleOptions: {
      artboardSizes: ARTBOARD_SIZES,
      HEADLINE_TEXT_STYLES,
      sharedStyleID: '7D859186-4473-4A35-82F5-D3CF5F244689',
      document: sketchDocument,
    },
    style: {
      _class: 'style',
      do_objectID: 'F0ACB2B1-ACE0-4804-9103-E69EBBC4DC40',
      endMarkerType: 0,
      miterLimit: 10,
      startMarkerType: 0,
      textStyle: {
        _class: 'textStyle',
        encodedAttributes: {
          MSAttributedStringFontAttribute: {
            _class: 'fontDescriptor',
            attributes: {
              name: 'BerninaSansOffc-Semibold',
              size: 24, // font size has been modified, should be 26.4
            },
          },
          paragraphStyle: {
            _class: 'paragraphStyle',
            alignment: 0,
            maximumLineHeight: 36,
            minimumLineHeight: 36,
            allowsDefaultTighteningForTruncation: 0,
          },
          MSAttributedStringColorAttribute: {
            _class: 'color',
            alpha: 1,
            blue: 0.2745098039,
            green: 0.2745098039,
            red: 0.2705882353,
          },
          kerning: 0,
        },
        verticalAlignment: 0,
      },
      windingRule: 1,
    } as SketchStyle,
  },
];
