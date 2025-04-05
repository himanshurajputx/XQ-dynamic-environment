import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Session } from '../../schema/session.schema';
import { ConfigService } from '../../config';

@Injectable()
export class SessionService {
  constructor(
    @InjectModel(Session.name) private sessionModel: Model<Session>,
    readonly configService: ConfigService,
  ) {}
  // getSessionStore(isProduction: boolean): any {
  //   console.log('======>>>>', isProduction);
  //   const sessionStore = !isProduction
  //     ? new session.MemoryStore()
  //     : MongoStore.create({
  //         client: this.connection.client, // Use the existing connection object directly
  //         collectionName: 'sessions', // Sessions collection
  //         ttl: 14 * 24 * 60 * 60, // Session expiration (14 days)
  //         autoRemove: 'interval', // Cleanup expired sessions
  //         autoRemoveInterval: 10, // Every 10 minutes
  //       });
  //
  //   return sessionStore;
  // }
}
