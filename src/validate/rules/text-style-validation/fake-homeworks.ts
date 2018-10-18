import { SketchObjectTypes, SketchStyle } from '@sketch-draw/interfaces';
import { IValidationContextParents } from 'validate/interfaces/validation-rule.interface';

const artboardSizes: String[] = [
  '360',
  '1280',
  '1920',
];

export const getFakeHomeworks = sketchDocument => [
  {
    _class: SketchObjectTypes.Page,
    do_objectID: 'C8BAFBE8-F0F0-4727-B952-7303F9CA3F33',
    name: '360',
    parents: {} as IValidationContextParents,
    ruleOptions: {
      artboardSizes,
    },
    sharedStyleID: 'BEFA4ED9-125C-4E1F-A581-2F54BAD6445C',
    document: sketchDocument,
  },
  {
    _class: SketchObjectTypes.Page,
    do_objectID: 'C8BAFBE8-F0F0-4727-B952-7303F9CA3F33',
    name: '1280',
    parents: {} as IValidationContextParents,
    ruleOptions: {
      artboardSizes,
    },
    /* sharedStyleID has been removed */
    document: sketchDocument,
  },
  {
    _class: SketchObjectTypes.Page,
    do_objectID: '493BDF72-5E8F-44B1-8BE0-725BA0EDC7B1',
    name: '1920',
    parents: {} as IValidationContextParents,
    ruleOptions: {
      artboardSizes,
    },
    sharedStyleID: 'BEFA4ED9-125C-4E1F-A581-2F54BAD6445C',
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
            _class: 'fontDescriptor',
            attributes: {
              name: 'BerninaSans',
              size: 24, /* font size has been modified from 18 to 24px */
            },
          },
          paragraphStyle: {
            _class: 'paragraphStyle',
            alignment: 0,
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
    document: sketchDocument,
  },
];
