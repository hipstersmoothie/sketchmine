import { SvgParser } from "./SvgParser";
import { Sketch } from "../sketchJSON/Sketch";
import { Page } from "../sketchJSON/models/Page";
import { SymbolMaster } from "../sketchJSON/models/SymbolMaster";
import { Group } from "../sketchJSON/models/Group";

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

const shapeGroup = SvgParser.parse(svg, 72, 63);



// // write test svg
// const sketch = new Sketch();
// const size: IBounding = { height: 100, width: 100, x: 0, y: 0};
// const page = new Page(size);
// page.name = 'SVG Test';
// const symbolMaster = new SymbolMaster(size);
// const svgSize: IBounding = {...size, height: 100, width: 100};
// const group = new Group(svgSize);
// group.name = 'svg test Object'

// const sh = new ShapeGroup(svgSize);
// sh.layers = JSON.parse('[{"_class":"shapePath","do_objectID":"163A1879-B2B4-4B63-B549-931031EE3ED6","exportOptions":{"_class":"exportOptions","exportFormats":[],"includedLayerIds":[],"layerOptions":0,"shouldTrim":false,"do_objectID":"F322003B-4D31-42B9-9637-7AD1F7CDB00C"},"isFlippedHorizontal":false,"isFlippedVertical":false,"isLocked":false,"isVisible":true,"layerListExpandedType":0,"name":"shapePath","nameIsFixed":false,"resizingConstraint":63,"resizingType":0,"rotation":0,"shouldBreakMaskChain":false,"frame":{"_class":"rect","constrainProportions":false,"do_objectID":"8B8E4E90-F9F6-4600-97D7-AD8018C04A70"},"hasClickThrough":false,"clippingMaskMode":0,"hasClippingMask":false,"windingRule":1,"booleanOperation":-1,"edited":false,"isClosed":true,"pointRadiusBehaviour":1,"points":[{"_class":"curvePoint","cornerRadius":0,"curveFrom":"{0.10235519888888889, 0.44636416825396824}","curveMode":4,"curveTo":"{0.10235519888888889, 0.14259235333333334}","hasCurveTo":false,"hasCurveFrom":true,"point":"{0.10235519888888889, 0.14259235333333334}"},{"_class":"curvePoint","cornerRadius":0,"curveFrom":"{0.7544151208333333, 0.5139412126984128}","curveMode":4,"curveTo":"{0.21715880138888888, 0.7233069365079365}","hasCurveTo":true,"hasCurveFrom":true,"point":"{0.48578696111111114, 0.6186240746031746}"},{"_class":"curvePoint","cornerRadius":0,"curveFrom":"{0.3582955625, 1.129897773015873}","curveMode":4,"curveTo":"{0.9130574486111112, 0.8159859825396825}","hasCurveTo":true,"hasCurveFrom":true,"point":"{0.6356765055555555, 0.9729418777777777}"},{"_class":"curvePoint","cornerRadius":0,"curveFrom":"{0.34640075555555555, 0.7546502380952381}","curveMode":4,"curveTo":"{0.11591079166666668, 0.9034154936507935}","hasCurveTo":true,"hasCurveFrom":true,"point":"{0.2542047694444445, 0.8141563396825396}"},{"_class":"curvePoint","cornerRadius":0,"curveFrom":"{0.10235519888888889, 0.09875505111111112}","curveMode":4,"curveTo":"{0.2957842319444445, 0.6894728158730159}","hasCurveTo":true,"hasCurveFrom":true,"point":"{0.10235519888888889, 0.6186240746031746}"}]},{"_class":"shapePath","do_objectID":"C887610A-88EC-4C65-A2D9-49077D38FE62","exportOptions":{"_class":"exportOptions","exportFormats":[],"includedLayerIds":[],"layerOptions":0,"shouldTrim":false,"do_objectID":"EC7494F3-31E8-4E23-BF1B-91F2F20DC5D2"},"isFlippedHorizontal":false,"isFlippedVertical":false,"isLocked":false,"isVisible":true,"layerListExpandedType":0,"name":"shapePath","nameIsFixed":false,"resizingConstraint":63,"resizingType":0,"rotation":0,"shouldBreakMaskChain":false,"frame":{"_class":"rect","constrainProportions":false,"do_objectID":"4F5E1C15-7B3C-4C06-93E6-6F9992109E55"},"hasClickThrough":false,"clippingMaskMode":0,"hasClippingMask":false,"windingRule":1,"booleanOperation":-1,"edited":false,"isClosed":true,"pointRadiusBehaviour":1,"points":[{"_class":"curvePoint","cornerRadius":0,"curveFrom":"{1.1323258958333333, 0.1586829403174603}","curveMode":4,"curveTo":"{0.8607651791666666, 0.1586829403174603}","hasCurveTo":false,"hasCurveFrom":true,"point":"{0.8607651791666666, 0.1586829403174603}"},{"_class":"curvePoint","cornerRadius":0,"curveFrom":"{0.6386988347222222, 0.3773165698412698}","curveMode":4,"curveTo":"{1.1239770861111111, 0.3773165698412698}","hasCurveTo":true,"hasCurveFrom":true,"point":"{0.8813379611111112, 0.3773165698412698}"}]}]');

// group.addLayer(sh.generateObject());
// symbolMaster.addLayer(group.generateObject());
// page.addLayer(symbolMaster.generateObject());

// sketch.write([page]);
