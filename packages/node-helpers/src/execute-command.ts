import { exec } from 'child_process';

/**
 * Spawns a shell then executes the command within that shell
 * @param command
 */
export async function executeCommand(command: string): Promise<string> {
  const maxBuffer = 1024 * 1024 * 10;
  return new Promise((resolve, reject) => {
    exec(
      command,
      { maxBuffer },
      (err, stdout, stderr) => {
        if (err !== null) {
          reject(err);
        } else if (typeof(stderr) !== 'string') {
          reject(stderr);
        } else {
          resolve(stdout);
        }
      });
  });
}
