import { ISvgShape, ISvgArcPoint, ISvgPoint } from '../interfaces';
const arcToBezier = require('svg-arc-to-cubic-bezier');

const TAU = Math.PI * 2;

export function arcsToCurves(points: ISvgPoint[]): ISvgPoint[] {
  // if there is no arc return unmodified element
  if (! points.some(point => point.code === 'A')) {
    return points;
  }

  const converted = [];

  points.forEach((point) => {
    if (point.code === 'A') {
      const curves = arcToBezier({
        px: point.x0,
        py: point.y0,
        cx: (point as ISvgArcPoint).x,
        cy: (point as ISvgArcPoint).y,
        rx: (point as ISvgArcPoint).rx,
        ry: (point as ISvgArcPoint).ry,
        xAxisRotation: (point as ISvgArcPoint).xAxisRotation,
        largeArcFlag: +(point as ISvgArcPoint).largeArc,
        sweepFlag: +(point as ISvgArcPoint).sweep,
      });

      if (curves.length === 1) {
        converted.push({
          code: 'C',
          command: 'curveto',
          x1: curves[0].x1,
          y1: curves[0].y1,
          x2: curves[0].x2,
          y2: curves[0].y2,
          x: curves[0].x,
          y: curves[0].y,
          x0: point.x0,
          y0: point.y0,
          relative: false,
        });
      } else {
        // console.log(curves)
        converted.push(...curves.map((c) => {
          return {
            code: 'C',
            command: 'curveto',
            x1: c.x1,
            y1: c.y1,
            x2: c.x2,
            y2: c.y2,
            x: c.x,
            y: c.y,
            x0: point.x0,
            y0: point.y0,
            relative: false,
          };
        }));
        // throw new Error('Arcs only with one curve supported in the moment!');
      }
    } else {
      converted.push(point);
    }
  });

  return converted;
}

// const previousPoint = { x: 100, y: 100 }

// const currentPoint = {
//   x: 700,
//   y: 100,
//   curve: {
//     type: 'arc',
//     rx: 300,
//     ry: 200,
//     largeArcFlag: 30,
//     sweepFlag: 0,
//     xAxisRotation: 0,
//   },
// };

// const curves = arcToBezier({
//   px: previousPoint.x,
//   py: previousPoint.y,
//   cx: currentPoint.x,
//   cy: currentPoint.y,
//   rx: currentPoint.curve.rx,
//   ry: currentPoint.curve.ry,
//   xAxisRotation: currentPoint.curve.xAxisRotation,
//   largeArcFlag: currentPoint.curve.largeArcFlag,
//   sweepFlag: currentPoint.curve.sweepFlag,
// });




// export function arcToBezier(arc: ISvgArcPoint) {
//   const curves = [];

//   if (arc.rx === 0 || arc.ry === 0) { return []; }

//   const sinphi = Math.sin(arc.xAxisRotation * TAU / 360);
//   const cosphi = Math.cos(arc.xAxisRotation * TAU / 360);

//   const pxp = cosphi * (arc.x0 - arc.x) / 2 + sinphi * (arc.y0 - arc.y) / 2;
//   const pyp = -sinphi * (arc.x0 - arc.x) / 2 + cosphi * (arc.y0 - arc.y) / 2;

//   if (pxp === 0 && pyp === 0) { return []; }

//   let radiusX = Math.abs(arc.rx);
//   let radiusY = Math.abs(arc.ry);

//   const lambda =
//     Math.pow(pxp, 2) / Math.pow(radiusX, 2) +
//     Math.pow(pyp, 2) / Math.pow(radiusY, 2);

//   if (lambda > 1) {
//     radiusX *= Math.sqrt(lambda);
//     radiusY *= Math.sqrt(lambda);
//   }

//   // tslint:disable-next-line
//   let { centerx, centery, ang1, ang2 } = getArcCenter(arc, sinphi, cosphi, pxp, pyp);

//   const segments = Math.max(Math.ceil(Math.abs(ang2) / (TAU / 4)), 1);

//   ang2 /= segments;

