# Contribute to the Sketch generation ecosystem

* [Coding rules](#coding-rules)
* [Branch name format](#branch-name-format)
* [Commit message guidelines](#commit-message-guideline)

## Coding rules

To ensure consistency through our sourcecode we have some rules that you should kept in mind:

* All features or bug fixes have to be tested (jest unit tests)
* Keep your functions documentated with JSDoc comments
* Lint your code with the ts-lint `yarn lint`

## Branch name format

The branch name has to include a JIRA ticket and a prefix. Furthermore the lenght of a branch name can only be up to 50 characters.
please use the following pattern: `${prefix}/${name}-${JIRA-ticket-number}`

The Branch name can only consist out of uppercase letters, lowercase letters, numbers and dashes.

### available branch prefixes

* fix
* feat
* hotfix
* release

and have to match the following regular expression

```typescript
const regex = /develop|master|(?:(?:fix|feat|hotfix|release)\/[A-Za-z0-9\-]+?-[A-Z]{2,4}-[0-9]{4,5})$/gm;
```

## Commit message guideline

This project follows a precice rule of git commit message. This leads to more readable messages and enables a change log generation later.

### Commit message format

The commit message format follows a strict pattern:

`${JIRA-ticket-number} ${type}(${scope}): ${subject}`

for example: `UX-8220 feat(angular-meta-parser): Added new feature`

it is going to be validated with this regular expression:

```typescript
const regex = /[A-Z]{2,4}-[0-9]{4,5}\s(?:build|ci|docs|feat|fix|perf|refactor|style|test)\(.+?\):\s.+/gm;
```

#### Available scopes for commit messages

* library *(if it affects every component)*
* angular-meta-parser
* angular-library-generator
* dom-traverser
* sketch-color-replacer
* sketch-generator
* sketch-validator

#### Available types for commit messages

* **build**: Changes that affect the build system or external dependencies (rollup, yarn)
* **ci**: Changes to our CI configuration files and scripts (webkins, jenkins)
* **docs**: Documentation only changes
* **feat**: A new feature
* **fix**: A bug fix
* **perf**: A code change that improves performance
* **refactor**: A code change that neither fixes a bug nor adds a feature
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
* **test**: Adding missing tests or correcting existing tests
