import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Session, SessionSchema } from '../../schema/session.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }]), // ✅ Register Mongoose Model
  ],
  providers: [SessionService],
  exports: [SessionService], // ✅ Exporting to use in other modules
})
export class SessionModule {}
