import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { RequestLog } from "../schema/request-log.schema";
import { uuidV2 } from "../helper/uuid.helper";
import * as winston from "winston";
import "winston-daily-rotate-file";

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private logger: winston.Logger;

  constructor(
    @InjectModel(RequestLog.name) private requestLogModel: Model<RequestLog>,
  ) {
    this.logger = winston.createLogger({
      level: "info",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.Console(),
        // @ts-ignore
        new winston.transports.DailyRotateFile({
          dirname: "logs",
          filename: "application-%DATE%.log",
          datePattern: "YYYY-MM-DD",
          zippedArchive: true,
          maxSize: "20m",
          maxFiles: "14d",
        }),
      ],
    });
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const requestId = req.headers["x-request-id"] || uuidV2();
    const isBodyEmpty = this.isBodyEmpty(req.body);
    req.headers["x-request-id"] = requestId;
    res.set("x-request-id", requestId);

    // Log the request details
    this.logger.info({
      request_id: requestId,
      method: req.method,
      url: req.originalUrl,
      body: isBodyEmpty ? "Empty body" : req.body,
      headers: req.headers,
      ip: req.ip,
    });

    await this.requestLogModel.create({
      request_id: requestId,
      method: req.method,
      url: req.originalUrl,
      body: isBodyEmpty ? "Empty body" : req.body,
      headers: req.headers,
      ip: req.ip,
    });
    next();
  }
  // Helper method to check if the body is empty
  private isBodyEmpty(body: any): boolean {
    if (body === undefined || body === null) return true;
    if (typeof body === "object" && Object.keys(body).length === 0) return true;
    if (Array.isArray(body) && body.length === 0) return true;
    return false;
  }
}
