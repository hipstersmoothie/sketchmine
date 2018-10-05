import { createBorder } from './create-border';
import { StyleDeclaration } from '../../../dom-traverser/dom-visitor';
import { IBounding } from '../interfaces';
import { FillType } from './sketch-constants';

describe('[sketch-generator] › helpers › create manual border with points', () => {
  const frame: IBounding = { x: 0, y: 0, width: 100, height: 100 };
  let styling: StyleDeclaration;

  beforeEach(() => {
    styling = new StyleDeclaration();
  });

  test('borderTop', () => {
    styling.borderTop = '1px solid rgb(0, 0, 0)';
    const border = createBorder(styling, frame);
    expect(border).toBeInstanceOf(Array);
    expect(border).toHaveLength(1);
    expect(border[0].style.borders).toBeInstanceOf(Array);
    expect(border[0].style.borders).toHaveLength(1);
    expect(border[0].style.borders[0].thickness).toEqual(1);
    expect(border[0].style.borders[0].fillType).toEqual(FillType.Solid);
    expect(border[0].points).toBeInstanceOf(Array);
    expect(border[0].points).toHaveLength(2);
    expect(border[0].points[0].point).toMatch(/0, 0/);
    expect(border[0].points[1].point).toMatch(/1, 0/);
  });

  test('borderTop + borderRight', () => {
    styling.borderTop = '1px solid rgb(0, 0, 0)';
    styling.borderRight = '1px solid rgb(0, 0, 0)';
    const border = createBorder(styling, frame);
    expect(border).toBeInstanceOf(Array);
    expect(border).toHaveLength(1);
    const points = border[0].points;
    expect(points).toBeInstanceOf(Array);
    expect(points).toHaveLength(3);
    expect(points[0].point).toMatch(/0, 0/);
    expect(points[1].point).toMatch(/1, 0/);
    expect(points[2].point).toMatch(/1, 1/);
  });

  test('borderTop + borderRight + borderBottom', () => {
    styling.borderTop = '1px solid rgb(0, 0, 0)';
    styling.borderRight = '1px solid rgb(0, 0, 0)';
    styling.borderBottom = '1px solid rgb(0, 0, 0)';
    const border = createBorder(styling, frame);
    expect(border).toHaveLength(1);
    const points = border[0].points;
    expect(points).toBeInstanceOf(Array);
    expect(points).toHaveLength(4);
    expect(points[0].point).toMatch(/0, 0/);
    expect(points[1].point).toMatch(/1, 0/);
    expect(points[2].point).toMatch(/1, 1/);
    expect(points[3].point).toMatch(/0, 1/);
  });

  test('borderTop + borderRight + borderBottom + borderLeft should be done with normal border', () => {
    styling.borderTop = '1px solid rgb(0, 0, 0)';
    styling.borderRight = '1px solid rgb(0, 0, 0)';
    styling.borderBottom = '1px solid rgb(0, 0, 0)';
    styling.borderLeft = '1px solid rgb(0, 0, 0)';
    const border = createBorder(styling, frame);
    expect(border).toBeInstanceOf(Array);
    expect(border).toHaveLength(0);
  });

  test('borderRight + borderLeft needs two shapes', () => {
    styling.borderRight = '1px solid rgb(0, 0, 0)';
    styling.borderLeft = '1px solid rgb(0, 0, 0)';
    const border = createBorder(styling, frame);
    expect(border).toBeInstanceOf(Array);
    expect(border).toHaveLength(2);
    expect(border[0].points).toHaveLength(2);
    expect(border[1].points).toHaveLength(2);
  });

  test('borderRight has different styling than borderBottom draw two shapes', () => {
    styling.borderRight = '1px solid rgb(0, 0, 0)';
    styling.borderBottom = '3px solid rgb(0, 0, 0)';
    const border = createBorder(styling, frame);
    expect(border).toBeInstanceOf(Array);
    expect(border).toHaveLength(2);
    const right = border[0];
    expect(right.style).toHaveProperty('borders');
    expect(right.style.borders[0].thickness).toEqual(1);
    expect(right.points).toBeInstanceOf(Array);
    expect(right.points).toHaveLength(2);
    expect(right.points[0].point).toMatch(/1, 0/);
    expect(right.points[1].point).toMatch(/1, 1/);

    const bottom = border[1];
    expect(bottom.style).toHaveProperty('borders');
    expect(bottom.style.borders[0].thickness).toEqual(3);
    expect(bottom.points).toBeInstanceOf(Array);
    expect(bottom.points).toHaveLength(2);
    expect(bottom.points[0].point).toMatch(/1, 1/);
    expect(bottom.points[1].point).toMatch(/0, 1/);
  });
});
