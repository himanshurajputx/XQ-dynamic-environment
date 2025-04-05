import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongodbModule, ConfigModule, ProtectedRoutesMiddleware } from './shared/';
import { ComponentsModule } from './components/components.module';
import { RequestLoggerMiddleware } from './shared';
import { CustomJwtModule } from './shared/jwt/custom.jwt.module';

@Module({
  imports: [ConfigModule, MongodbModule, ComponentsModule, CustomJwtModule],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('');
    consumer
      .apply(ProtectedRoutesMiddleware)
      .exclude(
        // @ts-ignore
        { path: 'authentication/login', method: 'POST' },
        { path: 'authentication/register', method: 'POST' },
      )
      .forRoutes(''); // apply middleware for all other routes
  }
}
