import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/users/models/user.model';

export type BookDocument = Book & Document;

const options = {
  timestamps: true,
};

@Schema(options)
export class Book {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  author: string;

  @Prop()
  price: number;

  @Prop()
  purchase: Date;

  @Prop()
  state: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  seller: User;

  id: any;
}

export const BookSchema = SchemaFactory.createForClass(Book);
