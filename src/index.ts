import { ElementFetcher } from "./ng-sketch/ElementFetcher";

process.env.DEBUG = 'true';
// process.env.DEBUG_BROWSER = 'true';

new ElementFetcher().generateSketch();
