import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const startTime = Date.now();
    console.log(
      `[Request] ${req.method} ${req.originalUrl} - Start Time: ${startTime}`,
    );

    res.on("finish", () => {
      const endTime = Date.now();
      console.log(
        `[Response] ${req.method} ${req.originalUrl} - End Time: ${endTime}`,
      );
      console.log(`[Duration] ${endTime - startTime}ms`);
    });

    next();
  }
}
