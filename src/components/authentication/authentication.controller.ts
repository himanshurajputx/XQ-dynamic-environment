import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { LocalAuthGuard, LOGIN_SUCCESS } from '../../shared';
import { AuthenticationService } from './authentication.service';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { RegisterDto } from './dto/register.dto';

@Controller('authentication')
export class AuthenticationController {
  constructor(readonly auth: AuthenticationService) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    return await this.auth.register(body);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Req() req: LoginDto, @Res() response: Response) {
    const token = await this.auth.login(req['credentials']);
    response.setHeader('Authorization', `Bearer ${token}`);
    response.cookie(token, {
      httpOnly: true,
      signed: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

    return response.status(200).json({
      message: LOGIN_SUCCESS,
    });
  }
}
