import { Module } from '@nestjs/common';
import { AuthenticationModule } from './authentication/authentication.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthenticationModule, UserModule],
  controllers: [],
  providers: [],
})
export class ComponentsModule {}
