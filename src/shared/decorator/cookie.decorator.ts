import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const Cookie = createParamDecorator(
  (cookieName: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.signedCookies?.[cookieName];
  },
);


// @Get('me')
// getMe(@Cookie('token') token: string) {
//     return { token };
// }
