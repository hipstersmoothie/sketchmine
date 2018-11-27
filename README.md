<img src="https://cdn.worldvectorlogo.com/logos/sketch-1.svg" alt="Sketch Logo" width="150"/>

# Dynatrace Sketch Library

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)
[![Build Status](https://webkins.lab.dynatrace.org/job/barista/job/sketch-generator/job/master/badge/icon)](https://webkins.lab.dynatrace.org/job/barista/job/sketch-generator/job/master/)

* [The Parts](#the-parts)
* [Sketch Generator](#sketch-generator)
* [Validator](#validator)
* [Useful bash scripts](#useful-bash-scripts)

![Infrastructure for the sketch-library](https://dt-cdn.net/images/infrastructure-1920-5387b3da7d.png)

## The Parts

* **AMP**: angular-meta-parser — *creates a JSON representation of the angular components*
* **ALG** angular-library-generator — *generates the angular app with the library*
* **DT** dom-traverser — *traverses and visits all HTML*
* **SG** sketch-generator — *generates the .sketch from HTML*
* **SL** sketch-library — *the library with all variants to draw*

### Other Tools in the Sketch Library

* **SCR** sketch-color-replacer
* **SV** sketch-validator

## Sketch Generator

Generates a Sketch App Symbol library out of the *Dynatrace Angular Components Library*.

### How to get running

There are several options to get running with the library if you want to develop locally you can skip to the section [Run without docker](#run-without-docker). If you need to develop something with the docker image for the **CI/CD** you can decide if you want to [get running with docker-compose](#run-with-docker-compose) — the easy way or plain docker without composer. *(that is the way jenkins is using docker)*

### Docker *the jenkins way* 🐳

1. you have to build the image

  ```bash
  docker build \
    -t ${YOUR_TAG} \
    --build-arg GIT_PASS=$GIT_PASS \
    --build-arg GIT_USER=$GIT_USER \
    --build-arg GIT_BRANCH=${ANGULAR_COMPONENTS_BRANCH} \
    .
  ```

2. run the image

It is **important** to set the environment variable `-e DOCKER=true` for the headless chrome tasks like the *sketch-generator* and the *library* in addition you can set a second variable like `-e DEBUG=true` to see verbose logging.

  ```bash
  # mount angular components into docker image
  docker run -it -v $(pwd)/_tmp/:/lib/_tmp/ -e DOCKER=true --cap-add=SYS_ADMIN ${container} ls -lah _tmp

  # generate library
  docker run -it -v $(pwd)/_tmp/:/lib/_tmp/ -e DOCKER=true --cap-add=SYS_ADMIN ${container} node dist/library

  # use validation
  docker run -it -v $(pwd)/_tmp/:/lib/_tmp/ -e DOCKER=true --cap-add=SYS_ADMIN ${container} node dist/sketch-validator --file="/path/to/file.sketch"
  ```

#### Run with docker-compose

To get started with docker-compose please create following file:

```bash
touch .env
echo 'GIT_PASS=${password}\nGIT_USER\n=${user}\nGIT_BRANCH=feat/poc-sketch' > .env
```

then just run `docker-compose up`

#### Run without docker

To run without docker in a local development environment run first

```bash
sh postinstall.sh
```

It will prepare everything for you so you can start developing.
The angular components will be checked out into `_tmp` and the library app shell will be moved in the correct place.

If you want to run the library `node dist/library` and the **.sketch** file will be generated 🤘🏻

#### Docker Registry


On every successfull master build a new Docker Image of the library is generated and deployed to the Dockerregistry.
You can see the list of all available tags here: [Docker Registry Tag List](https://webkins.lab.dynatrace.org:5000/v2/ng-sketch/tags/list).


### Available commands

```
npm run build           | build all the parts
npm run build:dev       | build with watch flag
npm run test            | run all the unit tests and e2e tests
npm run lint            | lint the project
node dist/${part}       | run the specified part of the library
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

### Testing

Tests are done with **JEST**

The files have to contain the pattern `**/*.test.ts` in the folder `src` and `tests` for unit tests and
for end 2 end testing `**/*.e2e.ts`

Just run `npm run test`
for test-coverage analysis run `npm run test:coverage`

**Important!**

All tests according to this space should be wrapped in a describe with the prefix of the part like : `[sketch-generator] › ...` like the following:

```typescript
//... import statements

describe('[${part}] › ${folder} › ${description of the suite}', () => {

// .. your tests should place here.

});
```

## Useful bash scripts

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
run `node dist/sketch-validator --file=path/to/file.sketch`

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

## Color Replacer to change a set of unused legacy colors

run `node dist/sketch-color-replacer --file=path/to/file.sketch --colors=path/to/colors.json`
The script creates a `./_tmp`dir in the current workdir with the canged file.

All colors have to be provided as **HEX** colors
The **colors.json** file follows following convention:

```json
{
  "oldcolor": "newcolor",
  "#AJ54K0": "#333333",
  ...
}
```

## Maintainer

<table>
  <tr>
    <td style="width: 50px; height: 50px;">
      <img src="https://dev-jira.dynatrace.org/secure/useravatar?&ownerId=lukas.holzer" style="border-radius: 50%; width: 100%;">
    </td>
    <td style="line-height: 50px;"><a href="mailto:lukas.holzer@dynatrace.com">Lukas Holzer</a></td>
  </tr>
</table>
