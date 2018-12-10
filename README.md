![Github banner for sketchmine](https://dt-cdn.net/images/github-banner-2x-1777-2b23e499af.png)

[![Build Status](https://dev.azure.com/sketchmine/sketchmine/_apis/build/status/Dynatrace.sketchmine)](https://dev.azure.com/sketchmine/sketchmine/_build/latest?definitionId=1) [![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/) [![jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)
[![made with sketchmine](https://dt-cdn.net/images/made-with-sketchmine-a27f1dfce3.svg)](https://github.com/Dynatrace/sketchmine/)

* [The Parts](#the-parts)
* [Dependency graph](#dependency-graph)
* [Getting started 🚀](#installation)
* [Testing](#testing)
* [Maintainers](#maintainers)
* [License](#license)

## The Parts

* [**app-builder**](./packages/app-builder/README.md) generates an angular app with the information of the *code-analyzer*.
* [**code-analyzer**](./packages/code-analyzer/README.md) creates a JSON representation of the provided code *(supported: <a href="https://angular.io/">angular</a>)*.
* [**dom-agent**](./packages/dom-agent/README.md) a dom traverser that gets injected by the browser to scrape the information out of the page.
* [**helpers**](./packages/helpers/README.md) collection of plattform independend helpers.
* [**library**](./packages/library/README.md) the orchestration of the executeable parts – generates the whole .sketch library out of the dynatrace angular components.
* [**node-helpers**](./packages/node-helpers/README.md) collection of Node.js helpers.
* [**sketch-builder**](./packages/sketch-builder/README.md) scrapes a webpage and generates .sketch file.
* [**sketch-color-replacer**](./packages/sketch-color-replacer/README.md) replaces a set of colors in a .sketch file.
* [**sketch-file-format**](./packages/sketch-file-format/README.md) AST of the .sketch file format with all functionality to generate a .sketch file.
* [**sketch-svg-parser**](./packages/sketch-svg-parser/README.md) Parses SVG elements and converts it to Sketch shapes
* [**sketch-validator**](./packages/sketch-validator/README.md) Validates Sketch JSON's with the provided rules. *Available in umd, cjs and esm formats*.
* [**sketch-validator-nodejs-wrapper**](./packages/sketch-validator-nodejs-wrapper/README.md) A Node.js wrapper around the sketch validator package that uses a .sketch file to validate it.

## Getting started

### Architecture

Sketchmine follows a monorepo approach and all officially maintained modules and dependencies are in the same repository.

> The tool for managing the monorepo @sketchmine has been extracted out as [Lerna](https://github.com/lerna/lerna)

### Dependency graph

![Dependency graph of the sketchmine mono repository](https://dt-cdn.net/images/dependency-graph-3920-82e93eaddf.png)


### Installation

To start contributing and developing you have to run `yarn install` to install all the necessary dependencies.
after that you can switch to any package in the `./packages` folder and start to get the hands dirty 👷🏼‍.

If you want to run [tasks](https://docs.npmjs.com/misc/scripts) across all packages [lerna](https://lernajs.io/) comes to the rescue. You can use the npm scripts in the root package folder or you can execute all tasks with the `lerna run build` command to execute the `yarn build` command in every package. For further information check out the lerna documentation site.


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

## Testing

For us, tests are very important to ensure a good coding quality. Therefore we choose [jest](https://github.com/facebook/jest) as our testing library. In case that it comes with a mocking library built in. To get confident with the testing syntax visit the Jest Documentation. Jest follows the Jasmine convention.

The files have to contain the pattern `**/*.test.ts`, for unit tests and
for end 2 end testing `**/*.e2e.ts`. All tests should stay in the `tests` folder. Even though it is possible to place tests in the `src` folder if there is a good reason.

To execute the tests run `yarn test`. That will run the jest test and provides you with a coverage for the package.

**Important!**

All tests should be wrapped in a describe with the prefix of the package: `[sketch-builder] › ...` like the following example:

```typescript
//... import statements

describe('[${package}] › ${folder} › ${description of the suite}', () => {

// .. your tests should place here.

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
    <td style="line-height: 50px;"><a href="https://github.com/ddprrt">Baumir</a></td>
  </tr>
</table>

## License

[MIT license](LICENSE) — copyright 2018 Dynatrace Austria GmbH