//   for (let i = 0; i < segments; i += 1) {
//     curves.push(approxUnitArc(ang1, ang2));
//     ang1 += ang2;
//   }

//   return curves.map((curve) => {
//     const { x: x1, y: y1 } = mapToEllipse(curve[ 0 ], arc.rx, arc.ry, cosphi, sinphi, centerx, centery)
//     const { x: x2, y: y2 } = mapToEllipse(curve[ 1 ], arc.rx, arc.ry, cosphi, sinphi, centerx, centery)
//     const { x, y } = mapToEllipse(curve[ 2 ], arc.rx, arc.ry, cosphi, sinphi, centerx, centery)

//     return { x1, y1, x2, y2, x, y };
//   })
// }

// export function getArcCenter(arc: ISvgArcPoint, sinphi: number, cosphi: number, pxp: number, pyp: number) {
//   const rxsq = Math.pow(arc.rx, 2);
//   const rysq = Math.pow(arc.ry, 2);
//   const pxpsq = Math.pow(pxp, 2);
//   const pypsq = Math.pow(pyp, 2);

//   let radicant = (rxsq * rysq) - (rxsq * pypsq) - (rysq * pxpsq);

//   if (radicant < 0) {
//     radicant = 0;
//   }

//   radicant /= (rxsq * pypsq) + (rysq * pxpsq);
//   radicant = Math.sqrt(radicant) * (arc.largeArc === arc.sweep ? -1 : 1)

//   const centerxp = radicant * arc.rx / arc.ry * pyp;
//   const centeryp = radicant * -arc.ry / arc.rx * pxp;

//   const centerx = cosphi * centerxp - sinphi * centeryp + (arc.x0 + arc.x) / 2;
//   const centery = sinphi * centerxp + cosphi * centeryp + (arc.y0 + arc.y) / 2;

//   const vx1 = (pxp - centerxp) / arc.rx;
//   const vy1 = (pyp - centeryp) / arc.ry;
//   const vx2 = (-pxp - centerxp) / arc.rx;
//   const vy2 = (-pyp - centeryp) / arc.ry;

//   const ang1 = vectorAngle(1, 0, vx1, vy1);
//   let ang2 = vectorAngle(vx1, vy1, vx2, vy2);

//   // sweepFlag = 0
//   if (arc.sweep && ang2 > 0) {
//     ang2 -= TAU;
//   }

//   // sweepFlag === 1
//   if (!arc.sweep && ang2 < 0) {
//     ang2 += TAU;
//   }

//   return { centerx, centery, ang1, ang2 };
// }

// export function approxUnitArc(ang1: number, ang2: number): {x: number, y: number}[] {
//   // See http://spencermortensen.com/articles/bezier-circle/ for the derivation
//   // of this constant.
//   const c = 0.551915024494;

//   const x1 = Math.cos(ang1);
//   const y1 = Math.sin(ang1);
//   const x2 = Math.cos(ang1 + ang2);
//   const y2 = Math.sin(ang1 + ang2);

//   return [
//     {
//       x: x1 - y1 * c,
//       y: y1 + x1 * c,
//     },
//     {
//       x: x2 + y2 * c,
//       y: y2 - x2 * c,
//     },
//     { x: x2, y: y2 },
//   ];
// }

// const mapToEllipse = ({ x, y }, rx, ry, cosphi, sinphi, centerx, centery) => {
//   x *= rx
//   y *= ry

//   const xp = cosphi * x - sinphi * y
//   const yp = sinphi * x + cosphi * y

//   return {
//     x: xp + centerx,
//     y: yp + centery
//   }
// }

// const vectorAngle = (ux, uy, vx, vy) => {
//   const sign = (ux * vy - uy * vx < 0) ? -1 : 1
//   const umag = Math.sqrt(ux * ux + uy * uy)
//   const vmag = Math.sqrt(ux * ux + uy * uy)
//   const dot = ux * vx + uy * vy

//   let div = dot / (umag * vmag)

//   if (div > 1) {
//     div = 1
//   }

//   if (div < -1) {
//     div = -1
//   }

//   return sign * Math.acos(div)
// }

