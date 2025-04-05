import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';
import { uuidV2 } from '../helper/uuid.helper';

@Schema({ timestamps: true, collection: 'sessions' }) // Ensure it matches the store collectionName
export class Session extends Document {
  @Prop({ type: String, default: () => uuidV2() })
    // @ts-ignore
  _id: string; // Session ID (Primary Key)

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' }) // Reference to User Model
  userId: Types.ObjectId;

  @Prop({ type: Object })
  data: any; // Store session data
}

export const SessionSchema = SchemaFactory.createForClass(Session);
