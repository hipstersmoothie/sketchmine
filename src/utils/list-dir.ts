import { exec } from 'child_process';
import chalk from 'chalk';

export function ls(dir: string) {
  exec(`ls -lah ${dir}`, ((err, stdout, stderr) => {
    if (stderr) {
      console.log(chalk`{red Error:\n}`, stderr);
    }
    if (err) {
      console.log(chalk`{red Error:\n}`, err);
    }
    if (stdout) {
      console.log(stdout);
    }
  }));
}
