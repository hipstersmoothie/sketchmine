import chalk from 'chalk';

export function displayHelp() {
  console.log(chalk`

The code-analyzer is a compiler, that generates an abstract syntax tree short AST from the
Angular Components library and transforms the AST to a JSON format that represents all components,
that are related for the components library in sketch with all possible variants

{bgBlue {bold  Available commands to execute the angular Meta parser }}

{cyan ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––}
  -c, --config            | path to the configuration file
  --rootDir               | root dir of the angular components library
  --library               | path to lib folder where the components are located from root
  --inFile                | index.ts file as entry point for the lib
  --outFile               | the file that holds the meta-information – as .json
{cyan ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––}
`);
}
