
<img src="https://cdn.worldvectorlogo.com/logos/sketch-1.svg" alt="Sketch Logo" width="150"/>

# Dynatrace .sketch plugins and tooling

[![Build Status](https://webkins.lab.dynatrace.org/job/barista/job/sketch-generator/job/master/badge/icon)](https://webkins.lab.dynatrace.org/job/barista/job/sketch-generator/job/master/)

This tooling set is for the dynatrace barista designsystem.

## Angular to Sketch App Generator

Generates a Sketch App Symbol library out of the *Dynatrace Angular Components Library*.

### How to get running

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
The environment Variable of `process.env.SKETCH = 'open-close'` opens and closes the Sketch app automatically on a MacOS machine.

``` javascript
process.env.DEBUG = 'true';
process.env.DEBUG_SVG = 'true';
process.env.DEBUG_BROWSER = 'true';
process.env.DEBUG_TRAVERSER = 'true';
process.env.SKETCH = 'open-close';
```

Open and close sketch.app on MacOS for easier development.

``` javascript
process.env.SKETCH = 'open-close';
```

### Testing the SVG generator

Tests are done with **JEST**

The files have to contain the pattern `**/*.test.ts` in the folder `src` and `tests`

Just run `npm run test`
for test-coverage analysis run `npm run test:coverage`

### Useful bash scripts

convert a folder to a .sketch file

``` bash
declare filename=dt-asset-lib
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
declare filename=dt-asset-lib
# rm -rf ${filename}.sketch
# cp ./${filename}.bak.sketch ${filename}.sketch
mv ${filename}.sketch ${filename}.zip
unzip ${filename}.zip -d ./${filename}
rm -rf ${filename}.zip
```

## Validator

This tool is found in `src/validate`
run `npm run run:validate -- --file=path/to/file.sketch`

### Configuration

the selector can be `'document' | 'page' | 'symbolMaster' | 'group' | 'path' | 'shapeGroup' | 'rectangle'`

``` typescript
export const rules: IValidationRule[] = [
  {
    selector: ['symbolMaster','rectangle', 'path', ...], // all kind of sketch instances
    name: 'name-of-the-rule',
    description: `Description of the rule to display in output`,
    ignoreArtboards: ['artbord-name-to-be-ignored],
    validation: functionThatValidates,
  },
];
```

### Debugging

The following Debug variables are specified for enhanced logging.

``` javascript
process.env.DEBUG = 'true';
process.env.VERBOSE = 'true';
```

## Color Replacer to change a set of unused legacy colors

run `run:color-replacer -- --file=path/to/file.sketch --colors=path/to/colors.json`
The script creates a `./_tmp`dir in the current workdir with the canged file.

All colors have to be provided as **HEX** colors
The **colors.json** file follows following convention:

### Debugging 

The environment Variable of `process.env.SKETCH = 'open-close'` opens and closes the Sketch app automatically on a MacOS machine.

``` javascript
process.env.DEBUG = 'true';
process.env.VERBOSE = 'true';
process.env.SKETCH = 'open-close';
```

```json
{
  "oldcolor": "newcolor",
  "#AJ54K0": "#333333",
  ...
}
```

## Data Structure

```json
[
  {
    className: 'DtButton',
    selector: 'dt-button',
    ...
    variants: [
      {
        name: 'button-primary-main',
        changes: [
          {
            type: 'property',
            name: 'color',
            value: 'main'
          }
        ]
      },
      {
        name: 'button-primary-main-active',
        changes: [
          {
            type: 'property',
            name: 'color',
            value: 'main'
          }, {
            type: 'method',
            name: 'handleClick',
            arguments: []
          }
        ]
      },
      {
        name: 'button-cta',
        changes: [
          {
            type: 'property',
            name: 'color',
            values: 'cta'
          }
        ]
      }
    ]
  }
]
```

#### Maintainer

<table>
  <tr>
    <td style="width: 50px; height: 50px;"><img src="https://dev-jira.dynatrace.org/secure/useravatar?&ownerId=lukas.holzer" style="border-radius: 50%; width: 100%;"></td>
    <td style="line-height: 50px;"><a href="mailto:lukas.holzer@dynatrace.com">Lukas Holzer</a></td>
  </tr>
</table>
