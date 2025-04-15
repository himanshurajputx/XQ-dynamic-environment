import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Types } from "mongoose";
import { v4 as uuidv4 } from "uuid";

@Schema({ timestamps: true, collection: "sessions" }) // Ensure it matches the store collectionName
export class Session extends Document {
  @Prop({ type: String, default: () => uuidv4() })
  // @ts-ignore
  _id: string; // Session ID (Primary Key)

  @Prop({ required: true, type: Types.ObjectId, ref: "User" }) // Reference to User Model
  userId: Types.ObjectId;

  @Prop({ type: Object })
  data: any; // Store session data
}

export const SessionSchema = SchemaFactory.createForClass(Session);
