// import { Injectable, NestMiddleware } from '@nestjs/common';
// import { Request, Response, NextFunction } from 'express';
// import { SessionService } from '../service/session/session.service';
//
// @Injectable()
// export class SessionMiddleware implements NestMiddleware {
//   constructor(private readonly sessionService: SessionService) {}
//
//   async use(req: Request, res: Response, next: NextFunction) {
//     const sessionId = req.sessionID || 'anonymous';
//     console.log("..../././",req);
//     const userId = 'iih78 wih8'; // Assuming user is stored in req.user
//
//     if (userId) {
//       await this.sessionService.saveSession(sessionId, userId, req.session);
//     }
//
//     next();
//   }
// }
