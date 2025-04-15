import {
  IsEmail, IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  Validate,
} from "class-validator";
import { IsUserAlreadyExist } from "../../../shared";
export enum Type {
  USER = "user",
  PARTNER = "partner",
  MASTER = "master",
}
export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z\- ]+$/, {
    message: "First name only allow characters",
  })
  first_name: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z\- ]+$/, {
    message: "Last name only allow characters",
  })
  last_name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: "Password must be at least 6 characters long" })
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(100)
  @MinLength(4)
  @Validate(IsUserAlreadyExist)
  readonly email: string;

  @IsString()
  @IsEnum(Type)
  @IsNotEmpty()
  readonly userType: Type;

  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  @MinLength(10)
  @Matches(/^\d+$/, {
    message: "Only allow number",
  })
  phone_number: string;
}
