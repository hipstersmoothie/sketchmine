import { StyleDeclaration } from '@sketchmine/dom-agent';
import { resolveBorder } from '../src/helpers';

describe('[sketch-generator] › add border to styles', () => {

  let styling: StyleDeclaration;

  beforeEach(() => {
    styling = new StyleDeclaration();
  });

  test('border without size to be not created', () => {
    const border = resolveBorder(styling);
    expect(border).toBeNull();
  });

  test('borderLeft with size but type none not to be created', () => {
    styling.borderLeft = '5px none rgb(0, 0, 0)';
    const border = resolveBorder(styling);
    expect(border).toBeNull();
  });

  test('borderLeft to be created', () => {
    styling.borderLeft = '5px solid rgb(0, 0, 0)';
    const border = resolveBorder(styling);
    expect(border).toBeInstanceOf(Array);
    expect(border).toHaveLength(4);
    expect(border[3]).not.toBeNull();
    expect(border[3]).toMatchObject(expect.objectContaining({
      width: 5,
      style: 'solid',
      color: 'rgb(0, 0, 0)',
    }));
    expect(border[0]).toBeNull();
    expect(border[1]).toBeNull();
    expect(border[2]).toBeNull();
  });

  test('should create all borders except bottom one', () => {
    styling.borderTop = '5px solid rgb(0, 0, 0)';
    styling.borderRight = '5px solid rgb(0, 0, 0)';
    styling.borderLeft = '5px solid rgb(0, 0, 0)';
    const border = resolveBorder(styling);
    expect(border).toBeInstanceOf(Array);
    expect(border).toHaveLength(4);
    expect(border[0]).not.toBeNull();
    expect(border[1]).not.toBeNull();
    expect(border[2]).toBeNull();
    expect(border[3]).not.toBeNull();
  });

  test('border top to be null, left and right should be defined', () => {
    styling.borderTop = '5px none rgb(0, 0, 0)';
    styling.borderRight = '5px solid rgb(0, 0, 0)';
    styling.borderLeft = '5px solid rgb(0, 0, 0)';
    const border = resolveBorder(styling);
    expect(border).toBeInstanceOf(Array);
    expect(border).toHaveLength(4);
    expect(border[0]).toBeNull();
    expect(border[1]).not.toBeNull();
    expect(border[2]).toBeNull();
    expect(border[3]).not.toBeNull();
  });

  test('border should be created for all 4 sides', () => {
    styling.borderTop = '5px solid rgb(0, 0, 0)';
    styling.borderRight = '5px solid rgb(0, 0, 0)';
    styling.borderBottom = '5px solid rgb(0, 0, 0)';
    styling.borderLeft = '5px solid rgb(0, 0, 0)';
    const border = resolveBorder(styling);
    expect(border).not.toBeInstanceOf(Array);
    expect(border).toMatchObject(expect.objectContaining({
      width: 5,
      style: 'solid',
      color: 'rgb(0, 0, 0)',
    }));
  });
});
