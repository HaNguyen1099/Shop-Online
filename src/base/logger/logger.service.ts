import { Injectable } from '@nestjs/common';
import * as log4js from 'log4js';

@Injectable()
export class LoggerService {
  private logger = log4js.getLogger();

  constructor() {
    log4js.configure({
      appenders: {
        out: { type: 'console' },
        file: { type: 'file', filename: 'logs/app.log' },
      },
      categories: { default: { appenders: ['out', 'file'], level: 'info' } },
    });
  }

  log(message: string, ...optionalParams: any[]) {
    this.logger.log(message + optionalParams);
  }

  error(message: string, ...optionalParams: any[]) {
    this.logger.error(message + optionalParams);
  }

  warn(message: string, ...optionalParams: any[]) {
    this.logger.warn(message + optionalParams);
  }

  debug(message: string, ...optionalParams: any[]) {
    this.logger.debug(message + optionalParams);
  }
}
