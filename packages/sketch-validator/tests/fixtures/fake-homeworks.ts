import { SketchObjectTypes, SketchStyle } from '@sketchmine/sketch-file-format';
import { IValidationContextParents, IValidationContext } from '../../src/interfaces';

const artboardSizes: String[] = [
  '360',
  '1280',
  '1920',
];

const HEADLINE_TEXT_STYLES = [
  '1920-H1', '1920-H2', '1920-H3',
  '1280-H1', '1280-H2', '1280-H3',
  '360-H1', '360-H2', '360-H3',
];

const VALID_TEXT_COLORS = [
  '#FFFFFF', // white
  '#CCCCCC', // gray-300
  '#B7B7B7', // gray-400
  '#898989', // gray-500
  '#454646', // gray-700, text color
  '#00A1B2', // turquoise-600, link color
  '#00848e', // turquoise-700, link hover color
  '#DC172A', // red-500, error color
  '#C41425', // red-600, error hover color
  '#5EAD35', // green-600
  '#3F962A', // green-700
];

export const getFakeHomeworks = (sketchDocument) :IValidationContext[] => [
  {
    _class: SketchObjectTypes.Page,
    do_objectID: 'C8BAFBE8-F0F0-4727-B952-7303F9CA3F33',
    name: '360',
    parents: {} as IValidationContextParents,
    ruleOptions: {
      artboardSizes,
      document: sketchDocument,
      sharedStyleID: 'BEFA4ED9-125C-4E1F-A581-2F54BAD6445C',
    },
  },
  {
    _class: SketchObjectTypes.Page,
    do_objectID: 'C8BAFBE8-F0F0-4727-B952-7303F9CA3F33',
    name: '1280',
    parents: {} as IValidationContextParents,
    ruleOptions: {
      artboardSizes,
      document: sketchDocument,
      /* sharedStyleID is missing */
    },
  },
  {
    _class: SketchObjectTypes.Page,
    do_objectID: 'C8BAFBE8-F0F0-4727-B952-7303F9CA3F33',
    name: '1280',
    parents: {} as IValidationContextParents,
    ruleOptions: {
      artboardSizes,
      VALID_TEXT_COLORS,
      document: sketchDocument,
      /* sharedStyleID is missing, there are more attributed strings, only color is different */
      stringAttributes: [
        {
          _class: SketchObjectTypes.StringAttribute,
          location: 0,
          length: 17,
          attributes: {
            MSAttributedStringFontAttribute: {
              _class: SketchObjectTypes.FontDescriptor,
              attributes: {
                name: 'BerninaSans',
                size: 14,
              },
            },
            MSAttributedStringColorAttribute: {
              _class: SketchObjectTypes.Color,
              alpha: 1,
              blue: 0.2745098039215687,
              green: 0.2745098039215687,
              red: 0.2705882352941176,
            },
            kerning: 0,
            textStyleVerticalAlignmentKey: 0,
            paragraphStyle: {
              _class: SketchObjectTypes.ParagraphStyle,
              alignment: 0,
              allowsDefaultTighteningForTruncation: 0,
            },
          },
        },
        {
          _class: SketchObjectTypes.StringAttribute,
          location: 17,
          length: 9,
          attributes: {
            MSAttributedStringFontAttribute: {
              _class: SketchObjectTypes.FontDescriptor,
              attributes: {
                name: 'BerninaSans',
                size: 14,
              },
            },
            MSAttributedStringColorAttribute: {
              _class: SketchObjectTypes.Color,
              alpha: 1,
              blue: 0.6980392156862745,
              green: 0.6313725490196078,
              red: 0,
            },
            kerning: 0,
            textStyleVerticalAlignmentKey: 0,
            paragraphStyle: {
              _class: SketchObjectTypes.ParagraphStyle,
              alignment: 0,
              allowsDefaultTighteningForTruncation: 0,
            },
          },
        },
        {
          _class: SketchObjectTypes.StringAttribute,
          location: 26,
          length: 43,
          attributes: {
            MSAttributedStringFontAttribute: {
              _class: SketchObjectTypes.FontDescriptor,
              attributes: {
                name: 'BerninaSans',
                size: 14,
              },
            },
            MSAttributedStringColorAttribute: {
              _class: SketchObjectTypes.Color,
              alpha: 1,
              blue: 0.2745098039215687,
              green: 0.2745098039215687,
              red: 0.2705882352941176,
            },
            kerning: 0,
            textStyleVerticalAlignmentKey: 0,
            paragraphStyle: {
              _class: SketchObjectTypes.ParagraphStyle,
              alignment: 0,
              allowsDefaultTighteningForTruncation: 0,
            },
          },
        },
      ],
    },
  },
  {
    _class: SketchObjectTypes.Page,
    do_objectID: 'C8BAFBE8-F0F0-4727-B952-7303F9CA3F33',
    name: '1280',
    parents: {} as IValidationContextParents,
    ruleOptions: {
      artboardSizes,
      VALID_TEXT_COLORS,
      document: sketchDocument,
      /* sharedStyleID is missing, there are more attributed strings, font size is different */
      stringAttributes: [
        {
          _class: SketchObjectTypes.StringAttribute,
          location: 0,
          length: 14,
          attributes: {
            MSAttributedStringFontAttribute: {
              _class: SketchObjectTypes.FontDescriptor,
              attributes: {
                name: 'BerninaSans',
                size: 20,
              },
            },
            MSAttributedStringColorAttribute: {
              _class: SketchObjectTypes.Color,
              alpha: 1,
              blue: 0.2745098039215687,
              green: 0.2745098039215687,
              red: 0.2705882352941176,
            },
            kerning: 0,
            textStyleVerticalAlignmentKey: 0,
            paragraphStyle: {
              _class: SketchObjectTypes.ParagraphStyle,
              alignment: 0,
              allowsDefaultTighteningForTruncation: 0,
            },
          },
        },
        {
          _class: SketchObjectTypes.StringAttribute,
          location: 14,
          length: 22,
          attributes: {
            MSAttributedStringFontAttribute: {
              _class: SketchObjectTypes.FontDescriptor,
              attributes: {
                name: 'BerninaSans',
                size: 14,
              },
            },
            MSAttributedStringColorAttribute: {
              _class: SketchObjectTypes.Color,
              alpha: 1,
              blue: 0.2745098039215687,
              green: 0.2745098039215687,
              red: 0.2705882352941176,
            },
            kerning: 0,
            textStyleVerticalAlignmentKey: 0,
            paragraphStyle: {
              _class: SketchObjectTypes.ParagraphStyle,
              alignment: 0,
              allowsDefaultTighteningForTruncation: 0,
            },
          },
        },
      ],
    },
  },
  {
    _class: SketchObjectTypes.Page,
    do_objectID: '493BDF72-5E8F-44B1-8BE0-725BA0EDC7B1',
    name: '1280',
    parents: {
      page: '1280',
      artboard: '1280-Applications',
      symbolMaster: undefined,
    } as IValidationContextParents,
    ruleOptions: {
      artboardSizes,
      HEADLINE_TEXT_STYLES,
      sharedStyleID: 'BEFA4ED9-125C-4E1F-A581-2F54BAD6445C',
      document: sketchDocument,
    },
    style: {
      _class: 'style',
      do_objectID: 'BF938701-9486-44E4-A538-50007F2CFA5E',
      endMarkerType: 0,
      miterLimit: 10,
      startMarkerType: 0,
      textStyle: {
        _class: 'textStyle',
        do_objectID: '6AC5328F-88AA-4591-A2B7-6BB983AE6DEE',
        encodedAttributes: {
          MSAttributedStringFontAttribute: {
            _class: SketchObjectTypes.FontDescriptor,
            attributes: {
              name: 'BerninaSans',
              size: 24, /* font size has been modified from 18 to 24px */
            },
          },
          paragraphStyle: {
            _class: SketchObjectTypes.ParagraphStyle,
            alignment: 0,
            allowsDefaultTighteningForTruncation: 0,
          },
          MSAttributedStringColorAttribute: {
            _class: SketchObjectTypes.Color,
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
  {
    _class: SketchObjectTypes.Page,
    do_objectID: '493BDF72-5E8F-44B1-8BE0-725BA0EDC7B1',
    name: '1920',
    parents: {
      page: '1920',
      artboard: '1920-Applications',
      symbolMaster: undefined,
    } as IValidationContextParents,
    ruleOptions: {
      artboardSizes,
      HEADLINE_TEXT_STYLES,
      sharedStyleID: 'BEFA4ED9-125C-4E1F-A581-2F54BAD6445C',
      document: sketchDocument,
    },
    style: {
      _class: 'style',
      do_objectID: 'BF938701-9486-44E4-A538-50007F2CFA5E',
      endMarkerType: 0,
      miterLimit: 10,
      startMarkerType: 0,
      textStyle: {
        _class: 'textStyle',
        do_objectID: '6AC5328F-88AA-4591-A2B7-6BB983AE6DEE',
        encodedAttributes: {
          MSAttributedStringFontAttribute: {
            _class: SketchObjectTypes.FontDescriptor,
            attributes: {
              name: 'BerninaSans',
              size: 18,
            },
          },
          paragraphStyle: {
            _class: SketchObjectTypes.ParagraphStyle,
            alignment: 0,
            allowsDefaultTighteningForTruncation: 0,
          },
          MSAttributedStringColorAttribute: {
            _class: SketchObjectTypes.Color,
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
  {
    _class: SketchObjectTypes.Page,
    do_objectID: '493BDF72-5E8F-44B1-8BE0-725BA0EDC7B1',
    name: '1280',
    parents: {
      page: '1280',
      artboard: '1280-Applications',
      symbolMaster: undefined,
    } as IValidationContextParents,
    ruleOptions: {
      artboardSizes,
      VALID_TEXT_COLORS,
      stringAttributes: [
        {
          _class: SketchObjectTypes.StringAttribute,
          location: 0,
          length: 14,
          attributes: {
            MSAttributedStringFontAttribute: {
              _class: SketchObjectTypes.FontDescriptor,
              attributes: {
                name: 'BerninaSans',
                size: 11, /* too small */
              },
            },
            MSAttributedStringColorAttribute: {
              _class: SketchObjectTypes.Color,
              alpha: 1,
              blue: 0.2745098039215687,
              green: 0.2745098039215687,
              red: 0.2705882352941176,
            },
            kerning: 0,
            textStyleVerticalAlignmentKey: 0,
            paragraphStyle: {
              _class: SketchObjectTypes.ParagraphStyle,
              alignment: 0,
              allowsDefaultTighteningForTruncation: 0,
            },
          },
        },
        {
          _class: SketchObjectTypes.StringAttribute,
          location: 14,
          length: 22,
          attributes: {
            MSAttributedStringFontAttribute: {
              _class: SketchObjectTypes.FontDescriptor,
              attributes: {
                name: 'BerninaSans',
                size: 14,
              },
            },
            MSAttributedStringColorAttribute: { /* wrong color */
              _class: SketchObjectTypes.Color,
              alpha: 1,
              blue: 0.8784313725490196,
              green: 0.5882352941176471,
              red: 0.7647058823529411,
            },
            kerning: 0,
            textStyleVerticalAlignmentKey: 0,
            paragraphStyle: {
              _class: SketchObjectTypes.ParagraphStyle,
              alignment: 0,
              allowsDefaultTighteningForTruncation: 0,
            },
          },
        },
      ],
      document: sketchDocument,
    },
  },
];
