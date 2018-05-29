import { CurvePoint } from './CurvePoint';

export class MoveTo extends CurvePoint{


  addPoint() {
    return {
      ...super.basePoint
    }




    if(op === "m") { x += parseFloat(terms[0]); y += parseFloat(terms[1]); }
				else if(op === "M") { x = parseFloat(terms[0]) + xoffset; y = parseFloat(terms[1]) + yoffset; }
				// add a point only if the next operation is not another move operation, or a close operation
				if(s<strings.length-1) {
					let nextstring = strings[s+1].trim();
					let nextop = nextstring.substring(0,1);
					if (!(nextop === "m" || nextop === "M" || nextop === "z" || nextop === "Z")) {
						if(s>1) { receiver.closeShape(); }
						receiver.startShape();
						receiver.addPoint(x, y); }}}
  }
}
