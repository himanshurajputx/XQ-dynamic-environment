import { Module } from "@nestjs/common";
import { LeadService } from "./lead.service";
import { LeadController } from "./lead.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { TABLE_ } from "../../shared";
import { LeadSchema } from "./schema/lead.schema";

@Module({
  imports: [
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    MongooseModule.forFeature([{ name: TABLE_.LEAD, schema: LeadSchema }]),
  ],
  controllers: [LeadController],
  providers: [LeadService],
})
export class LeadModule {}
