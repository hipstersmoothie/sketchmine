
<img src="https://cdn.worldvectorlogo.com/logos/sketch-1.svg" alt="Sketch Logo" width="150"/>

# Angular to Sketch App Generator

Generates a Sketch App Symbol library out of the *Dynatrace Angular Components Library*.

## How to get running?

The generator needs a list of pages (urls) to crawl and draw.
Each page is drawn as own Symbol.
To modify the host of the page you can use the setter function.

``` typescript
const elementFetcher = new ElementFetcher();
elementFetcher.host = 'http://localhost:4200';
```

Just start the angular app on port **4200**, and pass the pages for the symbols in the index.ts
then hit in the terminal `npm start` and your sketch file is generated!

```typescript
const pages = [
  '/button/button--icon',
  '/button/button--primary',
  '/button/button--secondary',
  '/tile/tile--default',
];

new ElementFetcher().generateSketchFile(pages);
```

### Debugging

There are some debugging variables specified to modify the console output.
They are specefied in the `.vscode/launch.json` to be parsed while debugging with VSCode.

``` javascript
process.env.DEBUG = 'true';
process.env.DEBUG_SVG = 'true';
process.env.DEBUG_BROWSER = 'true';
```

### Testing the SVG generator

Just run `npm run test`

### Useful bash scripts

convert a folder to a .sketch file

``` bash
# rm -rf ${filename}.sketch
cd ${filename}
zip -r -X ../${filename}.zip *
cd ..
mv ${filename}.zip ${filename}.sketch
rm -rf ${filename}.zip
open ${filename}.sketch

```

convert .sketch file to folder:

``` bash
# rm -rf ${filename}.sketch
# cp ./${filename}.bak.sketch ${filename}.sketch
mv ${filename}.sketch ${filename}.zip
unzip ${filename}.zip -d ./${filename}
rm -rf ${filename}.zip
```


#### Maintainer

[Lukas Holzer](lukas.holzer@dynatrace.com)
