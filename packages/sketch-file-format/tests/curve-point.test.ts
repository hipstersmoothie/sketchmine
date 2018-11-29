import { CurvePoint } from '../src/models/curve-point';
import { SketchObjectTypes } from '../src/interfaces';
import { CurvePointMode } from '../src/helpers';

describe('[sketch-generator] › models › curve point', () => {

  test('simple point without tangents', () => {
    const point = { x: 0, y: 0 };
    const cpoint = new CurvePoint(point, point, point);
    expect(cpoint.hasCurveFrom).toBeFalsy();
    expect(cpoint.hasCurveTo).toBeFalsy();
    expect(cpoint.generateObject()).toMatchObject(
      expect.objectContaining({
        _class: SketchObjectTypes.CurvePoint,
        cornerRadius: 0,
        curveFrom: '{0, 0}',
        curveMode: CurvePointMode.Disconnected,
        curveTo: '{0, 0}',
        hasCurveFrom: false,
        hasCurveTo: false,
        point: '{0, 0}',
      }));
  });

  test('set corner radius on curve point', () => {
    const point = { x: 0, y: 0 };
    const radius = 100;
    const cpoint = new CurvePoint(point, point, point);
    cpoint.radius = radius;
    const sketchPoint = cpoint.generateObject();
    expect(sketchPoint).toHaveProperty('cornerRadius');
    expect(sketchPoint.cornerRadius).toEqual(radius);
  });

  test('curve point has tangent from last point', () => {
    const point = { x: 0, y: 0 };
    const from = { x: 0, y: 100 };
    const cpoint = new CurvePoint(point, from, point);

    expect(cpoint.hasCurveFrom).toBeTruthy();
    expect(cpoint.hasCurveTo).toBeFalsy();
  });

  test('curve point has two tangent controlll points', () => {
    const point = { x: 0, y: 0 };
    const from = { x: 10, y: 100 };
    const to = { x: 70, y: 45 };
    const cpoint = new CurvePoint(point, from, to);

    expect(cpoint.hasCurveFrom).toBeTruthy();
    expect(cpoint.hasCurveTo).toBeTruthy();
  });
});
