import { resolveTransform } from '../src/helpers';

const rotate90deg = 'matrix(6.12323e-17, 1, -1, 6.12323e-17, 0, 0)';
const rotateMinus90deg = 'matrix(6.12323e-17, -1, 1, 6.12323e-17, 0, 0)';
const rotate180deg = 'matrix(-1, 1.22465e-16, -1.22465e-16, -1, 0, 0)';

describe('[sketch-generator] > resolve transform matrix', () => {

  test('to contain the correct object porperties', () => {
    const transform = resolveTransform(rotate90deg);
    expect(transform).not.toBe(null);
    expect(transform).toMatchObject(
      expect.objectContaining({
        angle: expect.any(Number),
        scaleX: expect.any(Number),
        scaleY: expect.any(Number),
        skewX: expect.any(Number),
        skewY: expect.any(Number),
        translateX: expect.any(Number),
        translateY: expect.any(Number),
      }));
  });

  test('transform: rotate(90deg); produces correct angle', () => {
    const transform = resolveTransform(rotate90deg);
    expect(transform.angle).toBe(90);
  });

  test('transform: rotate(-90deg); produces correct angle', () => {
    const transform = resolveTransform(rotateMinus90deg);
    expect(transform.angle).toBe(-90);
  });

  test('transform: rotate(180deg); produces correct angle', () => {
    const transform = resolveTransform(rotate180deg);
    expect(transform.angle).toBe(180);
  });
});
