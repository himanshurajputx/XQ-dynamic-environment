import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CustomJwtService } from '../jwt/custom.jwt.service';

@Injectable()
export class ProtectedRoutesMiddleware implements NestMiddleware {
  constructor(readonly jwtService: CustomJwtService) {}
  use(req: Request, res: Response, next: NextFunction) {
    const openRoutes = ['/authentication/login', '/authentication/register'];
    const isOpenRoute = openRoutes.includes(req.path);

    if (isOpenRoute) {
      return next(); // Skip auth check for open routes
    }

    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Authorization header missing or malformed',
      );
    }

    const token = authHeader.split(' ')[1];

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const decoded = this.jwtService.verify(token);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
      (req as any).user = decoded;
      next();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
