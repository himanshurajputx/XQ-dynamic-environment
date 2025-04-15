import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MongodbProviders } from "./mongodb.providers";
import { ConfigModule, ConfigService } from "../../config";
import { RequestLog, RequestLogSchema } from "../../schema/request-log.schema";
import { Session, SessionSchema } from "../../schema/session.schema";

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService): { uri: string } => ({
        uri: config.get("MONGO_URL"),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: RequestLog.name, schema: RequestLogSchema },
      { name: Session.name, schema: SessionSchema },
    ]), // Register schemas
  ],
  providers: [...MongodbProviders],
  exports: [...MongodbProviders, MongooseModule],
})
export class MongodbModule {}
