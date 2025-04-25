import { IsNotEmpty, IsString } from "class-validator";

export class IdDto {
  @IsNotEmpty()
  @IsString()
  readonly _id: string;
}
