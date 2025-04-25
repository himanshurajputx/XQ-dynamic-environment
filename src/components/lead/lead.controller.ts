import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseInterceptors,
  Version,
} from "@nestjs/common";
import { LeadService } from "./lead.service";
import { LeadDto } from "./dto/lead.dto";
import { PaginationInterceptor } from "../../shared/interceptor/pagination.interceptor";
import { PaginationQuery } from "../../shared/pagination/pagination-query.dto";
import { IdDto } from "./dto/id.dto";

@Controller("lead")
export class LeadController {
  constructor(readonly leadService: LeadService) {}

  @Post("app-create")
  async create(@Body() body: LeadDto) {
    return await this.leadService.create(body);
  }
  @Post()
  @Version("1")
  async leadCreate(@Body() body: LeadDto, @Req() req: Request) {
    return await this.leadService.create(body, req["user"]);
  }

  @Get()
  @Version("1")
  @UseInterceptors(PaginationInterceptor)
  async getLeads(@Query() query: PaginationQuery, @Req() req: Request) {
    return await this.leadService.paginatedList(query, req["user"]);
  }

  @Get("/:_id/details")
  @Version("1")
  async getDetails(@Param() id: IdDto, @Req() req: Request) {
    return await this.leadService.getDetails(id, req["user"]);
  }

  @Patch("/:_id/update")
  @Version("1")
  async update(@Param() id: IdDto, @Req() req: Request, @Body() body: any) {
    return await this.leadService.update(id, body, req["user"]);
  }
}
