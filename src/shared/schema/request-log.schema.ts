import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

@Schema({ timestamps: true })
export class RequestLog extends Document {
  @Prop({ type: String, default: () => uuidv4() })
  // @ts-ignore
  _id: string;

  @Prop({ required: true })
  request_id: string;

  @Prop({ required: true })
  method: string;

  @Prop({ required: true })
  url: string;

  @Prop({ type: MongooseSchema.Types.Mixed }) // ✅ Fix: Explicitly define type
  body: Record<string, any>;

  @Prop({ type: MongooseSchema.Types.Mixed }) // ✅ Fix: Explicitly define type
  headers: Record<string, any>;

  @Prop()
  ip: string;
}

export const RequestLogSchema = SchemaFactory.createForClass(RequestLog);
