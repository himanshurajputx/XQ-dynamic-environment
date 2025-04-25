import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseInterceptors,
  Version,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/user.dto";
import {
  User,
  UserResponseInterface,
  UsersInterface,
} from "./interfaces/user.interface";
import { HydratedDocument, QueryWithHelpers } from "mongoose";
import { IdDto } from "./dto/id.dto";
import { Type } from "./dto/enum";
import { PaginationInterceptor } from "../../shared/";
import { PaginationQuery } from "../../shared/pagination/pagination-query.dto";

@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}

  @Post("")
  @Version("1")
  async createAUser(
    @Req() req: Request,
    @Body() body: CreateUserDto,
  ): Promise<UserResponseInterface> {
    if (body["user_type"] == Type.MASTER)
      throw new BadRequestException("Master is not allowed to add user");

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
    const user_id = req["user"]._id;
    // @ts-ignore
    const user: UserResponseInterface = await this.userService.addUser(
      body,
      user_id,
    );
    return {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      user_id: user["_id"],
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      requestId: req.headers["x-request-id"],
    };
  }

  @Post("/mx")
  @Version("xxs-ee1-000038-PPPPPX-popo")
  async createAMasterUser(
    @Req() req: Request,
    @Body() body: CreateUserDto,
  ): Promise<void> {
    await this.userService.addMasterUser(body);
    // @ts-ignore
    return {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      requestId: req.headers["x-request-id"],
    };
  }

  @Get()
  @Version("1")
  @UseInterceptors(PaginationInterceptor)
  get(@Query() query: PaginationQuery, @Req() req: Request): Promise<[any[], number]> {
    return this.userService.getUser(query, req["user"]);
  }

  @Get("/details/:id")
  @Version("1")
  getUserDetails(
    @Param("id") id: IdDto,
  ): QueryWithHelpers<
    Array<HydratedDocument<UsersInterface, {}, {}>>,
    HydratedDocument<UsersInterface, object, object>,
    object,
    UsersInterface,
    "find",
    object
  > {
    return this.userService.userDetails(id);
  }

  @Post("master")
  @Version("USER-X901-U001-YY98-Q164-147895")
  async createMasterUser(
    @Req() req: Request,
    @Body() body: CreateUserDto,
  ): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const user = await this.userService.userCreate(body);
    // @ts-ignore
    return {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      user_id: user["_id"],
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      requestId: req.headers["x-request-id"],
    };
  }
}
