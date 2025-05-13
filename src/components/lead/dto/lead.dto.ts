import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from "class-validator";
import { regex } from "../../../shared";

export class LeadDto {
  @IsString()
  @IsNotEmpty()
  @Matches(regex.ONLY_ALLOWED_CHARACTERS_REGEX, {
    message: "Only allows certain characters including space",
  })
  @MinLength(4, { message: "Name must be at least 4 characters long" })
  full_name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(regex.ONLY_NUMBERS_REGEX, {
    message: "Allows only numbers",
  })
  phone_number: string;

  @IsString()
  @IsNotEmpty()
  source: string;

  @IsString()
  @IsNotEmpty()
  country_code: string;

  @IsString()
  @IsOptional()
  campaign: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(["new", "contacted", "qualified", "lost", "converted"])
  status: string;

  @IsString()
  @IsOptional()
  notes: string;

  @IsString()
  @IsOptional()
  tags: any;

  @IsString()
  @IsNotEmpty()
  loan_product: string;

  @IsString()
  @IsNotEmpty()
  pan: string;

  @IsString()
  @IsNotEmpty()
  dob: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum([
    "salaried",
    "self-employed",
    "others",
    "retired",
    "student",
    "business",
  ])
  employment_type: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  pin_code: string;

  @IsString()
  @IsNotEmpty()
  loan_amount: string;

  @IsString()
  @IsNotEmpty()
  monthly_income: string;

  @IsString()
  @IsNotEmpty()
  cibil_score: string;

  @IsString()
  @IsNotEmpty()
  preferred_lending_partner: string;
}
