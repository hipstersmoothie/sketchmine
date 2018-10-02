import { LineTo } from './line-to';
import { ISvgPoint } from '@sketch-svg-parser/interfaces';
import { MoveTo } from '@sketch-svg-parser/models/move-to';

describe('[sketch-generator] › svg › line-to', () => {
  let start: ISvgPoint;
  let end: ISvgPoint;

  beforeEach(() => {
    start = { code: 'M', x: 0, y: 0 };
    end = { code: 'Z' };
  });

  test('draw vertical line to', () => {
    const line: ISvgPoint = { code: 'V', x: 1, y: 0, x0: start.x, y0: start.y };

    const moveTo = new MoveTo(start, line).generate();
    const lineTo = new MoveTo(line, start).generate();
    expect(moveTo).toMatchObject(
      expect.objectContaining({
        _class: 'curvePoint',
        cornerRadius: 0,
        curveFrom: '{0, 0}',
        curveMode: 4,
        curveTo: '{0, 0}',
        hasCurveFrom: false,
        hasCurveTo: false,
        point: '{0, 0}',
      }));
    expect(lineTo).toMatchObject(
      expect.objectContaining({
        _class: 'curvePoint',
        cornerRadius: 0,
        curveFrom: '{1, 0}',
        curveMode: 4,
        curveTo: '{1, 0}',
        hasCurveFrom: false,
        hasCurveTo: false,
        point: '{1, 0}',
      }));
  });

  test('draw normal line to', () => {
    const line: ISvgPoint = { code: 'L', x: 1, y: 1, x0: start.x, y0: start.y };

    const moveTo = new MoveTo(start, line).generate();
    const lineTo = new MoveTo(line, start).generate();
    expect(moveTo).toMatchObject(
      expect.objectContaining({
        _class: 'curvePoint',
        cornerRadius: 0,
        curveFrom: '{0, 0}',
        curveMode: 4,
        curveTo: '{0, 0}',
        hasCurveFrom: false,
        hasCurveTo: false,
        point: '{0, 0}',
      }));
    expect(lineTo).toMatchObject(
      expect.objectContaining({
        _class: 'curvePoint',
        cornerRadius: 0,
        curveFrom: '{1, 1}',
        curveMode: 4,
        curveTo: '{1, 1}',
        hasCurveFrom: false,
        hasCurveTo: false,
        point: '{1, 1}',
      }));
  });
});
