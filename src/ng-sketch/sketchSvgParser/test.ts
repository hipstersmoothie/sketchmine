import { SvgParser } from "./SvgParser";
import { Sketch } from "../sketchJSON/Sketch";
import { Page } from "../sketchJSON/models/Page";
import { SymbolMaster } from "../sketchJSON/models/SymbolMaster";
import { Group } from "../sketchJSON/models/Group";
import { SvgToSketch } from "./SvgToSketch";
import { ShapeGroup } from "./models/ShapeGroup";
import { IBounding } from "../sketchJSON/interfaces/Base";
import { Style } from "../sketchJSON/models/Style";

// const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 512 512" fit="" preserveAspectRatio="xMidYMid meet" focusable="false">
// <path d="M322.335 242.662c26.203-20.295 43.112-51.977 43.112-87.685C365.447 93.689 315.773 44 254.467 44c-61.278 0-110.98 49.69-110.98 110.977 0 36.319 17.517 68.46 44.476 88.71-26.623 15.071-43.974 41.666-43.974 82.827 0 .78-.272 81.245-.272 81.309 0 27.382 34.132 36.1 80.156 38.362l25.639 18.364 4.825 3.451 4.815-3.451 25.399-18.186c47.953-1.976 83.962-10.412 83.962-38.54v-81.097c0-42.307-18.358-69.185-46.178-84.064zm-67.998 215.15l-28.557-20.436s13.535-104.262 23.004-152.961c0 0-16.859-16.42-16.859-20.622 10.286 5.311 22.412 5.694 22.412 5.694s13.62 0 22.412-5.694c0 3.9-16.891 20.646-16.891 20.646 9.498 48.675 23.031 152.937 23.031 152.937l-28.552 20.435zm43.169-268.578h-8.959c-24.9 0-26.95-31.484-34.152-31.656-7.176.172-9.243 31.656-34.116 31.656h-8.987c-11.205 0-31.81 1.309-31.81-26.79v-7.56c0-5.786 6.007-14.022 13.326-14.022h123.217c7.278 0 15.48 8.236 15.48 14.022v7.56c0 28.099-22.763 26.79-34 26.79z"></path>
// </svg>`;

// const svg = `<svg width="72px" height="63px" viewBox="0 0 72 63" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
// <path d="M7.36957432,8.98331826 C7.36957432,28.1209426 15.6354337,45.568337 34.9766612,38.9733167 C54.3178887,32.3782964 65.7401363,51.4071169 45.7687084,61.2953383 C25.7972805,71.1835597 8.345577,56.9151761 18.3027434,51.2918494 C24.9408544,47.542965 21.2964647,43.4367874 7.36957432,38.9733167 C7.36957432,6.22156822 7.36957432,-3.77509793 7.36957432,8.98331826 Z M61.9750929,9.99702524 C81.5274645,9.99702524 80.9263502,23.7709439 63.4563332,23.7709439 C45.9863161,23.7709439 42.4227213,9.99702524 61.9750929,9.99702524 Z" id="Path"></path>
// </svg>`;

const svg = `
<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
  <path d="M0,0 C30,0 25,25 50,25 C75,25 100,25 100,50 C100,75 75,100 50,100 C50,100 50,83.3333333 50,50 L50,40" id="Path"></path>  

</svg>`;


const curve = `
<svg width="600" height="300">
  <path d="M100,200 C100,100  400,100  400,200" fill="none" stroke="#000" stroke-width="2px" />
</svg>
`;

const agent = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 512 512" fit="" preserveAspectRatio="xMidYMid meet" focusable="false">
<path d="M322.335 242.662c26.203-20.295 43.112-51.977 43.112-87.685C365.447 93.689 315.773 44 254.467 44c-61.278 0-110.98 49.69-110.98 110.977 0 36.319 17.517 68.46 44.476 88.71-26.623 15.071-43.974 41.666-43.974 82.827 0 .78-.272 81.245-.272 81.309 0 27.382 34.132 36.1 80.156 38.362l25.639 18.364 4.825 3.451 4.815-3.451 25.399-18.186c47.953-1.976 83.962-10.412 83.962-38.54v-81.097c0-42.307-18.358-69.185-46.178-84.064zm-67.998 215.15l-28.557-20.436s13.535-104.262 23.004-152.961c0 0-16.859-16.42-16.859-20.622 10.286 5.311 22.412 5.694 22.412 5.694s13.62 0 22.412-5.694c0 3.9-16.891 20.646-16.891 20.646 9.498 48.675 23.031 152.937 23.031 152.937l-28.552 20.435zm43.169-268.578h-8.959c-24.9 0-26.95-31.484-34.152-31.656-7.176.172-9.243 31.656-34.116 31.656h-8.987c-11.205 0-31.81 1.309-31.81-26.79v-7.56c0-5.786 6.007-14.022 13.326-14.022h123.217c7.278 0 15.48 8.236 15.48 14.022v7.56c0 28.099-22.763 26.79-34 26.79z"></path>
</svg>`;



const size: IBounding = {width: 72, height: 63, x: 0, y: 0};
const shapeGroup = new ShapeGroup(size);
const style = new Style()
const svgObject = SvgParser.parse(curve, 72, 63);
shapeGroup.layers = new SvgToSketch(svgObject).generateObject();
shapeGroup.name = 'SVG';
style.addColorFill('#ff00fa');
shapeGroup.style = style.generateObject();



// console.log(shapeGroup);



// write test svg
const sketch = new Sketch();
const pageSize: IBounding = { height: 100, width: 100, x: 0, y: 0};
const page = new Page(pageSize);
page.name = 'SVG Test';
const symbolMaster = new SymbolMaster(pageSize);
const group = new Group(pageSize);
group.name = 'svg test Object'



// generate ShapeGroup
console.log(JSON.stringify(shapeGroup.generateObject(), null, 2))

group.addLayer(shapeGroup.generateObject());
symbolMaster.addLayer(group.generateObject());
page.addLayer(symbolMaster.generateObject());

sketch.write([page]);
