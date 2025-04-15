import { Module } from "@nestjs/common";

import { MailService } from "./mail.service";
import { ConfigModule } from "../config";

@Module({
  imports: [ConfigModule],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
