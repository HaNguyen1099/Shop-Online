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

  log(message: string) {
    this.logger.log(message);
  }

  error(message: string) {
    this.logger.error(message);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }
}
