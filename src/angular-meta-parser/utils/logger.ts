import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import { createDir } from '@utils';

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

  private static EMOJI_SPACE = '  ';
  private static _instance: Logger;
  private _logStream: fs.WriteStream;

  constructor() {
    if (Logger._instance) { return Logger._instance; }
    Logger._instance = this;
  }

  writeLogStream(file: string): void {
    if (this._logStream) {
      return;
    }
    const dir = path.dirname(file);
    if (!fs.existsSync(dir) || !fs.lstatSync(dir).isDirectory()) {
      createDir(dir);
    }
    this._logStream = fs.createWriteStream(file, { flags: 'a' });
  }

  error(message: string): void { this.message(chalk.redBright(message), 1); }
  warning(message: string): void { this.message(chalk.yellow(message), 2); }
  notice(message: string): void { this.message(chalk.cyan(message), 3); }
  info(message: string): void { this.message(message, 4); }
  debug(message: string): void { this.message(chalk.grey(message), 5); }

  private message(message: string, level: number): void {
    const msg = `${this.getEmoji(level)}${message}`;
    console.log(msg);
    if (this._logStream) {
      this._logStream.write(JSON.stringify(this.logEntry(msg, level)));
    }
  }

  private getEmoji(level: number): string {
    switch (level) {
      case 1: return `🚨${Logger.EMOJI_SPACE}`;
      case 2: return `⚠️${Logger.EMOJI_SPACE}`;
      case 3: return `NOTICE${Logger.EMOJI_SPACE}`;
      case 4: return `ℹ️${Logger.EMOJI_SPACE}`;
      case 5: return `🚧${Logger.EMOJI_SPACE}`;
    }
  }

  private getLevelString(level: number): LogTypes {
    switch (level) {
      case 1: return 'ERROR';
      case 2: return 'WARNING';
      case 3: return 'NOTICE';
      case 4: return 'INFO';
      case 5: return 'DEBUG';
    }
  }

  private logEntry(message: string, level: number): LogEntry {
    return {
      date: new Date().toDateString(),
      level,
      levelString: this.getLevelString(level),
      message,
    };
  }
}
