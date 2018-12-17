![Github banner for sketchmine](https://dt-cdn.net/images/github-banner-2x-1777-2b23e499af.png)

# How to Contribute

- [How to Contribute](#how-to-contribute)
  - [Coding rules](#coding-rules)
  - [Branch name format](#branch-name-format)
    - [available branch prefixes](#available-branch-prefixes)
  - [Commit message guideline](#commit-message-guideline)
    - [Commit message format](#commit-message-format)
      - [Issue referencing](#issue-referencing)
      - [Available scopes for commit messages](#available-scopes-for-commit-messages)
      - [Available types for commit messages](#available-types-for-commit-messages)

## Coding rules

To ensure consistency through our source code we have some rules that you should keep in mind:

* All features or bug fixes have to be tested (jest unit tests)
* Keep your functions documented with JSDoc comments
* Lint your code with the ts-lint `yarn lint`

## Branch name format

The branch name can only consist out of uppercase letters, lowercase letters, numbers and dashes and has
to contain a specific prefix about the purpose. The prefixes are listed below.
Furthermore the length of a branch name can only be up to 50 characters.
please use the following pattern: `<prefix>/<descriptive-name>`

### available branch prefixes

* fix
* feat
* hotfix
* release

## Commit message guideline

This project follows the Angular commit style guide. This leads to more readable messages and enables us to generate a CHANGELOG out of the messages.

### Commit message format

The commit message format follows a strict pattern:

`<issue> <type>(<scope>): <subject>`

The `<issue>` is only used by members of the @Dynatrace company, to reference internal issues.

**Feature:**

`feat(sketch-builder): Added new feature ...`

**Fix:**

`fix(sketch-builder): fixed the ...`

if the commit affects the whole repository like a general update of the README.md in the root, the scope can be skipped.

`docs: update Readme...`

#### Issue referencing

If you work on a [Github Issue](https://github.com/Dynatrace/sketchmine/issues) you should reference the issue in your commit message via the `#<issue number>`.
To provide our changelog generation with the necessary information about the commit.

#### Available scopes for commit messages

The scopes are the packages of the Monorepo, every folder inside the [packages](./packages/) folder is a scope.
Try to separate commits by scopes if possible. If this is not possible scopes can be comma separated.

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
* **chore**: Other changes that don't modify src or test files
