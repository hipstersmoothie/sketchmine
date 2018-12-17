import chalk from 'chalk';

export type LogTypes = 'ERROR' | 'WARNING' | 'NOTICE' | 'INFO' | 'DEBUG';

export interface LogEntry {
  date: string;
  level: number;
  levelString: LogTypes;
  message: string;
}

/**
 * ### Logging Types:
 * | level | type | explanation |
 * |:-- |:--|:-- |
 * | 1 | ERROR | error condition |
 * | 2 | WARNING | warning condition |
 * | 3 | NOTICE | a normal but significant condition |
 * | 4 | INFO | a purely informational message |
 * | 5 | DEBUG | messages to debug an application |
 */
export class Logger {

  private static EMOJI_SPACE = '\t';
  private static _instance: Logger;
  private _debugEnvs: string[];

  constructor() {
    if (Logger._instance) { return Logger._instance; }
    Logger._instance = this;

    if (process.env.DEBUG) {
      this._debugEnvs = process.env.DEBUG.split(',');
      const envs = this._debugEnvs.map(env => `*     - ${env}`);
      console.log(chalk`
{yellow * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *}
          _      _
         | |    | |
       __| | ___| |__  _   _  __ _    ___  _ __
      / _\` |/ _ \\ '_ \\| | | |/ _\` |  / _ \\| '_ \\
     | (_| |  __/ |_) | |_| | (_| | | (_) | | | |
      \\__,_|\\___|_.__/ \\__,_|\\__, |  \\___/|_| |_|
                              __/ |
                             |___/
{yellow * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*  🚧 DEBUG mode active for the following environments:
${envs.join('\n')}
*
* ☛ Currently working in directory:
* ${process.cwd()}
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *}
      `);
    }
  }

  logTime(): string {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ` +
    `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
  }

  error(message: string): void { this.message(chalk.redBright(message), 1); }
  warning(message: string): void { this.message(chalk.yellow(message), 2); }
  notice(message: string, emoji?: string): void { this.message(chalk.cyan(message), 3, emoji); }
  info(message: string): void { this.message(message, 4); }
  debug(message: string, debugSpace?: string, emoji?: string): void {
    if (
      !process.env.DEBUG || debugSpace &&
      !this._debugEnvs.includes(debugSpace)
    ) {
      return;
    }
    this.message(chalk.white(message.trim()), 5, emoji);
  }

  public checkDebug(debugSpace: string): boolean {
    return this._debugEnvs && this._debugEnvs.includes(debugSpace);
  }

  private message(message: string, level: number, emoji?: string): void {
    /** replace linebreaks for perfect indentation */
    const e = emoji ? `${emoji}${Logger.EMOJI_SPACE}` : this.getEmoji(level);
    const msg = `${e}${message.replace('\n', `\n  ${Logger.EMOJI_SPACE}`)}`;
    console.log(msg);
  }

  private getEmoji(level: number): string {
    switch (level) {
      case 1: return `🚨${Logger.EMOJI_SPACE}`;
      case 2: return `⚠️${Logger.EMOJI_SPACE}`;
      case 3: return `${Logger.EMOJI_SPACE}`;
      case 4: return `ℹ️${Logger.EMOJI_SPACE}`;
      case 5: return `${Logger.EMOJI_SPACE}`;
      default: return '';
    }
  }

  private getLevelString(level: number): LogTypes {
    switch (level) {
      case 1: return 'ERROR';
      case 2: return 'WARNING';
      case 3: return 'NOTICE';
      case 4: return 'INFO';
      default: return 'DEBUG';
    }
  }

  private logEntry(message: string, level: number): LogEntry {
    return {
      date: this.logTime(),
      level,
      levelString: this.getLevelString(level),
      message,
    };
  }
}
