import * as fs from 'fs';
import * as path from 'path';
import { SvgParser } from '@sketch-svg-parser/svg-parser';
import { ISvg } from '@sketch-svg-parser/interfaces';

const MORE_SVG = path.resolve(__dirname, '..', 'fixtures', 'more.svg');

describe('SVG Parser', () => {

  describe('More svg', () => {
    let svgObject: ISvg;
    const width = 512;
    const height = 512;

    beforeAll((done) => {
      fs.readFile(MORE_SVG, 'utf8', (err, fileContents) => {
        if (err) {
          throw err;
        }
        svgObject = SvgParser.parse(fileContents, width, height);
        done();
      });
    });

    it(`The more icon should have a width and height of ${width}x${height}px.`, () => {
      expect(svgObject).toHaveProperty('size');
      expect(svgObject.size.width).toBe(width);
      expect(svgObject.size.height).toBe(height);
    });

    it('The more icon should have three shapes.', () => {
      expect(svgObject.shapes).toHaveLength(3);
    });

    it('The more icon should have three shapes and every shape should contain 4 curves.', () => {
      expect(svgObject.shapes).toHaveLength(3);

      svgObject.shapes.forEach((shape) => {
        expect(shape.points).toHaveLength(6);

        for (let i = 0, max = shape.points.length; i < max; i += 1) {
          switch (i) {
            case 0:
              expect(shape.points[i].code).toBe('M');
              break;
            case shape.points.length - 1:
              expect(shape.points[shape.points.length - 1].code).toBe('Z');
              break;
            default:
              expect(shape.points[i].code).toBe('C');
              expect(typeof shape.points[i].x1).toBe('number');
              expect(typeof shape.points[i].x2).toBe('number');
          }
        }
      });
    });
  });
});
