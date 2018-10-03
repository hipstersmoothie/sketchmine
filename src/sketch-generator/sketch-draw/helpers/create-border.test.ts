import { createBorder } from './create-border';
import { StyleDeclaration } from '../../../dom-traverser/dom-visitor';
import { IBounding } from '../interfaces';

describe('[sketch-generator] › helpers › create manual border with points', () => {
  const frame: IBounding = { x: 0, y: 0, width: 100, height: 100 };
  let styling: StyleDeclaration;

  beforeEach(() => {
    styling = new StyleDeclaration();
  });

  test('borderTop', () => {
    styling.borderTop = '1px solid rgb(0, 0, 0)';
    createBorder(styling, frame);
  });

  test('borderTop + borderRight', () => {
    styling.borderTop = '1px solid rgb(0, 0, 0)';
    styling.borderRight = '1px solid rgb(0, 0, 0)';
    createBorder(styling, frame);
  });

  test('borderTop + borderRight + borderBottom', () => {
    styling.borderTop = '1px solid rgb(0, 0, 0)';
    styling.borderRight = '1px solid rgb(0, 0, 0)';
    styling.borderBottom = '1px solid rgb(0, 0, 0)';
    createBorder(styling, frame);
  });

  test('borderTop + borderRight + borderBottom + borderLeft', () => {
    styling.borderTop = '1px solid rgb(0, 0, 0)';
    styling.borderRight = '1px solid rgb(0, 0, 0)';
    styling.borderBottom = '1px solid rgb(0, 0, 0)';
    styling.borderLeft = '1px solid rgb(0, 0, 0)';
    createBorder(styling, frame);
  });

  test('borderTop + borderRight + borderBottom + borderLeft', () => {
    styling.borderRight = '1px solid rgb(0, 0, 0)';
    styling.borderBottom = '1px solid rgb(0, 0, 0)';
    createBorder(styling, frame);
  });
  test('borderTop + borderRight + borderBottom + borderLeft', () => {
    styling.borderRight = '1px solid rgb(0, 0, 0)';
    styling.borderBottom = '3px solid rgb(0, 0, 0)';
    createBorder(styling, frame);
  });
});
