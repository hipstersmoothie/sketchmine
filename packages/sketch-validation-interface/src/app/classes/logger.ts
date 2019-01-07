import { ErrorLogger } from '@sketchmine/sketch-validator';

export class Logger implements ErrorLogger {
  error(message: string) { console.error(`[ERROR]: ${message}`); }
  debug(message: string) { console.log(`[DEBUG]: ${message}`); }
  info(message: string) { console.log(`[INFO]: ${message}`); }
  notice(message: string) { console.log(`[NOTICE]: ${message}`); }
  warning(message: string) { console.warn(`[WARNING]: ${message}`); }
}
