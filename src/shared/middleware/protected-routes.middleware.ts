import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { CustomJwtService } from "../jwt/custom.jwt.service";
import { UserService } from "../../components/user/user.service";

@Injectable()
export class ProtectedRoutesMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: CustomJwtService,
    private readonly userService: UserService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const openRoutes = [
      "/authentication/login",
      "/authentication/register",
      "/user/mx",
        "api/app-settings"
    ];
    const isOpenRoute = openRoutes.includes(req.path);

    if (isOpenRoute) {
      return next(); // Allow access without auth
    }

    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException(
        "Authorization header missing or malformed",
      );
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.userService.userFind({ _id: decoded["_id"] });

      if (!user) {
        throw new UnauthorizedException("Invalid or expired token");
      }

      (req as any).user = user; // Attach user to request
      return next();
    } catch (err) {
      throw new UnauthorizedException("Invalid or expired token");
    }
  }
}
