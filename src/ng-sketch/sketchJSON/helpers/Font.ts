// import { IColor } from "../interfaces/Style";




// function createStringAttributes(textStyles: TextStyle): Object {
//   // const font = findFont(textStyles);

//   const attribs:  = {
//     MSAttributedStringFontAttribute: font.fontDescriptor(),
//     NSFont: font,
//     NSParagraphStyle: makeParagraphStyle(textStyles),
//     NSUnderline: TEXT_DECORATION_UNDERLINE[textStyles.textDecoration] || 0,
//     NSStrikethrough: TEXT_DECORATION_LINETHROUGH[textStyles.textDecoration] || 0,
//   };

//   const color = makeColorFromCSS(textStyles.color || 'black');

//   if (getSketchVersion() >= 50) {
//     attribs.MSAttributedStringColorAttribute = color;
//   } else {
//     attribs.NSColor = NSColor.colorWithDeviceRed_green_blue_alpha(
//       color.red,
//       color.green,
//       color.blue,
//       color.alpha,
//     );
//   }

//   if (textStyles.letterSpacing !== undefined) {
//     attribs.NSKern = textStyles.letterSpacing;
//   }

//   if (textStyles.textTransform !== undefined) {
//     attribs.MSAttributedStringTextTransformAttribute = TEXT_TRANSFORM[textStyles.textTransform] * 1;
//   }

//   return attribs;
// }
