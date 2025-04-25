// import { Transform } from "class-transformer";
// import { IsOptional, IsPositive, Max } from "class-validator";
//
// export class PaginationQuery {
//   @IsOptional()
//   @Transform(({ value }) => Number.parseInt(value as string))
//   @IsPositive()
//   @Max(100)
//   readonly limit = 10;
//
//   @IsOptional()
//   @Transform(({ value }) => Number.parseInt(value as string))
//   @IsPositive()
//   readonly page = 1;
//
//   get offset() {
//     return (this.page - 1) * this.limit;
//   }
// }

import { Transform } from "class-transformer";
import { IsOptional, IsNumber, IsString } from "class-validator";

export class PaginationQuery {
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  limit = 10;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  page = 1;

  @IsOptional()
  @IsString()
  sort?: string; // e.g. "createdAt,-name"

  @IsOptional()
  @IsString()
  search?: string;
}
