import { exec, ExecOptions } from 'child_process';

/**
 * Spawns a shell then executes the command within that shell
 * @param command
 */
export async function executeCommand(command: string, cwd?: string): Promise<string> {
  const maxBuffer = 1024 * 1024 * 10;

  const options: ExecOptions = {
    cwd: cwd || process.cwd(),
    maxBuffer,
  };

  return new Promise((resolve, reject) => {
    exec(
      command,
      options,
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
