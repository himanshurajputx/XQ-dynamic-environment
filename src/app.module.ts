import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import {
  MongodbModule,
  ConfigModule,
  ProtectedRoutesMiddleware,
} from "./shared/";
import { ComponentsModule } from "./components/components.module";
import {
  RequestLoggerMiddleware,
  LogsModule,
  MailModule,
  CustomJwtModule,
} from "./shared";
import { UserModule } from "./components/user/user.module";

@Module({
  imports: [
    ConfigModule,
    MongodbModule,
    UserModule,
    ComponentsModule,
    CustomJwtModule,
    LogsModule,
    MailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes("");
    consumer
      .apply(ProtectedRoutesMiddleware)
      .exclude(
        // @ts-ignore
        { path: "authentication/login", method: "POST" },
        { path: "authentication/register", method: "POST" },
        { path: "user/mx", method: "POST" },
        { path: "api/app-settings", method: "POST" },
      )
      .forRoutes(""); // apply middleware for all other routes
  }
}
