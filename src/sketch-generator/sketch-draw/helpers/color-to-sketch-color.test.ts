import { colorToSketchColor } from './color-to-sketch-color';
import { SketchObjectTypes } from '../interfaces';

describe('[sketch-generator] › helpers › convert color to sketch', () => {
  test('convert rgb(254, 37, 140) to sketch color', () => {
    const color = colorToSketchColor('rgb(254, 37, 140)');
    expect(color).toMatchObject(
      expect.objectContaining({
        _class: SketchObjectTypes.Color,
        red: 254 / 255,
        green: 37 / 255,
        blue: 140 / 255,
        alpha: 1,
      }));
  });

  test('convert rgba(254, 37, 140, 0.5) with alpha to sketch color', () => {
    const color = colorToSketchColor('rgba(254, 37, 140, 0.5)');
    expect(color).toMatchObject(
      expect.objectContaining({
        _class: SketchObjectTypes.Color,
        red: 254 / 255,
        green: 37 / 255,
        blue: 140 / 255,
        alpha: expect.any(Number),
      }));
    /** @see http://www.bentedder.com/rounding-errors-unit-testing-math-react-jest/ */
    expect(color.alpha).toBeCloseTo(0.5);
  });

  test('convert #454646 to sketch color', () => {
    const color = colorToSketchColor('#454646');
    expect(color.red).toBeCloseTo(69 / 255);
    expect(color.green).toBeCloseTo(70 / 255);
    expect(color.blue).toBeCloseTo(70 / 255);
    expect(color.alpha).toBeCloseTo(1);
  });
});
