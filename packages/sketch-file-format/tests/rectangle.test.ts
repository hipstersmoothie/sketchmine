import { Rectangle, Style } from '../src/models';
import { IBounding, SketchObjectTypes, SketchStyle, SketchRectangle } from '../src/interfaces';
import { BooleanOperation, PatternFillType, FillType } from '../src/helpers';

const rotate90deg = 'matrix(6.12323e-17, 1, -1, 6.12323e-17, 0, 0)';

describe('[sketch-file-format] › models › create rectangle', () => {
  let size: IBounding;

  beforeEach(() => {
    size = { x: 0, y: 0, width: 100, height: 100 };
  });

  test('if rectangle object has correct format', () => {
    const rect = new Rectangle(size, 0);
    const sketchObject = rect.generateObject();
    expect(sketchObject).toMatchObject(
      expect.objectContaining({
        _class: SketchObjectTypes.Rectangle,
        do_objectID: expect.any(String),
        exportOptions: expect.anything(),
        isFlippedHorizontal: false,
        isFlippedVertical: false,
        isLocked: false,
        isVisible: true,
        layerListExpandedType: 0,
        name: expect.any(String),
        nameIsFixed: false,
        resizingConstraint: expect.any(Number),
        resizingType: expect.any(Number),
        rotation: 0,
        shouldBreakMaskChain: expect.any(Boolean),
        booleanOperation: BooleanOperation.None,
        edited: false,
        fixedRadius: 0,
        frame: expect.objectContaining({
          _class: SketchObjectTypes.Frame,
          constrainProportions: false,
          ...size,
        }),
        hasConvertedToNewRoundCorners: true,
        isClosed: true,
        pointRadiusBehaviour: 0,
        points: expect.anything(),
      } as SketchRectangle));
    expect(sketchObject.points).toHaveLength(4);
  });

  test('if rectangle gets rotated 90deg with transfrom matrix', () => {
    const rect = new Rectangle(size, 0);
    rect.addRotation(rotate90deg);
    const sketchObject = rect.generateObject();

    expect(sketchObject.rotation).toEqual(-90);
    expect(sketchObject.points.every(point => point.cornerRadius === 0)).toBeTruthy();
  });

  test('if rectangle gets correct border radius with one value for all', () => {
    const rect = new Rectangle(size, 5);
    const sketchObject = rect.generateObject();
    expect(sketchObject.points.every(point => point.cornerRadius === 5)).toBeTruthy();
  });

  test('if rectangle gets correct border radius with array of numbers', () => {
    const rect = new Rectangle(size, [0, 5, 5, 0]);
    const sketchObject = rect.generateObject();
    expect(sketchObject.points[0].cornerRadius).toEqual(0);
    expect(sketchObject.points[1].cornerRadius).toEqual(5);
    expect(sketchObject.points[2].cornerRadius).toEqual(5);
    expect(sketchObject.points[3].cornerRadius).toEqual(0);
  });

  test('if rectangle gets fill as style', () => {
    const rect = new Rectangle(size, 0);
    const style = new Style();
    style.addFill('#333333', 0.5);
    rect.style = style.generateObject();
    const sketchObject = rect.generateObject();
    expect(sketchObject).toHaveProperty('style');
    expect(sketchObject.style).toMatchObject(
      expect.objectContaining({
        _class: SketchObjectTypes.Style,
        endMarkerType: expect.any(Number),
        miterLimit: expect.any(Number),
        startMarkerType: expect.any(Number),
        windingRule: 1,
        fills: expect.any(Array),
      } as SketchStyle));

    expect(sketchObject.style.fills).toHaveLength(1);
    expect(sketchObject.style.fills[0]).toMatchObject(
      expect.objectContaining({
        _class: SketchObjectTypes.Fill,
        isEnabled: true,
        color: expect.objectContaining({
          _class: SketchObjectTypes.Color,
          alpha: 0.5,
          blue: expect.any(Number),
          green: expect.any(Number),
          red: expect.any(Number),
        }),
        fillType: FillType.Solid,
        noiseIndex: 0,
        noiseIntensity: 0,
        patternFillType: PatternFillType.Fill,
        patternTileScale: 1,
      }));
  });
});
