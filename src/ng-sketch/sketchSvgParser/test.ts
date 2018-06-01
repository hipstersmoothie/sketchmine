import { SvgParser } from "./SvgParser";
import { Sketch } from "../sketchJSON/Sketch";
import { Page } from "../sketchJSON/models/Page";
import { SymbolMaster } from "../sketchJSON/models/SymbolMaster";
import { Group } from "../sketchJSON/models/Group";
import { SvgToSketch } from "./SvgToSketch";
import { ShapeGroup } from "./models/ShapeGroup";
import { IBounding } from "../sketchJSON/interfaces/Base";
import { Style } from "../sketchJSON/models/Style";

const curves = `
<svg width="190" height="160" xmlns="http://www.w3.org/2000/svg">
  <path d="M10 10 C 20 20, 40 20, 50 10" stroke="black" fill="transparent"/>
  <path d="M70 10 C 70 20, 120 20, 120 10" stroke="black" fill="transparent"/>
  <path d="M130 10 C 120 20, 180 20, 170 10" stroke="black" fill="transparent"/>
  <path d="M10 60 C 20 80, 40 80, 50 60" stroke="black" fill="transparent"/>
  <path d="M70 60 C 70 80, 110 80, 110 60" stroke="black" fill="transparent"/>
  <path d="M130 60 C 120 80, 180 80, 170 60" stroke="black" fill="transparent"/>
  <path d="M10 110 C 20 140, 40 140, 50 110" stroke="black" fill="transparent"/>
  <path d="M70 110 C 70 140, 110 140, 110 110" stroke="black" fill="transparent"/>
  <path d="M130 110 C 120 140, 180 140, 170 110" stroke="black" fill="transparent"/>
</svg>
`;

const quadratic = `
<svg width="190" height="160" xmlns="http://www.w3.org/2000/svg">
  <path d="M10 80 Q 95 10 180 80" stroke="black" fill="transparent"/>
</svg>
`

const smoothCurve = `
<svg width="190" height="160" xmlns="http://www.w3.org/2000/svg">
  <path d="M10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80" stroke="black" fill="transparent"/>
</svg>`;


const cloud = `
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="512px" height="512px" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve">
<path fill="inherit" d="M403.659,215.39696c0.48169-3.90862,0.72571-7.89008,0.72571-11.92065
  c0-53.04965-43.0014-96.05216-96.05161-96.05216c-42.6745,0-78.84839,27.83537-91.36397,66.33936
  c-10.46376-5.196-22.25253-8.12004-34.73219-8.12004c-42.74756,0-77.47874,34.29636-78.20445,76.87187
  C68.60182,255.90034,44,285.4317,44,319.71881c0,46.86594,45.99474,84.85724,102.73543,84.85724c41.95,0,154.39735,0,199.56718,0
  C413.5159,404.57605,468,359.57025,468,304.06238C468,265.67612,441.94678,232.32281,403.659,215.39696z"></path>
</svg>
`;

const agent = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 512 512" fit="" preserveAspectRatio="xMidYMid meet" focusable="false">
<path d="M322.335 242.662c26.203-20.295 43.112-51.977 43.112-87.685C365.447 93.689 315.773 44 254.467 44c-61.278 0-110.98 49.69-110.98 110.977 0 36.319 17.517 68.46 44.476 88.71-26.623 15.071-43.974 41.666-43.974 82.827 0 .78-.272 81.245-.272 81.309 0 27.382 34.132 36.1 80.156 38.362l25.639 18.364 4.825 3.451 4.815-3.451 25.399-18.186c47.953-1.976 83.962-10.412 83.962-38.54v-81.097c0-42.307-18.358-69.185-46.178-84.064zm-67.998 215.15l-28.557-20.436s13.535-104.262 23.004-152.961c0 0-16.859-16.42-16.859-20.622 10.286 5.311 22.412 5.694 22.412 5.694s13.62 0 22.412-5.694c0 3.9-16.891 20.646-16.891 20.646 9.498 48.675 23.031 152.937 23.031 152.937l-28.552 20.435zm43.169-268.578h-8.959c-24.9 0-26.95-31.484-34.152-31.656-7.176.172-9.243 31.656-34.116 31.656h-8.987c-11.205 0-31.81 1.309-31.81-26.79v-7.56c0-5.786 6.007-14.022 13.326-14.022h123.217c7.278 0 15.48 8.236 15.48 14.022v7.56c0 28.099-22.763 26.79-34 26.79z"></path>
</svg>`;



const size: IBounding = {width: 190, height: 160, x: 0, y: 0};
const shapeGroup = new ShapeGroup(size);
const style = new Style()
const svgObject = SvgParser.parse(quadratic, size.width, size.height);
shapeGroup.layers = new SvgToSketch(svgObject).generateObject();
shapeGroup.name = 'SVG';
style.addColorFill('#ff00fa');
shapeGroup.style = style.generateObject();



// console.log(shapeGroup);



// write test svg
const sketch = new Sketch();
const pageSize: IBounding = { height: 100, width: 100, x: 0, y: 0};
const page = new Page(pageSize);
page.name = 'SVG Symbol Test Page';
const symbolMaster = new SymbolMaster(pageSize);
const group = new Group(pageSize);
group.name = 'Agent SVG'

group.addLayer(shapeGroup.generateObject());
symbolMaster.addLayer(group.generateObject());
page.addLayer(symbolMaster.generateObject());

sketch.write([page]);
