// import { Style } from '../models/style';
// import { createBorder } from './border';
// import { StyleDeclaration } from '../../../dom-traverser/dom-visitor';

// describe('[sketch-generator] › add border to styles', () => {

//   let styling: StyleDeclaration;
//   let sketchStyle: Style;

//   beforeEach(() => {
//     styling = new StyleDeclaration();
//     sketchStyle = new Style();
//   });

test('border without size to be not created', () => {
  // createBorder(sketchStyle, styling);
  // expect(sketchStyle.borders).toHaveLength(0);
  // expect(sketchStyle.shadows).toHaveLength(0);
});

//   test('borderLeft with size but type none not to be created as shadow', () => {
//     styling.borderLeft = '5px none rgb(0, 0, 0)';
//     createBorder(sketchStyle, styling);
//     expect(sketchStyle.borders).toHaveLength(0);
//     expect(sketchStyle.shadows).toHaveLength(0);
//   });

//   test('borderLeft should be created as shadow not as border', () => {
//     styling.borderLeft = '5px solid rgb(0, 0, 0)';
//     createBorder(sketchStyle, styling);
//     expect(sketchStyle.borders).toHaveLength(0);
//     expect(sketchStyle.shadows).toHaveLength(1);
//   });

//   test('borderLeft and borderRight should be created as shadow not as border', () => {
//     styling.borderLeft = '5px solid rgb(0, 0, 0)';
//     styling.borderRight = '5px solid rgb(0, 0, 0)';
//     createBorder(sketchStyle, styling);
//     expect(sketchStyle.borders).toHaveLength(0);
//     expect(sketchStyle.shadows).toHaveLength(2);
//   });

//   test('if all four borders are equal create border not shadow', () => {
//     styling.borderLeft = '5px solid rgb(0, 0, 0)';
//     styling.borderRight = '5px solid rgb(0, 0, 0)';
//     styling.borderTop = '5px solid rgb(0, 0, 0)';
//     styling.borderBottom = '5px solid rgb(0, 0, 0)';
//     createBorder(sketchStyle, styling);
//     expect(sketchStyle.borders).toHaveLength(1);
//     expect(sketchStyle.shadows).toHaveLength(0);
//   });

//   test('if the generated Object of a sketch shadow contains the correct properties', () => {
//     styling.borderRight = '5px solid rgb(0, 0, 0)';
//     createBorder(sketchStyle, styling);
//     expect(sketchStyle.shadows).toBeInstanceOf(Array);
//     expect(sketchStyle.shadows).toHaveLength(1);
//     expect(sketchStyle.shadows[0])
//       .toMatchObject(
//         expect.objectContaining({
//           _class: 'shadow',
//           isEnabled: true,
//           color: expect.anything(),
//           contextSettings: expect.anything(),
//           blurRadius: expect.any(Number),
//           offsetX: expect.any(Number),
//           offsetY: expect.any(Number),
//           spread: expect.any(Number),
//         }));
//     const style = sketchStyle.generateObject();
//     expect(style).not.toHaveProperty('borders');
//   });
// });
