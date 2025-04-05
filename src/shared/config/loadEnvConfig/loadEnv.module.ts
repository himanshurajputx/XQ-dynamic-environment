import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DbConfigService, EnvConfigLoaderService } from './loadEnv.service';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://RFOneDB:UQGeGRsvmbqo1nsL@app-setting.gtnic6l.mongodb.net/?retryWrites=true&w=majority&appName=app-setting',
    ),
  ],
  controllers: [],
  providers: [DbConfigService, EnvConfigLoaderService],
})
export class LoadEnvModule {}
// UQGeGRsvmbqo1nsL
