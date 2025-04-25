import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { LocalAuthGuard, LOGIN_SUCCESS } from "../../shared";
import { AuthenticationService } from "./authentication.service";
import { LoginDto } from "./dto/login.dto";
import { Response } from "express";
import { RegisterDto } from "./dto/register.dto";

@Controller("authentication")
export class AuthenticationController {
  constructor(readonly auth: AuthenticationService) {}

  @Post("register")
  async register(@Body() body: RegisterDto) {
    if (body["user_type"] == "master")
      throw new BadRequestException("Master is not allowed to register");

    const user = await this.auth.register(body);

    return {
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      user_id: user._id,
    };
  }

  @Post("login")
  @UseGuards(LocalAuthGuard)
  async login(@Req() req: LoginDto, @Res() response: Response) {
    const token = await this.auth.login(req["credentials"]);
    response.setHeader("Authorization", `Bearer ${token}`);
    response.cookie("token", token, {
      httpOnly: true,
      signed: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return response.status(200).json({
      message: LOGIN_SUCCESS,
    });
  }
}
