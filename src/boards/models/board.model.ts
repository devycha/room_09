import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, SchemaOptions, Types } from 'mongoose';
import { IsString, IsNotEmpty, IsArray } from 'class-validator';
import { User } from 'src/users/models/user.model';

export type BoardDocument = Board & Document;

const options: SchemaOptions = {
  timestamps: true,
};

@Schema(options)
export class Board {
  @IsString()
  @IsNotEmpty()
  @Prop({
    required: true,
  })
  title: string;

  @IsString()
  @IsNotEmpty()
  @Prop({
    required: true,
  })
  description: string;

  @Prop()
  comments: [
    {
      author: { type: Types.ObjectId; ref: 'User' };
      content: string;
    },
  ];

  @Prop({ type: Types.ObjectId, ref: 'User' })
  author: User;

  @Prop({ default: 0 })
  readCounts: number;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  // for hbs rendering
  @Prop()
  createdDate?: string;
}

export const BoardSchema = SchemaFactory.createForClass(Board);
