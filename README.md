![Github banner for sketchmine](https://dt-cdn.net/images/github-banner-2x-1777-2b23e499af.png)

[![Build Status](https://dev.azure.com/sketchmine/sketchmine/_apis/build/status/Dynatrace.sketchmine)](https://dev.azure.com/sketchmine/sketchmine/_build/latest?definitionId=1) [![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/) [![jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)
[![made with sketchmine](https://dt-cdn.net/images/made-with-sketchmine-2a0b31-1-3d32502b89.svg)](https://github.com/Dynatrace/sketchmine/)

* [What is Sketchmine?](#what-is-sketchmine)
* [The parts](#the-parts)
* [Dependency graph](#dependency-graph)
* [Getting started 🚀](#installation)
* [Testing](#testing)
* [Maintainers](#maintainers)
* [License](#license)

## What is Sketchmine?

Sketchmine is a toolset for creating, validating, and maintaining Sketch and Sketch symbol files. Most parts are used to generate [Sketch symbol libraries](https://sketchapp.com/docs/libraries/library-symbols) out of Angular components. See [Stefan Baumgartner and Katrin Freihofner's talk at AngularConnect](https://www.youtube.com/watch?v=3_XvaSD_0xo) to learn more about our workflow and what you can do with Sketchmine.

[![Youtube](https://img.youtube.com/vi/3_XvaSD_0xo/0.jpg)](https://www.youtube.com/watch?v=3_XvaSD_0xo)

But there's more. Sketchmine can also be used to validate Sketch files against a self defined ruleset. To make sure all fonts, colours and other variables follow your design system.

## The parts

* [**app-builder**](./packages/app-builder/README.md) generates an angular app with the information of the code-analyzer.
* [**code-analyzer**](./packages/code-analyzer/README.md) creates a JSON representation of the provided code. Supports [Angular](https://angular.io/).
* [**dom-agent**](./packages/dom-agent/README.md) a DOM traverser that is injected by the browser to scrape the information out of the page.
* [**helpers**](./packages/helpers/README.md) collection of platform independent helpers.
* [**library**](./packages/library/README.md) the orchestration of the executeable parts (generates the entire .sketch library out of the Dynatrace angular components).
* [**node-helpers**](./packages/node-helpers/README.md) collection of Node.js helpers.
* [**sketch-builder**](./packages/sketch-builder/README.md) scrapes a webpage and generates .sketch file.
* [**sketch-color-replacer**](./packages/sketch-color-replacer/README.md) replaces a set of colors in a .sketch file.
* [**sketch-file-format**](./packages/sketch-file-format/README.md) AST of the .sketch file format with all functionality to generate a .sketch file.
* [**sketch-svg-parser**](./packages/sketch-svg-parser/README.md) Parses SVG elements and converts it to Sketch shapes
* [**sketch-validator**](./packages/sketch-validator/README.md) Validates Sketch JSON with the provided rules. Available in UMD, CJS, and ESM formats.
* [**sketch-validator-nodejs-wrapper**](./packages/sketch-validator-nodejs-wrapper/README.md) A Node.js wrapper around the sketch validator package that uses a .sketch file to validate it.

## Getting started

### Architecture

Sketchmine follows a monorepo approach. All officially maintained modules and dependencies are in the same repository.

> The tool for managing the monorepo @sketchmine has been extracted out as [Lerna](https://github.com/lerna/lerna)

### Dependency graph

![Dependency graph of the sketchmine mono repository](https://dt-cdn.net/images/dependency-graph-3920-82e93eaddf.png)


### Installation

To start contributing and developing you have to run `yarn install` to install all the necessary dependencies.
after that you can switch to any package in the `./packages` folder and start to get your hands dirty 👷🏼‍.

If you want to run [tasks](https://docs.npmjs.com/misc/scripts) across all packages, you'll find [Lerna](https://lernajs.io/) to be very useful. You can use the NPM scripts in the root package folder or you can execute all tasks with the `lerna run build` command to execute the `yarn build` command in every package. For further information, check out the [Lerna documentation](https://lernajs.io/). 

### How to get up and running

You have several options for getting started with the library. If you want to develop locally, skip ahead to the [Run without Docker](#run-without-docker) section. If you need to develop something on the **CI/CD** Docker image, decide if you want to use [docker-compose](#run-with-docker-compose), which is the easy way, or if you want to use plain Docker without composer (this is how Jenkins uses Docker).

### Docker: the Jenkins way 🐳

1. Build the image

  ```bash
  docker build \
    -t ${YOUR_TAG} \
    --build-arg GIT_PASS=$GIT_PASS \
    --build-arg GIT_USER=$GIT_USER \
    --build-arg GIT_BRANCH=${ANGULAR_COMPONENTS_BRANCH} \
    .
  ```

2. Run the image

It's important that you set the environment variable `-e DOCKER=true` for the headless Chrome tasks like the sketch-generator and the library. Additionally, you can set a second variable like `-e DEBUG=true` to see verbose logging.

  ```bash
  # mount angular components into docker image
  docker run -it -v $(pwd)/_tmp/:/lib/_tmp/ -e DOCKER=true --cap-add=SYS_ADMIN ${container} ls -lah _tmp

  # generate library
  docker run -it -v $(pwd)/_tmp/:/lib/_tmp/ -e DOCKER=true --cap-add=SYS_ADMIN ${container} node dist/library

  # use validation
  docker run -it -v $(pwd)/_tmp/:/lib/_tmp/ -e DOCKER=true --cap-add=SYS_ADMIN ${container} node dist/sketch-validator --file="/path/to/file.sketch"
  ```

#### Run with docker-compose

To get started with docker-compose, create the following file:

```bash
touch .env
echo 'GIT_PASS=${password}\nGIT_USER\n=${user}\nGIT_BRANCH=feat/poc-sketch' > .env
```

Then run `docker-compose up`.

#### Run without Docker

To run without Docker in a local development environment, begin by running:

```bash
sh postinstall.sh
```

This step will prepare everything for you so you can start developing.
The Angular components will be checked out to the `_tmp` directory and the library app shell will be moved in the correct location.

If you run the library, `node dist/library` and the .sketch file will be generated automatically. 🤘🏻

#### Docker registry

Following each successful master build of a new Docker image, the library is generated and deployed to the Docker registry.
You can view the list of available tags in the [Docker registry tag list](https://webkins.lab.dynatrace.org:5000/v2/ng-sketch/tags/list).


### Available commands

```
npm run build           | build all the parts
npm run build:dev       | build with watch flag
npm run test            | run all the unit tests and e2e tests
npm run lint            | lint the project
node dist/${part}       | run the specified part of the library
```

### Debugging

There are some debugging variables you can use to modify console output.
They're specified in the `.vscode/launch.json` file, to be parsed while debugging with VSCode.
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

## Testing

Because testing is so important and ensures good quality code, we at Dynatrace use [Jest](https://github.com/facebook/jest) as our testing library. Jest ships with a built-in mocking library. To gain confidence with the testing syntax, see the [Jest documentation](https://jestjs.io/docs/en/jest-platform). Jest follows the Jasmine convention. <!-- CT: I've inserted a link to Jest documentation, but I suspect you can find a better page to link to -->

The files must contain the pattern `**/*.test.ts` for unit tests and, for end-to-end testing, `**/*.e2e.ts`. All tests should stay in the `tests` folder. Even though it's possible to place tests in the `src` folder if there's good reason.

To execute the tests, run `yarn test`. This will run the Jest test and provide you with coverage for the package.

**Important**

All tests should be wrapped in a `describe` method with the prefix of the package: `[sketch-builder] › ...` like the following example:

```typescript
//... import statements

describe('[${package}] › ${folder} › ${description of the suite}', () => {

// .. your tests should be placed here.

});
```

## Maintainers

<table>
  <tr>
    <td style="width: 50px; height: 50px;">
      <img src="https://avatars2.githubusercontent.com/u/11156362?s=50&v=4" style="border-radius: 50%; width: 100%;">
    </td>
    <td style="line-height: 50px;"><a href="https://github.com/lukasholzer">Lukas Holzer</a></td>
  </tr>
  <tr>
    <td style="width: 50px; height: 50px;">
      <img src="https://avatars2.githubusercontent.com/u/1374451?s=50&v=4" style="border-radius: 50%; width: 100%;">
    </td>
    <td style="line-height: 50px;"><a href="https://github.com/ddprrt">Baumi</a></td>
  </tr>
</table>

## License

[MIT license](LICENSE) — copyright 2018 Dynatrace Austria GmbH
