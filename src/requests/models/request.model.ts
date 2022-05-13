import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/models/user.model';

export type RequestDocument = Request & Document;

const options: SchemaOptions = {
  timestamps: true,
};

@Schema(options)
export class Request {
  @Prop({ required: true })
  requestOption: string;

  @Prop({ required: true })
  requestData: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  writer: User;
}

export const RequestSchema = SchemaFactory.createForClass(Request);
