import { ConsoleLogger } from '@nestjs/common';

/**
 * LogLevels
 */
export interface LogLevel {
  VERBOSE: 0;
  DEBUG: 1;
  LOG: 2;
  WARN: 3;
  ERROR: 4;
  SILENT: 5;
}

/**
 * Possible log level numbers.
 */
export type LogLevelNumbers = LogLevel[keyof LogLevel];

/**
 * Possible log level descriptors, may be string, lower or upper case, or number.
 */
export type LogLevelDesc =
  | LogLevelNumbers
  | 'verbose'
  | 'debug'
  | 'log'
  | 'warn'
  | 'error'
  | 'silent'
  | keyof LogLevel;

/**
 * Logging Service
 */
export class AppLoggingService extends ConsoleLogger {
  log(message: any, ...optionalParams: any[]) {
    if (this.shouldIngoreMessage('log')) return;
    super.log.apply(this, [message, ...optionalParams]);
  }

  error(message: any, ...optionalParams: any[]) {
    if (this.shouldIngoreMessage('error')) return;
    super.error.apply(this, [message, ...optionalParams]);
  }

  warn(message: any, ...optionalParams: any[]) {
    if (this.shouldIngoreMessage('warn')) return;
    super.warn.apply(this, [message, ...optionalParams]);
  }

  debug(message: any, ...optionalParams: any[]) {
    if (this.shouldIngoreMessage('debug')) return;
    super.debug.apply(this, [message, ...optionalParams]);
  }

  verbose(message: any, ...optionalParams: any[]) {
    if (this.shouldIngoreMessage('verbose')) return;
    super.verbose.apply(this, [message, ...optionalParams]);
  }

  private shouldIngoreMessage(logLevel: LogLevelDesc): boolean {
    const logLevels = ['verbose', 'debug', 'log', 'warn', 'error', 'silent'];
    const limit = logLevels.indexOf(process.env.LOG_LEVEL || 'verbose');
    const level = logLevels.indexOf(logLevel.toString());
    return level < limit;
  }
}
