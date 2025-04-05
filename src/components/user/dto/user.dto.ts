import {
  IsNotEmpty,
  IsEmail,
  MinLength,
  Validate,
  IsString,
  MaxLength,
  Matches,
} from 'class-validator';
import { IsUserAlreadyExist } from '../../../shared/validators/is-user-already-exist.validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'Name must contain only alphabetic characters and spaces',
  })
  @MaxLength(50)
  @MinLength(2)
  readonly first_name: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'Last name must contain only alphabetic characters and spaces',
  })
  @MaxLength(50)
  @MinLength(2)
  readonly last_name: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9\s]+$/, {
    message: 'Phone number must contain only numeric characters and spaces',
  })
  @MaxLength(50)
  @MinLength(2)
  readonly phone_number: string;

  @IsString()
  readonly profile: string;

  @IsString()
  readonly gender: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(100)
  @MinLength(4)
  @Validate(IsUserAlreadyExist)
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(18)
  @MinLength(6)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password must contain at least 1 uppercase letter, 1 lowercase letter, and either 1 number or special character',
  })
  readonly password: string;
}
