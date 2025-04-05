import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { UserModule } from '../user/user.module';
import { IsUserAlreadyExist, CustomJwtModule } from '../../shared';

@Module({
  imports: [UserModule, CustomJwtModule],
  providers: [AuthenticationService, IsUserAlreadyExist],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
