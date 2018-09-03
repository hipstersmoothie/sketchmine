# Contribute to the Sketch generation ecosystem

* [Coding rules](#coding-rules)
* [Commit message guidelines](#commit-message-guideline)

## Coding rules

To ensure consistency through our sourcecode we have some rules that you should kept in mind:

* All features or bug fixes have to be tested (jest unit tests)
* Keep your functions documentated with JSDoc comments
* Lint your code with the ts-lint `npm run lint`

## Commit message guideline

This project follows a precice rule of git commit message. This leads to more readable messages and enables a change log generation later.

### Commit message format

The commit message format follows a strict pattern:

`${JIRA-ticket-number} ${type}(${scope}): ${subject}`

for example: `UX-8220 feat(angular-meta-parser): Added new feature`

#### Available scopes

* library *(if it affects every component)*
* angular-meta-parser
* sketch-color-replacer
* sketch-generator
* sketch-validator
* dom-traverser

#### Available types

* **build**: Changes that affect the build system or external dependencies (rollup, npm)
* **ci**: Changes to our CI configuration files and scripts (webkins, jenkins)
* **docs**: Documentation only changes
* **feat**: A new feature
* **fix**: A bug fix
* **perf**: A code change that improves performance
* **refactor**: A code change that neither fixes a bug nor adds a feature
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
* **test**: Adding missing tests or correcting existing tests
