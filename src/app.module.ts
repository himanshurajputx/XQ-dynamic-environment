import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import {
  MongodbModule,
  ConfigModule,
  // ProtectedRoutesMiddleware,
} from "./shared/";
import { ComponentsModule } from "./components/components.module";
import {
  RequestLoggerMiddleware,
  LogsModule,
  MailModule,
  CustomJwtModule,
} from "./shared";
import { UserModule } from "./components/user/user.module";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
@Module({
  imports: [
    ConfigModule,
    MongodbModule,
    UserModule,
    ComponentsModule,
    CustomJwtModule,
    LogsModule,
    MailModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60,
          limit: 2,
        },
      ],
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes("");
    // consumer
    //   .apply(ProtectedRoutesMiddleware)
    //   .exclude(
    //     // @ts-ignore
    //     { path: "authentication/login", method: "POST" },
    //     { path: "authentication/register", method: "POST" },
    //     { path: "user/mx", method: "POST" },
    //     { path: "api/app-settings", method: "POST" },
    //     { path: "lead/app-create", method: "POST" },
    //     { path: "health", method: "GET" },
    //   )
    //   .forRoutes(""); // apply middleware for all other routes
  }
}
