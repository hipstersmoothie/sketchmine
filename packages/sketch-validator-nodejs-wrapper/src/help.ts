import chalk from 'chalk';

export function displayHelp() {
  console.log(chalk`

{blue ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––}

  ███████╗██╗  ██╗███████╗████████╗ ██████╗██╗  ██╗    ██╗     ██╗██████╗ ██████╗  █████╗ ██████╗ ██╗   ██╗
  ██╔════╝██║ ██╔╝██╔════╝╚══██╔══╝██╔════╝██║  ██║    ██║     ██║██╔══██╗██╔══██╗██╔══██╗██╔══██╗╚██╗ ██╔╝
  ███████╗█████╔╝ █████╗     ██║   ██║     ███████║    ██║     ██║██████╔╝██████╔╝███████║██████╔╝ ╚████╔╝
  ╚════██║██╔═██╗ ██╔══╝     ██║   ██║     ██╔══██║    ██║     ██║██╔══██╗██╔══██╗██╔══██║██╔══██╗  ╚██╔╝
  ███████║██║  ██╗███████╗   ██║   ╚██████╗██║  ██║    ███████╗██║██████╔╝██║  ██║██║  ██║██║  ██║   ██║
  ╚══════╝╚═╝  ╚═╝╚══════╝   ╚═╝    ╚═════╝╚═╝  ╚═╝    ╚══════╝╚═╝╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝


The Dynatrace sketch-validator is a linting tool for our design system.
It ensures better design quality and maintainability over all teams.

This linter is part of the {blue Sketch Library} and maintained by the Web-Experience Team.
The linter can be configured with a {bold {grey sketchlint.json}} file that defines which rules
are enabled and warn or break the linting process.

For urgent questions contact: {grey lukas.holzer@dynatrace.com}

{bgBlue {bold  Available commands to execute the angular Meta parser }}

{cyan ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––}
  -h, --help              | displays the help page
  -c, --config            | path to the configuration file {grey (sketchlint.json)}
  -e, --environment       | the context for the rules {grey (product or global)}
  --file                  | the .sketch file that should be validated
{cyan ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––}
`);
}
