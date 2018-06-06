import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import { ISvg } from '../../src/ng-sketch/sketchSvgParser/interfaces/ISvg';
import { SvgParser } from '../../src/ng-sketch/sketchSvgParser/SvgParser';

describe('SVG Parser', () => {

  context('[•••] More svg:', () => {
    let svgObject: ISvg;
    const width = 512;
    const height = 512;

    before((done) => {
      const moreFile = path.resolve(__dirname, '..', 'fixtures', 'more.svg');
      fs.readFile(moreFile, 'utf8', (err, fileContents) => {
        if (err) {
          throw err;
        }
        svgObject = SvgParser.parse(fileContents, width, height);
        done();
      });
    });

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
});
