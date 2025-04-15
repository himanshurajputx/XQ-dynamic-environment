import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { TABLE_ } from "../../shared";
import { HydratedDocument, Model, QueryWithHelpers } from "mongoose";
import {
  User,
  UserDetailsResponseInterface,
  UsersInterface,
} from "./interfaces/user.interface";
import { CreateUserDto } from "./dto/user.dto";
import { IdDto } from "./dto/id.dto";
import { Type } from "./dto/enum";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(TABLE_.USERS)
    private readonly userModel: Model<UsersInterface>,
  ) {}
  async userFind(query?: object, projection?: object): Promise<CreateUserDto> {
    // eslint-disable-next-line no-useless-catch
    try {
      // @ts-ignore
      return await this.userModel.findOne(query, projection);
    } catch (e) {
      throw e;
    }
  }
  async userCreate(body?: CreateUserDto): Promise<any> {
    return this.userModel.create({ ...body, created_by: null });
  }

  async addUser(body?: CreateUserDto, user_id?: string) {
    return this.userModel.create({ ...body, created_by: user_id });
  }

  async addMasterUser(body?: CreateUserDto, user_id?: string) {
    const isMasterExists = await this.userModel.exists({
      user_type: "master",
    });

    if (!isMasterExists) {
      try {
        return this.userModel.create({ ...body, created_by: user_id });
      } catch (e) {
        throw new BadRequestException(e);
      }
    }

    if (body?.user_type === Type.MASTER) {
      throw new BadRequestException("Master user already exists");
    }
  }

  getUser(): Promise<User[]> {
    try {
      return this.userModel.find(
        {},
        {
          password: 0,
          salt: 0,
          parent_id: 0,
          delete_at: 0,
          __v: 0,
        },
      );
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  userDetails(
    id: IdDto,
  ): QueryWithHelpers<
    Array<HydratedDocument<UsersInterface, {}, {}>>,
    HydratedDocument<UsersInterface, object, object>,
    object,
    UsersInterface,
    "find",
    object
  > {
    try {
      return this.userModel.find(
        { _id: id },
        {
          password: 0,
          salt: 0,
          parent_id: 0,
          delete_at: 0,
          __v: 0,
        },
      );
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
