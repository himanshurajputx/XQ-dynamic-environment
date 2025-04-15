import { Injectable } from "@nestjs/common";
import * as winston from "winston";

@Injectable()
export class LogsService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: "info",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      transports: [
        new winston.transports.DailyRotateFile({
          dirname: "logs", // Directory to save logs
          filename: "application-%DATE%.log",
          datePattern: "YYYY-MM-DD",
          maxFiles: "14d", // Keep logs for 14 days
        }),
        new winston.transports.Console(),
      ],
    });
  }

  private getTimestamp(): string {
    return new Date().toISOString();
  }

  log(message: string) {
    this.logger.info(`[${this.getTimestamp()}] ${message}`);
  }

  error(message: string) {
    this.logger.error(`[${this.getTimestamp()}] ${message}`);
  }

  warn(message: string) {
    this.logger.warn(`[${this.getTimestamp()}] ${message}`);
  }
}
