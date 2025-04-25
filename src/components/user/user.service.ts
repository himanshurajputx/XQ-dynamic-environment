import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { TABLE_ } from "../../shared";
import { HydratedDocument, Model, QueryWithHelpers } from "mongoose";
import { UsersInterface } from "./interfaces/user.interface";
import { CreateUserDto } from "./dto/user.dto";
import { IdDto } from "./dto/id.dto";
import { Type } from "./dto/enum";
import { PaginationQuery } from "../../shared/pagination/pagination-query.dto";

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

  async getUser(
    query?: PaginationQuery,
    user?: object,
  ): Promise<[any[], number]> {
    try {
      const { limit = 10, page = 1, sort, search, ...filters } = query ?? {};
      const skip = (page - 1) * limit;
      const mongoFilter: Record<string, any> = {
        ...filters,
        _id: { $ne: user?.["_id"] },
      };

      // Apply search (basic OR across fields)
      if (search) {
        mongoFilter["$or"] = [
          {
            $expr: {
              $regexMatch: {
                input: { $concat: ["$first_name", " ", "$last_name"] },
                regex: search,
                options: "i",
              },
            },
          },
          { email: { $regex: search, $options: "i" } },
          { phone_number: { $regex: search, $options: "i" } },
          { user_type: { $regex: search, $options: "i" } },
          {
            status:
              search === "true" ? true : search === "false" ? false : undefined,
          },
        ];
      }

      // Apply sorting
      let sortObj: Record<string, 1 | -1> = {};
      if (sort) {
        sort.split(",").forEach((field) => {
          if (!field) return;
          const direction = field.startsWith("-") ? -1 : 1;
          const key = field.replace(/^-/, "");
          sortObj[key] = direction;
        });
      } else {
        sortObj = { createdAt: -1 }; // default sort
      }

      const [items, total] = await Promise.all([
        this.userModel
          .find(mongoFilter, {
            password: 0,
            salt: 0,
            parent_id: 0,
            delete_at: 0,
            __v: 0,
          })
          .skip(skip)
          .limit(limit)
          .sort(sortObj),
        this.userModel.countDocuments(mongoFilter),
      ]);

      return [items, total];
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
