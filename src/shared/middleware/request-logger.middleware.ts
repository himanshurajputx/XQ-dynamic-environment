import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RequestLog } from '../schema/request-log.schema';
import { uuid } from '../helper/uuid.helper';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(
    @InjectModel(RequestLog.name) private requestLogModel: Model<RequestLog>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const requestId = req.headers['x-request-id'] || uuid();
    const isBodyEmpty = this.isBodyEmpty(req.body);
    req.headers['x-request-id'] = requestId;
    res.set('x-request-id', requestId);
    await this.requestLogModel.create({
      request_id: requestId,
      method: req.method,
      url: req.originalUrl,
      body: isBodyEmpty ? 'Empty body' : req.body,
      headers: req.headers,
      ip: req.ip,
    });
    next();
  }
  // Helper method to check if the body is empty
  private isBodyEmpty(body: any): boolean {
    if (body === undefined || body === null) return true;
    if (typeof body === 'object' && Object.keys(body).length === 0) return true;
    if (Array.isArray(body) && body.length === 0) return true;
    return false;
  }
}
