# Changelog


## v2.7.1 – 2019.2.2

#### Contributors

- [Lara Aigmueller](mailto:lara.aigmueller@dynatrace.com)

#### Commits

##### Bug Fixes 🐞

* [[`1d2f2f9`](https://github.com/Dynatrace/sketchmine/commit/1d2f2f9)] -  **sketch-validator**:  don't validate fill- and border-colors of artboards ([**Lara Aigmueller**](mailto:lara.aigmueller@dynatrace.com))

## v2.7.0 – 2019.2.1

#### Contributors

- [Lara Aigmueller](mailto:lara.aigmueller@dynatrace.com)

#### Commits

##### Features

* [[`c3f6b95`](https://github.com/Dynatrace/sketchmine/commit/c3f6b95)] -  **sketch-validator**:  add purple-200 to valid font colors  ([**Lara Aigmueller**](mailto:lara.aigmueller@dynatrace.com))

##### Bug Fixes 🐞

* [[`b42cdf7`](https://github.com/Dynatrace/sketchmine/commit/b42cdf7)] -  **sketch-validator**:  fix collecting modules  ([**Lara Aigmueller**](mailto:lara.aigmueller@dynatrace.com))

## v2.6.1 – 2019.1.4

#### Contributors

- [Lukas Holzer](mailto:lukas.holzer@dynatrace.com)
- [Lara Aigmueller](mailto:lara.aigmueller@dynatrace.com)

#### Commits

##### Bug Fixes 🐞

* [[`35e2341`](https://github.com/Dynatrace/sketchmine/commit/35e2341)] -  **sketch-validator**:  fix breaking validation in docker image  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-9128 ](https://dev-jira.dynatrace.org/browse/UX-9128 )
* [[`a8d4163`](https://github.com/Dynatrace/sketchmine/commit/a8d4163)] -  **sketch-builder**:  fix semantic error conversion type  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))
* [[`33f3bf2`](https://github.com/Dynatrace/sketchmine/commit/33f3bf2)] -  **sketch-validation-interface**:  add virtual scrolling to fix performance issues with a long list  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-9064 ](https://dev-jira.dynatrace.org/browse/UX-9064 )
* [[`39324bc`](https://github.com/Dynatrace/sketchmine/commit/39324bc)] -  **sketch-validation-interface**:  fix wordbreak in rules configuration  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-9064 ](https://dev-jira.dynatrace.org/browse/UX-9064 )
* [[`4799c5a`](https://github.com/Dynatrace/sketchmine/commit/4799c5a)] -  **sketch-validator**:  only check if artboard of current task is empty, fix check if page is symbol master  ([**Lara Aigmueller**](mailto:lara.aigmueller@dynatrace.com))    *issues:*    [UX-9039 ](https://dev-jira.dynatrace.org/browse/UX-9039 )
* [[`7d5b7b3`](https://github.com/Dynatrace/sketchmine/commit/7d5b7b3)] -  **sketch-validator**:  fix merging of rule options and font family regex match  ([**Lara Aigmueller**](mailto:lara.aigmueller@dynatrace.com))
* [[`04e6a9c`](https://github.com/Dynatrace/sketchmine/commit/04e6a9c)] -  **sketch-file-format**:  fix Bernina Sans font and kerning issues  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8785 ](https://dev-jira.dynatrace.org/browse/UX-8785 )

##### Features


* [[`1d474c1`](https://github.com/Dynatrace/sketchmine/commit/1d474c1)] -  **sketch-validator**:  add check if symbols page is valid  ([**Lara Aigmueller**](mailto:lara.aigmueller@dynatrace.com))    *issues:*    [UX-9039 ](https://dev-jira.dynatrace.org/browse/UX-9039 )


## v2.6.0 – 2019.1.30

#### Contributors

  - [Lukas Holzer](mailto:lukas.holzer@dynatrace.com)
  - [Lara Aigmueller](mailto:lara.aigmueller@dynatrace.com)

#### Commits

##### Features

* [[`e145610`](https://github.com/Dynatrace/sketchmine/commit/e145610)] -  **sketch-validator**:  extend list of color validation selectors and enable background color validation for artboards  ([**Lara Aigmueller**](mailto:lara.aigmueller@dynatrace.com))    *issues:*    [UX-8756 ](https://dev-jira.dynatrace.org/browse/UX-8756 )
* [[`49c448f`](https://github.com/Dynatrace/sketchmine/commit/49c448f)] -  **sketch-validator**:  separate text and text style validations  ([**Lara Aigmueller**](mailto:lara.aigmueller@dynatrace.com))    *issues:*    [UX-8645 ](https://dev-jira.dynatrace.org/browse/UX-8645 )

##### Bug Fixes 🐞

* [[`ca54ba2`](https://github.com/Dynatrace/sketchmine/commit/ca54ba2)] -  **sketch-validator**:  updated list of valid text colors according to defined text styles  ([**Lara Aigmueller**](mailto:lara.aigmueller@dynatrace.com))


## v2.5.1 – 2019.1.17

#### Contributors

  - [Lukas Holzer](mailto:lukas.holzer@dynatrace.com)

#### Commits

##### Bug Fixes 🐞


* [[`6a0890a`](https://github.com/Dynatrace/sketchmine/commit/6a0890a)] -  **sketch-builder**:  remove readFile in case that it is not present in npm package  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))



## v2.5.0 – 2019.1.16

#### Contributors

  - [Lukas Holzer](mailto:lukas.holzer@dynatrace.com)
  - [Fabian Friedl](mailto:fabian.friedl@dynatrace.com)
  - [Baumgartner](mailto:sbaumg@gmail.com)

#### Commits

##### Bug Fixes 🐞

* [[`6b087f9`](https://github.com/Dynatrace/sketchmine/commit/6b087f9)] -  **sketch-builder**:  remove readFile in case that it is not shipped in npm package  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))
* [[`9e5c571`](https://github.com/Dynatrace/sketchmine/commit/9e5c571)] -  **app-builder**:  remove user specific code  ([**Fabian Friedl**](mailto:fabian.friedl@dynatrace.com))

##### Features

* [[`f98a784`](https://github.com/Dynatrace/sketchmine/commit/f98a784)] -  **sketch-validation-interface**:  add plugin-interface  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))
* [[`7bd8153`](https://github.com/Dynatrace/sketchmine/commit/7bd8153)] -  **sketch-validation-plugin**:  add sketchplugin to the monorepo  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))
* [[`1a8d030`](https://github.com/Dynatrace/sketchmine/commit/1a8d030)] -  **app-builder**:  add dynatrace-config for components  ([**Fabian Friedl**](mailto:fabian.friedl@dynatrace.com))

## v2.4.0 – 2019.1.5

#### Contributors

  - [Lukas Holzer](mailto:lukas.holzer@dynatrace.com)
  - [Stefan Baumgartner](mailto:sbaumg@gmail.com)
  - [Fabian Friedl](mailto:fabian.friedl@dynatrace.com)
  - [Katrin Freihofner](mailto:katrin.freihofner@dynatrace.com)

#### Commits

##### Bug Fixes 🐞

* [[`45c76e0`](https://github.com/Dynatrace/sketchmine/commit/45c76e0)] -  **sketch-validator**:  remove node-dependencies and provide logger and error handler via DI  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))
* [[`18613c0`](https://github.com/Dynatrace/sketchmine/commit/18613c0)] -  **app-builder**:  add missing schematics dependency  ([**Fabian Friedl**](mailto:fabian.friedl@dynatrace.com))
* [[`f01e3b5`](https://github.com/Dynatrace/sketchmine/commit/f01e3b5)] -  **sketch-validator**:  excluded symbols pages from validation, added check if page has artboards and updates tests  ([**Katrin Freihofner**](mailto:katrin.freihofner@dynatrace.com))    *issues:*    [UX-8672 ](https://dev-jira.dynatrace.org/browse/UX-8672 )
* [[`5741efa`](https://github.com/Dynatrace/sketchmine/commit/5741efa)] -  **changelog-generation**:  fix wrong access to matches array – full match is on position 0 in array  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))

##### Features

* [[`a12dd27`](https://github.com/Dynatrace/sketchmine/commit/a12dd27)] -  **sketch-builder**:  add initial walkthrough to generate a config.json  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8766 ](https://dev-jira.dynatrace.org/browse/UX-8766 )


## v2.3.1 – 2018.12.4

#### Contributors

  - [Lukas Holzer](mailto:lukas.holzer@dynatrace.com)
  - [Stefan Baumgartner](mailto:sbaumg@gmail.com)

#### Commits

##### Bug Fixes 🐞


* [[`6d3f482`](https://github.com/Dynatrace/sketchmine/commit/6d3f482)] -  **sketch-builder**:  adjust paths with dirname and add syntax highlighting for JSON in CLI.  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))
* [[`b7854ab`](https://github.com/Dynatrace/sketchmine/commit/b7854ab)] -  **sketch-file-builder**:  remove double export  ([**Stefan Baumgartner**](mailto:sbaumg@gmail.com))


## v2.3.0 – 2018.12.4

#### Contributors

  - [Lukas Holzer](mailto:lukas.holzer@dynatrace.com)

#### Commits

##### Bug Fixes 🐞


* [[`8dae64e`](https://github.com/Dynatrace/sketchmine/commit/8dae64e)] -  **changelog-generation**: needs to be public for publishing with lerna  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))
* [[`5890078`](https://github.com/Dynatrace/sketchmine/commit/5890078)] -  **node-helpers**:  correct align of multiline help texts in the display-help function.  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))

##### Features


* [[`6e1162d`](https://github.com/Dynatrace/sketchmine/commit/6e1162d)] -  **sketch-builder**:  provide default dom-agent and preview.png in sketch-builder. #20  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))  *issues:*    [#20](https://github.com/Dynatrace/sketchmine/issues/#20)
* [[`6fab58b`](https://github.com/Dynatrace/sketchmine/commit/6fab58b)] -  **changelog-generation**:  add changelog generation  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8794 ](https://dev-jira.dynatrace.org/browse/UX-8794 )


## v2.2.0 – 2018.12.1

#### Contributors

  - [Lukas Holzer](mailto:lukas.holzer@dynatrace.com)
  - [Stefan Baumgartner](mailto:sbaumg@gmail.com)
  - [Chris Thompson](mailto:chris.thompson@ruxit.com)

#### Commits

##### Bug Fixes 🐞


* [[`d815495`](https://github.com/Dynatrace/sketchmine/commit/d815495)] -  **code-analyzer**:  fix merge issue of the extends and implements  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8768 ](https://dev-jira.dynatrace.org/browse/UX-8768 )
* [[`7346bdc`](https://github.com/Dynatrace/sketchmine/commit/7346bdc)] -  **code-analyzer**:  fix the adjusting of the absolute paths from the `tsconfig.compilerOptions`.  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8768 ](https://dev-jira.dynatrace.org/browse/UX-8768 )
* [[`365a224`](https://github.com/Dynatrace/sketchmine/commit/365a224)] -  **code-analyzer**:  add tsconfig path option to the configuration  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8768 ](https://dev-jira.dynatrace.org/browse/UX-8768 )


## v2.1.0 – 2018.11.5

#### Contributors

  - [Lukas Holzer](mailto:lukas.holzer@dynatrace.com)

#### Commits

##### Bug Fixes 🐞


* [[`ab7b22c`](https://github.com/Dynatrace/sketchmine/commit/ab7b22c)] -  **sketch-builder**:  fix configuration to generate library and page  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8720 ](https://dev-jira.dynatrace.org/browse/UX-8720 )
* [[`85d693e`](https://github.com/Dynatrace/sketchmine/commit/85d693e)] -  **app-builder**:  copy always actual meta-information  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8720 ](https://dev-jira.dynatrace.org/browse/UX-8720 )
* [[`b346035`](https://github.com/Dynatrace/sketchmine/commit/b346035)] -  **app-builder**:  import only from typings in appshell adjust gulp task  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8720 ](https://dev-jira.dynatrace.org/browse/UX-8720 )
* [[`d45ccec`](https://github.com/Dynatrace/sketchmine/commit/d45ccec)] -  **library**:  make packages public  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8720 ](https://dev-jira.dynatrace.org/browse/UX-8720 )
* [[`c4176e6`](https://github.com/Dynatrace/sketchmine/commit/c4176e6)] -  **app-builder**:  import typings from code-anyalyzer  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8720 ](https://dev-jira.dynatrace.org/browse/UX-8720 )


## v2.0.0 – 2018.11.3

#### Contributors

  - [Lukas Holzer](mailto:lukas.holzer@dynatrace.com)
  - [Lara Aigmueller](mailto:lara.aigmueller@dynatrace.com)

  Refactoring to a monorepo approach. All officially maintained modules and dependencies are now in the same repository under the `./packages` folder now.

  > The tool for managing the monorepo @sketchmine has been extracted out as [Lerna](https://github.com/lerna/lerna)

#### Commits

##### Bug Fixes 🐞


* [[`f051da6`](https://github.com/Dynatrace/sketchmine/commit/f051da6)] -  **sketch-validator**:  remove module from tsconfig for build only for lint in commonjs  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8720 ](https://dev-jira.dynatrace.org/browse/UX-8720 )
* [[`8a85a9b`](https://github.com/Dynatrace/sketchmine/commit/8a85a9b)] -  **app-builder**:  update to Angular version 7  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8728 ](https://dev-jira.dynatrace.org/browse/UX-8728 )
* [[`07a5dde`](https://github.com/Dynatrace/sketchmine/commit/07a5dde)] -  **app-builder**:  update to Angular version 7  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8728 ](https://dev-jira.dynatrace.org/browse/UX-8728 )
* [[`630249a`](https://github.com/Dynatrace/sketchmine/commit/630249a)] -  **library**:  remove malicious dependency  ([**Lara Aigmueller**](mailto:lara.aigmueller@dynatrace.com))    *issues:*    [UX-0000 ](https://dev-jira.dynatrace.org/browse/UX-0000 )
* [[`3ec1b21`](https://github.com/Dynatrace/sketchmine/commit/3ec1b21)] -  **library**:  remove cameltokebab from barrel file  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8663 ](https://dev-jira.dynatrace.org/browse/UX-8663 )
* [[`948e2ef`](https://github.com/Dynatrace/sketchmine/commit/948e2ef)] -  **library**:  unsubscribe from meta subscription  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8663 ](https://dev-jira.dynatrace.org/browse/UX-8663 )
* [[`fecea50`](https://github.com/Dynatrace/sketchmine/commit/fecea50)] -  **library**:  fix if viewData node is undefined  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8474 ](https://dev-jira.dynatrace.org/browse/UX-8474 )
* [[`f6169cd`](https://github.com/Dynatrace/sketchmine/commit/f6169cd)] -  **sketch-validator**:  revert logger update  ([**Lara Aigmueller**](mailto:lara.aigmueller@dynatrace.com))    *issues:*    [UX-8638 ](https://dev-jira.dynatrace.org/browse/UX-8638 )
* [[`24534aa`](https://github.com/Dynatrace/sketchmine/commit/24534aa)] -  **sketch-validator**:  add Bitstream Vera to allowed fonts  ([**Lara Aigmueller**](mailto:lara.aigmueller@dynatrace.com))    *issues:*    [UX-8638 ](https://dev-jira.dynatrace.org/browse/UX-8638 )
* [[`a06eae4`](https://github.com/Dynatrace/sketchmine/commit/a06eae4)] -  **sketch-validator**:  check if text color is set  ([**Lara Aigmueller**](mailto:lara.aigmueller@dynatrace.com))    *issues:*    [UX-8638 ](https://dev-jira.dynatrace.org/browse/UX-8638 )
* [[`831a9ca`](https://github.com/Dynatrace/sketchmine/commit/831a9ca)] -  **sketch-validator**:  handle promise correctly  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8624 ](https://dev-jira.dynatrace.org/browse/UX-8624 )
* [[`cade4a1`](https://github.com/Dynatrace/sketchmine/commit/cade4a1)] -  **sketch-validation**:  fix filename (regex was wrong)  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8624 ](https://dev-jira.dynatrace.org/browse/UX-8624 )
* [[`ba5d0ff`](https://github.com/Dynatrace/sketchmine/commit/ba5d0ff)] -  **sketch-validator**:  fix wrong condition  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8621 ](https://dev-jira.dynatrace.org/browse/UX-8621 )
* [[`49778cc`](https://github.com/Dynatrace/sketchmine/commit/49778cc)] -  **sketch-validator**:  fix wrong condition  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8621 ](https://dev-jira.dynatrace.org/browse/UX-8621 )
* [[`1b62fdd`](https://github.com/Dynatrace/sketchmine/commit/1b62fdd)] -  **sketch-validator**:  fix merge conflict  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8550 ](https://dev-jira.dynatrace.org/browse/UX-8550 )
* [[`d03315f`](https://github.com/Dynatrace/sketchmine/commit/d03315f)] -  **sketch-validator**:  test commit  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8550 ](https://dev-jira.dynatrace.org/browse/UX-8550 )
* [[`220e942`](https://github.com/Dynatrace/sketchmine/commit/220e942)] -  **sketch-validator**:  test commit  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8550 ](https://dev-jira.dynatrace.org/browse/UX-8550 )
* [[`72d0615`](https://github.com/Dynatrace/sketchmine/commit/72d0615)] -  **sketch-validator**:  updates  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8550 ](https://dev-jira.dynatrace.org/browse/UX-8550 )
* [[`179a6df`](https://github.com/Dynatrace/sketchmine/commit/179a6df)] -  **sketch-validator**:  fix errors coming from rebasing  ([**Lara Aigmueller**](mailto:lara.aigmueller@dynatrace.com))    *issues:*    [UX-8492 ](https://dev-jira.dynatrace.org/browse/UX-8492 )
* [[`73a110f`](https://github.com/Dynatrace/sketchmine/commit/73a110f)] -  **sketch-validator**:  fix sketch base interface  ([**Lara Aigmueller**](mailto:lara.aigmueller@dynatrace.com))    *issues:*    [UX-8492 ](https://dev-jira.dynatrace.org/browse/UX-8492 )

##### Features


* [[`276e7b0`](https://github.com/Dynatrace/sketchmine/commit/276e7b0)] -  **library**:  version bump  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))
* [[`6cffbfe`](https://github.com/Dynatrace/sketchmine/commit/6cffbfe)] -  **sketch-generator**:  draw nested symbols  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8536 ](https://dev-jira.dynatrace.org/browse/UX-8536 )
* [[`e18014a`](https://github.com/Dynatrace/sketchmine/commit/e18014a)] -  **library, angular-meta-parser**:  detect symbol variant for library  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8474 ](https://dev-jira.dynatrace.org/browse/UX-8474 )
* [[`d8c74b8`](https://github.com/Dynatrace/sketchmine/commit/d8c74b8)] -  **sketch-validator**:  error Handler handle warnings  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8621 ](https://dev-jira.dynatrace.org/browse/UX-8621 )
* [[`d8dd557`](https://github.com/Dynatrace/sketchmine/commit/d8dd557)] -  **sketch-validator**:  add sketchlint.json for configuration  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8621 ](https://dev-jira.dynatrace.org/browse/UX-8621 )
* [[`f8eeb82`](https://github.com/Dynatrace/sketchmine/commit/f8eeb82)] -  **sketch-validator**:  validate font colors and minimum size  ([**Lara Aigmueller**](mailto:lara.aigmueller@dynatrace.com))    *issues:*    [UX-8492 ](https://dev-jira.dynatrace.org/browse/UX-8492 )
* [[`12983fa`](https://github.com/Dynatrace/sketchmine/commit/12983fa)] -  **sketch-validator**:  check if correct headline styles are used depending on the page name  ([**Lara Aigmueller**](mailto:lara.aigmueller@dynatrace.com))    *issues:*    [UX-8492 ](https://dev-jira.dynatrace.org/browse/UX-8492 )
* [[`d9d14d0`](https://github.com/Dynatrace/sketchmine/commit/d9d14d0)] -  **sketch-validator**:  extend check for shared text styles  ([**Lara Aigmueller**](mailto:lara.aigmueller@dynatrace.com))    *issues:*    [UX-8492 ](https://dev-jira.dynatrace.org/browse/UX-8492 )
* [[`85b591b`](https://github.com/Dynatrace/sketchmine/commit/85b591b)] -  **sketch-validator**:  add text validations and tests  ([**Lara Aigmueller**](mailto:lara.aigmueller@dynatrace.com))    *issues:*    [UX-8492 ](https://dev-jira.dynatrace.org/browse/UX-8492 )
* [[`78104c5`](https://github.com/Dynatrace/sketchmine/commit/78104c5)] -  **sketch-validator**:  add document.json and rule requirements to validator  ([**Lara Aigmueller**](mailto:lara.aigmueller@dynatrace.com))    *issues:*    [UX-8492 ](https://dev-jira.dynatrace.org/browse/UX-8492 )


## v1.2.7 – 2018.9.1

#### Contributors

  - [Lukas Holzer](mailto:lukas.holzer@dynatrace.com)
  - [Katrin Freihofner](mailto:katrin.freihofner@dynatrace.com)
  - [Thomas Heller](mailto:thomas.heller@dynatrace.com)

#### Commits

##### Bug Fixes 🐞


* [[`039e985`](https://github.com/Dynatrace/sketchmine/commit/039e985)] -  **sketch-validator**:  push tag  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8550 ](https://dev-jira.dynatrace.org/browse/UX-8550 )
* [[`2f51b75`](https://github.com/Dynatrace/sketchmine/commit/2f51b75)] -  **sketch-validator**:  update push of tags  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8550 ](https://dev-jira.dynatrace.org/browse/UX-8550 )
* [[`25f98ff`](https://github.com/Dynatrace/sketchmine/commit/25f98ff)] -  **sketch-validator**:  push tag  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8550 ](https://dev-jira.dynatrace.org/browse/UX-8550 )
* [[`e45303d`](https://github.com/Dynatrace/sketchmine/commit/e45303d)] -  **sketch-validator**:  tag with message skip ci  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8550 ](https://dev-jira.dynatrace.org/browse/UX-8550 )
* [[`334ae60`](https://github.com/Dynatrace/sketchmine/commit/334ae60)] -  **sketch-validator**:  add a tag with skip-cli  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8550 ](https://dev-jira.dynatrace.org/browse/UX-8550 )
* [[`d112402`](https://github.com/Dynatrace/sketchmine/commit/d112402)] -  **sketch-validator**:  add skip cli  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8550 ](https://dev-jira.dynatrace.org/browse/UX-8550 )
* [[`04310fe`](https://github.com/Dynatrace/sketchmine/commit/04310fe)] -  **sketch-validator**:  version bump  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8550 ](https://dev-jira.dynatrace.org/browse/UX-8550 )
* [[`65e380c`](https://github.com/Dynatrace/sketchmine/commit/65e380c)] -  **sketch-validator**:  fix the jenkinsfile  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8550 ](https://dev-jira.dynatrace.org/browse/UX-8550 )
* [[`e702936`](https://github.com/Dynatrace/sketchmine/commit/e702936)] -  **sketch-validator**:  try to fix the git push  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8550 ](https://dev-jira.dynatrace.org/browse/UX-8550 )
* [[`55d784c`](https://github.com/Dynatrace/sketchmine/commit/55d784c)] -  **sketch-validator**:  add branch for remote  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8550 ](https://dev-jira.dynatrace.org/browse/UX-8550 )
* [[`141aa0e`](https://github.com/Dynatrace/sketchmine/commit/141aa0e)] -  **sketch-validator**:  update sem versioning  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8550 ](https://dev-jira.dynatrace.org/browse/UX-8550 )
* [[`759e918`](https://github.com/Dynatrace/sketchmine/commit/759e918)] -  **sketch-validator**:  update versioning  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8550 ](https://dev-jira.dynatrace.org/browse/UX-8550 )
* [[`3d0d9b4`](https://github.com/Dynatrace/sketchmine/commit/3d0d9b4)] -  **sketch-validator**:  version bump for patch  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8550 ](https://dev-jira.dynatrace.org/browse/UX-8550 )
* [[`cdd8aa9`](https://github.com/Dynatrace/sketchmine/commit/cdd8aa9)] -  **sketch-validator**:  fix validation skip  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8550 ](https://dev-jira.dynatrace.org/browse/UX-8550 )
* [[`0e7da40`](https://github.com/Dynatrace/sketchmine/commit/0e7da40)] -  **ab-validation**:  check if artboards on this page should be validated  ([**Katrin Freihofner**](mailto:katrin.freihofner@dynatrace.com))
* [[`9a9b1e5`](https://github.com/Dynatrace/sketchmine/commit/9a9b1e5)] -  **sketch-generator**:  svg icon problem fix  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8438 ](https://dev-jira.dynatrace.org/browse/UX-8438 )
* [[`03188b7`](https://github.com/Dynatrace/sketchmine/commit/03188b7)] -  **angular-meta-parser**:  fix double mutations  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8444 ](https://dev-jira.dynatrace.org/browse/UX-8444 )
* [[`e8dc115`](https://github.com/Dynatrace/sketchmine/commit/e8dc115)] -  **library**:  fix import for debug component and add postinstall to packagejson  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8444 ](https://dev-jira.dynatrace.org/browse/UX-8444 )
* [[`59fde14`](https://github.com/Dynatrace/sketchmine/commit/59fde14)] -  **angular-meta-parser**:  no undefined value  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8444 ](https://dev-jira.dynatrace.org/browse/UX-8444 )
* [[`60d2410`](https://github.com/Dynatrace/sketchmine/commit/60d2410)] -  **sketch-generator**:  lineto interface for point changed  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8513 ](https://dev-jira.dynatrace.org/browse/UX-8513 )
* [[`ba0e53c`](https://github.com/Dynatrace/sketchmine/commit/ba0e53c)] -  **sketch-generator**:  fix svg parser with only curveto and moveto  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8513 ](https://dev-jira.dynatrace.org/browse/UX-8513 )
* [[`a7f5aee`](https://github.com/Dynatrace/sketchmine/commit/a7f5aee)] -  **sketch-generator**:  fix the text styles with inline and lineheight  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8411 ](https://dev-jira.dynatrace.org/browse/UX-8411 )
* [[`224a4ae`](https://github.com/Dynatrace/sketchmine/commit/224a4ae)] -  **sketch-generator**:  text kerning with own kerning table  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8411 ](https://dev-jira.dynatrace.org/browse/UX-8411 )
* [[`c2391d1`](https://github.com/Dynatrace/sketchmine/commit/c2391d1)] -  **rule-config**:  fixed env check for filename validation  ([**Katrin Freihofner**](mailto:katrin.freihofner@dynatrace.com))
* [[`060eecf`](https://github.com/Dynatrace/sketchmine/commit/060eecf)] -  **rule-config**:  fixed environment in file name validation  ([**Katrin Freihofner**](mailto:katrin.freihofner@dynatrace.com))
* [[`e79c873`](https://github.com/Dynatrace/sketchmine/commit/e79c873)] -  **rule-config**:  fixed environment for all validation rules  ([**Katrin Freihofner**](mailto:katrin.freihofner@dynatrace.com))
* [[`a17b814`](https://github.com/Dynatrace/sketchmine/commit/a17b814)] -  **rule-config**:  fixed environment for all validation rules  ([**Katrin Freihofner**](mailto:katrin.freihofner@dynatrace.com))
* [[`39e0c6f`](https://github.com/Dynatrace/sketchmine/commit/39e0c6f)] -  **library**:  add nvmrc  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))
* [[`b87b24c`](https://github.com/Dynatrace/sketchmine/commit/b87b24c)] -  **sketch-generator**:  pull request feedback  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8383 ](https://dev-jira.dynatrace.org/browse/UX-8383 )
* [[`7473055`](https://github.com/Dynatrace/sketchmine/commit/7473055)] -  **sketch-generator**:  multiline text  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8383 ](https://dev-jira.dynatrace.org/browse/UX-8383 )
* [[`583e4ac`](https://github.com/Dynatrace/sketchmine/commit/583e4ac)] -  **sketch-generator**:  fix the svg problem  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8383 ](https://dev-jira.dynatrace.org/browse/UX-8383 )
* [[`e931916`](https://github.com/Dynatrace/sketchmine/commit/e931916)] -  **library**:  add timout for http request  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8383 ](https://dev-jira.dynatrace.org/browse/UX-8383 )
* [[`456827b`](https://github.com/Dynatrace/sketchmine/commit/456827b)] -  **library**:  check if ngOnChanges exists  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8383 ](https://dev-jira.dynatrace.org/browse/UX-8383 )
* [[`8c911f9`](https://github.com/Dynatrace/sketchmine/commit/8c911f9)] -  **library**:  change detection in app shell  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8383 ](https://dev-jira.dynatrace.org/browse/UX-8383 )
* [[`0dc9a69`](https://github.com/Dynatrace/sketchmine/commit/0dc9a69)] -  **library**:  puppeteer version fix for docker  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8365 ](https://dev-jira.dynatrace.org/browse/UX-8365 )
* [[`daa7a22`](https://github.com/Dynatrace/sketchmine/commit/daa7a22)] -  **build**:  fixing typo for target  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8365 ](https://dev-jira.dynatrace.org/browse/UX-8365 )
* [[`a1491fc`](https://github.com/Dynatrace/sketchmine/commit/a1491fc)] -  **dom-traverser**:  fix issue with empty BCR  ([**lukas.holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8251 ](https://dev-jira.dynatrace.org/browse/UX-8251 )
* [[`02ea787`](https://github.com/Dynatrace/sketchmine/commit/02ea787)] -  **angular-variant-generator**:  styling issues  ([**lukas.holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8251 ](https://dev-jira.dynatrace.org/browse/UX-8251 )
* [[`e84f4bb`](https://github.com/Dynatrace/sketchmine/commit/e84f4bb)] -  **sketch-validator**:  fix regex  ([**lukas.holzer**](mailto:lukas.holzer@dynatrace.com))
* [[`890f5ee`](https://github.com/Dynatrace/sketchmine/commit/890f5ee)] -  **sketch-validator**:  convert 3digit hex to 6  ([**lukas.holzer**](mailto:lukas.holzer@dynatrace.com))
* [[`b4b4faf`](https://github.com/Dynatrace/sketchmine/commit/b4b4faf)] -  **angular-meta-parser**:  check for undefined  ([**lukas.holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8251 ](https://dev-jira.dynatrace.org/browse/UX-8251 )
* [[`45e35dc`](https://github.com/Dynatrace/sketchmine/commit/45e35dc)] -  **angular-meta-parser**:  check for undefined  ([**lukas.holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8251 ](https://dev-jira.dynatrace.org/browse/UX-8251 )
* [[`f9dee0c`](https://github.com/Dynatrace/sketchmine/commit/f9dee0c)] -  **sketch-generator**:  fix assets path  ([**lukas.holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8278 ](https://dev-jira.dynatrace.org/browse/UX-8278 )
* [[`8e92a27`](https://github.com/Dynatrace/sketchmine/commit/8e92a27)] -  **utils**:  fix import  ([**lukas.holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8220 ](https://dev-jira.dynatrace.org/browse/UX-8220 )
* [[`b7d3801`](https://github.com/Dynatrace/sketchmine/commit/b7d3801)] -  **utils**:  update logger path  ([**lukas.holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8220 ](https://dev-jira.dynatrace.org/browse/UX-8220 )
* [[`0a84a39`](https://github.com/Dynatrace/sketchmine/commit/0a84a39)] -  **sketch-generator**:  reset url back to angular app  ([**lukas.holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8220 ](https://dev-jira.dynatrace.org/browse/UX-8220 )
* [[`3d48744`](https://github.com/Dynatrace/sketchmine/commit/3d48744)] -  **angular-meta-parser**:  fix interface property types  ([**lukas.holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8220 ](https://dev-jira.dynatrace.org/browse/UX-8220 )
* [[`0543dbb`](https://github.com/Dynatrace/sketchmine/commit/0543dbb)] -  **run**:  running scripts  ([**lukas.holzer**](mailto:lukas.holzer@dynatrace.com))
* [[`8f14d25`](https://github.com/Dynatrace/sketchmine/commit/8f14d25)] -  **sketch-draw**:  fix async file operations  ([**lukas.holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-7975 ](https://dev-jira.dynatrace.org/browse/UX-7975 )
* [[`75b27a5`](https://github.com/Dynatrace/sketchmine/commit/75b27a5)] -  **jenkinsfile**:  remove clean post  ([**lukas.holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-7975 ](https://dev-jira.dynatrace.org/browse/UX-7975 )
* [[`56f89d1`](https://github.com/Dynatrace/sketchmine/commit/56f89d1)] -  add createDir and update timeout  ([**lukas.holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-7975 ](https://dev-jira.dynatrace.org/browse/UX-7975 )
* [[`bd639e6`](https://github.com/Dynatrace/sketchmine/commit/bd639e6)] -  **jenkinsfile**:  fix checkout  ([**lukas.holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-7975 ](https://dev-jira.dynatrace.org/browse/UX-7975 )
* [[`9fffd84`](https://github.com/Dynatrace/sketchmine/commit/9fffd84)] -  **jenkins**:  update to master and remove error of git lfs pull with git reset  ([**lukas.holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8118 ](https://dev-jira.dynatrace.org/browse/UX-8118 )
* [[`44b410a`](https://github.com/Dynatrace/sketchmine/commit/44b410a)] -  **validation**:  only validate enabled fills and borders  ([**lukas.holzer**](mailto:lukas.holzer@dynatrace.com))
* [[`844e305`](https://github.com/Dynatrace/sketchmine/commit/844e305)] -  **tsconfig**:  adjust tsconfig for jenkins  ([**Thomas Heller**](mailto:thomas.heller@dynatrace.com))

##### Features


* [[`e266ff3`](https://github.com/Dynatrace/sketchmine/commit/e266ff3)] -  **sketch-validator**:  make it npm ready and strip out node specific parts  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8550 ](https://dev-jira.dynatrace.org/browse/UX-8550 )
* [[`117e0c4`](https://github.com/Dynatrace/sketchmine/commit/117e0c4)] -  **sketch-validator**:  add build for npm regestry  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8550 ](https://dev-jira.dynatrace.org/browse/UX-8550 )
* [[`bf13bf7`](https://github.com/Dynatrace/sketchmine/commit/bf13bf7)] -  **sketch-generator, dom-traverser**:  sophisticated error message  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8439 ](https://dev-jira.dynatrace.org/browse/UX-8439 )
* [[`9401769`](https://github.com/Dynatrace/sketchmine/commit/9401769)] -  **sketch-generator**:  update ordering of symbols  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8474 ](https://dev-jira.dynatrace.org/browse/UX-8474 )
* [[`ab1e8a6`](https://github.com/Dynatrace/sketchmine/commit/ab1e8a6)] -  **sketch-generator**:  update  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8439 ](https://dev-jira.dynatrace.org/browse/UX-8439 )
* [[`858ef6b`](https://github.com/Dynatrace/sketchmine/commit/858ef6b)] -  **dom-traverser, sketch-generator**:  check if has symbols  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8439 ](https://dev-jira.dynatrace.org/browse/UX-8439 )
* [[`8a7c68b`](https://github.com/Dynatrace/sketchmine/commit/8a7c68b)] -  **sketch-generator**:  ordering symbols better with a grid  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8444 ](https://dev-jira.dynatrace.org/browse/UX-8444 )
* [[`1133be3`](https://github.com/Dynatrace/sketchmine/commit/1133be3)] -  **library**:  update build parts naming and documentation  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8444 ](https://dev-jira.dynatrace.org/browse/UX-8444 )
* [[`8e6a540`](https://github.com/Dynatrace/sketchmine/commit/8e6a540)] -  **sketch-generator**:  fix http problem and lineheight of text inline style  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8411 ](https://dev-jira.dynatrace.org/browse/UX-8411 )
* [[`41969a5`](https://github.com/Dynatrace/sketchmine/commit/41969a5)] -  **angular-meta-parser**:  do not apply mutation on icons  ([**Lukas Holzer**](mailto:lukas.holzer@tag009442425885.dynatrace.org))    *issues:*    [UX-8444 ](https://dev-jira.dynatrace.org/browse/UX-8444 )
* [[`8648038`](https://github.com/Dynatrace/sketchmine/commit/8648038)] -  **angular-meta-parser**:  add no-design-combinations annotations for icon  ([**Lukas Holzer**](mailto:lukas.holzer@tag009442425885.dynatrace.org))    *issues:*    [UX-8444 ](https://dev-jira.dynatrace.org/browse/UX-8444 )
* [[`4ca815e`](https://github.com/Dynatrace/sketchmine/commit/4ca815e)] -  **angular-meta-parser**:  generate all mutations  ([**Lukas Holzer**](mailto:lukas.holzer@tag009442425885.dynatrace.org))    *issues:*    [UX-8444 ](https://dev-jira.dynatrace.org/browse/UX-8444 )
* [[`cc8fccd`](https://github.com/Dynatrace/sketchmine/commit/cc8fccd)] -  **angular-meta-parser**:  current state  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8444 ](https://dev-jira.dynatrace.org/browse/UX-8444 )
* [[`6cd28ba`](https://github.com/Dynatrace/sketchmine/commit/6cd28ba)] -  **angular-meta-parser**:  add documentation and help function  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8444 ](https://dev-jira.dynatrace.org/browse/UX-8444 )
* [[`5eced86`](https://github.com/Dynatrace/sketchmine/commit/5eced86)] -  **sketch-generator**:  add clipping mask to background 🤘🏻  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8443 ](https://dev-jira.dynatrace.org/browse/UX-8443 )
* [[`755d852`](https://github.com/Dynatrace/sketchmine/commit/755d852)] -  **sketch-generator**:  create Border with shapes  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8443 ](https://dev-jira.dynatrace.org/browse/UX-8443 )
* [[`6eaeac1`](https://github.com/Dynatrace/sketchmine/commit/6eaeac1)] -  **sketch-validator**:  added new validation if artboard is empty  ([**Katrin Freihofner**](mailto:katrin.freihofner@dynatrace.com))    *issues:*    [UX-8255 ](https://dev-jira.dynatrace.org/browse/UX-8255 )
* [[`52b0358`](https://github.com/Dynatrace/sketchmine/commit/52b0358)] -  **sketch-validator**:  added validation to make sure, artboards are not empty  ([**Katrin Freihofner**](mailto:katrin.freihofner@dynatrace.com))    *issues:*    [UX-8255 ](https://dev-jira.dynatrace.org/browse/UX-8255 )
* [[`76fa3f4`](https://github.com/Dynatrace/sketchmine/commit/76fa3f4)] -  **sketch-validator**:  added new tests for new validation  ([**Katrin Freihofner**](mailto:katrin.freihofner@dynatrace.com))    *issues:*    [UX-8255 ](https://dev-jira.dynatrace.org/browse/UX-8255 )
* [[`3a8938c`](https://github.com/Dynatrace/sketchmine/commit/3a8938c)] -  **sketch-validator**:  added new validations for artboards, pages and filenames  ([**Katrin Freihofner**](mailto:katrin.freihofner@dynatrace.com))    *issues:*    [UX-8255 ](https://dev-jira.dynatrace.org/browse/UX-8255 )
* [[`8db494d`](https://github.com/Dynatrace/sketchmine/commit/8db494d)] -  **page-validation**:  WIP - validate page names  ([**Katrin Freihofner**](mailto:katrin.freihofner@dynatrace.com))
* [[`a104066`](https://github.com/Dynatrace/sketchmine/commit/a104066)] -  **sketch-generator**:  add border left, top,bottom support and fix transform  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8383 ](https://dev-jira.dynatrace.org/browse/UX-8383 )
* [[`8f9c386`](https://github.com/Dynatrace/sketchmine/commit/8f9c386)] -  **sketch-generator**:  add support for transform: rotate  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8383 ](https://dev-jira.dynatrace.org/browse/UX-8383 )
* [[`dfa8604`](https://github.com/Dynatrace/sketchmine/commit/dfa8604)] -  **library**:  add debug component  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8383 ](https://dev-jira.dynatrace.org/browse/UX-8383 )
* [[`ff9e8cc`](https://github.com/Dynatrace/sketchmine/commit/ff9e8cc)] -  **sketch-generator**:  function add draw page  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8387 ](https://dev-jira.dynatrace.org/browse/UX-8387 )
* [[`fae620c`](https://github.com/Dynatrace/sketchmine/commit/fae620c)] -  **sketch-generator**:  wip commit add tests  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8383 ](https://dev-jira.dynatrace.org/browse/UX-8383 )
* [[`d4152a8`](https://github.com/Dynatrace/sketchmine/commit/d4152a8)] -  **sketch-generator, dom-traverser**:  add support for line-height  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8383 ](https://dev-jira.dynatrace.org/browse/UX-8383 )
* [[`546bc89`](https://github.com/Dynatrace/sketchmine/commit/546bc89)] -  **sketch-generator**:  only draw folder with style and children  ([**Lukas Holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8383 ](https://dev-jira.dynatrace.org/browse/UX-8383 )
* [[`2c50273`](https://github.com/Dynatrace/sketchmine/commit/2c50273)] -  **library**:  generate full library with one command  ([**lukas.holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8365 ](https://dev-jira.dynatrace.org/browse/UX-8365 )
* [[`bae6051`](https://github.com/Dynatrace/sketchmine/commit/bae6051)] -  **anuglar-library-generator**:  chain to library  ([**lukas.holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8365 ](https://dev-jira.dynatrace.org/browse/UX-8365 )
* [[`ef4543f`](https://github.com/Dynatrace/sketchmine/commit/ef4543f)] -  **angular-meta-parser, library**:  make main callable without args  ([**lukas.holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8365 ](https://dev-jira.dynatrace.org/browse/UX-8365 )
* [[`61807a7`](https://github.com/Dynatrace/sketchmine/commit/61807a7)] -  **angular-library-generator**:  only generate pure examples  ([**lukas.holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8258 ](https://dev-jira.dynatrace.org/browse/UX-8258 )
* [[`a64775c`](https://github.com/Dynatrace/sketchmine/commit/a64775c)] -  **angular-meta-parser, sketch-generator**:  resolve icons and correct alignment  ([**lukas.holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8258 ](https://dev-jira.dynatrace.org/browse/UX-8258 )
* [[`d6cd213`](https://github.com/Dynatrace/sketchmine/commit/d6cd213)] -  **angular-library-generator**:  visit imports in default examples  ([**lukas.holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8251 ](https://dev-jira.dynatrace.org/browse/UX-8251 )
* [[`3c81def`](https://github.com/Dynatrace/sketchmine/commit/3c81def)] -  **sketch-generator**:  update element fetcher  ([**lukas.holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8251 ](https://dev-jira.dynatrace.org/browse/UX-8251 )
* [[`082cb29`](https://github.com/Dynatrace/sketchmine/commit/082cb29)] -  **angular-variant-generator**:  modify gerneration of module  ([**lukas.holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8251 ](https://dev-jira.dynatrace.org/browse/UX-8251 )
* [[`43b5373`](https://github.com/Dynatrace/sketchmine/commit/43b5373)] -  **angular-variant-generator**:  generate variants from meta.json  ([**lukas.holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8252 ](https://dev-jira.dynatrace.org/browse/UX-8252 )
* [[`9240bd7`](https://github.com/Dynatrace/sketchmine/commit/9240bd7)] -  **angular-variant-generator**:  generate variants in browser  ([**lukas.holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8251 ](https://dev-jira.dynatrace.org/browse/UX-8251 )
* [[`91dbb42`](https://github.com/Dynatrace/sketchmine/commit/91dbb42)] -  **sketch-generator**:  event messaging puppeteer chrome  ([**lukas.holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8252 ](https://dev-jira.dynatrace.org/browse/UX-8252 )
* [[`43c4aa1`](https://github.com/Dynatrace/sketchmine/commit/43c4aa1)] -  **angular-variant-generator**:  generate the application  ([**lukas.holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8251 ](https://dev-jira.dynatrace.org/browse/UX-8251 )
* [[`39a1501`](https://github.com/Dynatrace/sketchmine/commit/39a1501)] -  **angular-variant-generator**:  add app shell  ([**lukas.holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8251 ](https://dev-jira.dynatrace.org/browse/UX-8251 )
* [[`f0b4760`](https://github.com/Dynatrace/sketchmine/commit/f0b4760)] -  **angular-variant-generator**:  parse variants from filesystem  ([**lukas.holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8251 ](https://dev-jira.dynatrace.org/browse/UX-8251 )
* [[`8d93077`](https://github.com/Dynatrace/sketchmine/commit/8d93077)] -  **sketch-validator**:  select rules dependening on environment  ([**Katrin Freihofner**](mailto:katrin.freihofner@dynatrace.com))    *issues:*    [UX-8253 ](https://dev-jira.dynatrace.org/browse/UX-8253 )
* [[`aecb28d`](https://github.com/Dynatrace/sketchmine/commit/aecb28d)] -  **angular-variant-parser**:  try filesystem parser  ([**lukas.holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8251 ](https://dev-jira.dynatrace.org/browse/UX-8251 )
* [[`97875e0`](https://github.com/Dynatrace/sketchmine/commit/97875e0)] -  **angular-variant-generator**:  generate variants  ([**lukas.holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8251 ](https://dev-jira.dynatrace.org/browse/UX-8251 )
* [[`84bd88c`](https://github.com/Dynatrace/sketchmine/commit/84bd88c)] -  **angular-variant-generator**:  init  ([**lukas.holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8251 ](https://dev-jira.dynatrace.org/browse/UX-8251 )
* [[`5d1d033`](https://github.com/Dynatrace/sketchmine/commit/5d1d033)] -  **angular-variant-generator**:  init  ([**lukas.holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8251 ](https://dev-jira.dynatrace.org/browse/UX-8251 )
* [[`87ec85e`](https://github.com/Dynatrace/sketchmine/commit/87ec85e)] -  **dom-traverser**:  move traverser to own dependency to test it better  ([**lukas.holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8278 ](https://dev-jira.dynatrace.org/browse/UX-8278 )
* [[`0edd15a`](https://github.com/Dynatrace/sketchmine/commit/0edd15a)] -  **library**:  Version change  ([**lukas.holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8237 ](https://dev-jira.dynatrace.org/browse/UX-8237 )
* [[`b888f26`](https://github.com/Dynatrace/sketchmine/commit/b888f26)] -  **sketch-validator**:  get colors from from angular-components  ([**lukas.holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8237 ](https://dev-jira.dynatrace.org/browse/UX-8237 )
* [[`dcb368e`](https://github.com/Dynatrace/sketchmine/commit/dcb368e)] -  **angular-meta-parser**:  add README  ([**lukas.holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8220 ](https://dev-jira.dynatrace.org/browse/UX-8220 )
* [[`f63163b`](https://github.com/Dynatrace/sketchmine/commit/f63163b)] -  **angular-meta-parser**:  add values resolver  ([**lukas.holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8220 ](https://dev-jira.dynatrace.org/browse/UX-8220 )
* [[`0647f91`](https://github.com/Dynatrace/sketchmine/commit/0647f91)] -  **angular-meta-parser**:  add black/whitelisting, click and hoverable and prop values  ([**lukas.holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8220 ](https://dev-jira.dynatrace.org/browse/UX-8220 )
* [[`7b7f0f6`](https://github.com/Dynatrace/sketchmine/commit/7b7f0f6)] -  **angular-meta-parser**:  generate final json format  ([**lukas.holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8220 ](https://dev-jira.dynatrace.org/browse/UX-8220 )
* [[`2c4b376`](https://github.com/Dynatrace/sketchmine/commit/2c4b376)] -  **angular-meta-parser**:  write the content to the outFile  ([**lukas.holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8220 ](https://dev-jira.dynatrace.org/browse/UX-8220 )
* [[`0c46086`](https://github.com/Dynatrace/sketchmine/commit/0c46086)] -  **angular-meta-parser**:  generate basic JSON structure  ([**lukas.holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-8220 ](https://dev-jira.dynatrace.org/browse/UX-8220 )
* [[`a350cd7`](https://github.com/Dynatrace/sketchmine/commit/a350cd7)] -  **angular-meta-parser**:  current state  ([**lukas.holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-7996 ](https://dev-jira.dynatrace.org/browse/UX-7996 )
* [[`b2345ee`](https://github.com/Dynatrace/sketchmine/commit/b2345ee)] -  **angular-meta-parser**:  add transformer for implements  ([**lukas.holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-7996 ](https://dev-jira.dynatrace.org/browse/UX-7996 )
* [[`6f85fc7`](https://github.com/Dynatrace/sketchmine/commit/6f85fc7)] -  **angular-meta-parser**:  update visitor  ([**lukas.holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-7996 ](https://dev-jira.dynatrace.org/browse/UX-7996 )
* [[`35fd794`](https://github.com/Dynatrace/sketchmine/commit/35fd794)] -  **angular-meta-parser**:  working state of filesystem visitor  ([**lukas.holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-7996 ](https://dev-jira.dynatrace.org/browse/UX-7996 )
* [[`03994ad`](https://github.com/Dynatrace/sketchmine/commit/03994ad)] -  **angular-meta-parser**:  parsing the filesystem  ([**lukas.holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-7996 ](https://dev-jira.dynatrace.org/browse/UX-7996 )
* [[`f391475`](https://github.com/Dynatrace/sketchmine/commit/f391475)] -  **angular-meta-parser**:  get information for one file and store it in a storage class  ([**lukas.holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-7996 ](https://dev-jira.dynatrace.org/browse/UX-7996 )
* [[`c08f61f`](https://github.com/Dynatrace/sketchmine/commit/c08f61f)] -  **angular-meta-parser**:  parsing the ast 🤘🏻  ([**lukas.holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-7996 ](https://dev-jira.dynatrace.org/browse/UX-7996 )
* [[`a59b16a`](https://github.com/Dynatrace/sketchmine/commit/a59b16a)] -  **preview**:  add preview png  ([**lukas.holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-7975 ](https://dev-jira.dynatrace.org/browse/UX-7975 )
* [[`87af580`](https://github.com/Dynatrace/sketchmine/commit/87af580)] -  **jenkinsfile**:  keep last 10 builds  ([**lukas.holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-7975 ](https://dev-jira.dynatrace.org/browse/UX-7975 )
* [[`c534ac0`](https://github.com/Dynatrace/sketchmine/commit/c534ac0)] -  **tests**:  add tests for this project  ([**lukas.holzer**](mailto:lukas.holzer@dynatrace.com))    *issues:*    [UX-7975 ](https://dev-jira.dynatrace.org/browse/UX-7975 )

