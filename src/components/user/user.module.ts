import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { TABLE_ } from "../../shared";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersSchema } from "./schema/user.schema";
import { IsUserAlreadyExist } from "../../shared/validators/is-user-already-exist.validator";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TABLE_.USERS, schema: UsersSchema }]),
  ],
  providers: [UserService, IsUserAlreadyExist],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
