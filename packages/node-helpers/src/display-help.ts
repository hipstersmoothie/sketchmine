import chalk from 'chalk';

export interface CliCommand {
  flags?: string[];
  text: string;
  divider?: boolean;
}

/**
 * creates a line with the provided length
 * @param length length of line in chars
 * @param char char of line default "-"
 */
function line(length: number, char = '-'): string {
  let line = '';
  for (let i = 0; i < length; i += 1) {
    line += char;
  }
  return line;
}

/**
 * Logs a CLI help page to the console.
 * @param helpText The help text that should be displayed.
 * @param cliCommands The available commands that should be displayed
 */
export function displayHelp(helpText: string, cliCommands: CliCommand[]) {
  const padding = '  ';
  const spacer = '|';
  const lines = [];

  cliCommands.forEach((cmd) => {
    if (cmd.divider) {
      lines.push(`\n${line(110)}\n`);
      lines.push(`${padding}${cmd.text}\n`);
    } else {
      const flags = cmd.flags.map(flag => flag.length < 2 ? `-${flag}` : `--${flag}`);
      const cmdFlags = flags.join(', ');
      lines.push(`${padding}${cmdFlags}\t\t${spacer} ${cmd.text}`);
    }
  });

  console.log(chalk`

${line(110)}


  ███████╗██╗  ██╗███████╗████████╗ ██████╗██╗  ██╗███╗   ███╗██╗███╗   ██╗███████╗
  ██╔════╝██║ ██╔╝██╔════╝╚══██╔══╝██╔════╝██║  ██║████╗ ████║██║████╗  ██║██╔════╝
  ███████╗█████╔╝ █████╗     ██║   ██║     ███████║██╔████╔██║██║██╔██╗ ██║█████╗
  ╚════██║██╔═██╗ ██╔══╝     ██║   ██║     ██╔══██║██║╚██╔╝██║██║██║╚██╗██║██╔══╝
  ███████║██║  ██╗███████╗   ██║   ╚██████╗██║  ██║██║ ╚═╝ ██║██║██║ ╚████║███████╗
  ╚══════╝╚═╝  ╚═╝╚══════╝   ╚═╝    ╚═════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚══════╝

  👷🏼‍ ⛏ 💎 👷🏼‍ ⛏ 💎 👷🏼‍ ⛏ 💎 👷🏼‍ ⛏ 💎 👷🏼‍ ⛏ 💎 👷🏼‍ ⛏ 💎 👷🏼‍ ⛏ 💎 👷🏼‍ ⛏ 💎 👷🏼‍ ⛏ 💎 👷🏼‍ ⛏ 💎 👷🏼

  ${helpText.replace(/\n/gm, `\n${padding}`)}

  If you find a bug, please file it in the github repository: {grey https://github.com/Dynatrace/sketchmine/issues}

  {bold Available commands to execute: }
${line(110)}

${lines.join('\n')}

${line(110)}
`);

  process.exit(0);
}
