import { expect } from 'chai';
import { SvgParser } from '../../src/ng-sketch/sketchSvgParser/SvgParser';
import chalk from 'chalk';

const svg = `
<svg width="512px" height="512px" viewBox="0 0 512 512">
  <circle fill="inherit" cx="403.99997" cy="256.00006" r="44"></circle>
  <circle fill="inherit" cx="256" cy="256.00006" r="44.00003"></circle>
  <circle fill="inherit" cx="108.00002" cy="256.00006" r="44"></circle>
</svg>`;

describe('[•••] More svg ', () => {
  const width = 512;
  const height = 512;
  const svgObject = SvgParser.parse(svg, width, height);

  it(
    `The more icon should have a width and height of ` +
    chalk`{yellow ${width.toString()}x${height.toString()}px}.`,
    () => {
      expect(svgObject).to.have.property('size');
      expect(svgObject.size.width).to.equal(width);
      expect(svgObject.size.height).to.equal(height);
    });

  it('The more icon should have three shapes.', () => {
    expect(svgObject.shapes).to.have.lengthOf(3);
  });

  it('The more icon should have three shapes and every shape should contain 4 curves.', () => {
    expect(svgObject.shapes).to.have.lengthOf(3);

    svgObject.shapes.forEach((shape) => {
      expect(
        shape.points,
        'The circles have to consist out of 4 curves with a moveto and closepath.',
      ).to.have.lengthOf(6);

      for (let i = 0, max = shape.points.length; i < max; i += 1) {
        switch (i) {
          case 0:
            expect(shape.points[i].code, 'The circle has to start with a moveto.').to.equal('M');
            break;
          case shape.points.length - 1:
            expect(
              shape.points[shape.points.length - 1].code,
              'The circle has to be closed.',
            ).to.equal('Z');
            break;
          default:
            expect(shape.points[i].code, 'A circle has to consist out of curves.').to.equal('C');
            expect(shape.points[i].x1, 'A curve needs a controllpoint at the first point.').to.be.a('number');
            expect(shape.points[i].x2, 'A curve needs a controllpoint at the second point.').to.be.a('number');
        }
      }
    });
  });
});
