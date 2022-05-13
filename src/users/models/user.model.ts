import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaOptions, Types } from 'mongoose';

import {
  IsString,
  IsEmail,
  IsNotEmpty,
  Min,
  Max,
  IsNumber,
} from 'class-validator';

export type UserDocument = User & Document;

const options: SchemaOptions = {
  timestamps: true,
};

@Schema(options)
export class User {
  [x: string]: any;
  @IsString()
  @IsNotEmpty()
  @Prop({
    required: true,
    unique: true,
  })
  code: string;

  @IsString()
  @IsNotEmpty()
  @Prop({
    required: true,
  })
  password: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(4)
  @Prop({
    required: true,
  })
  grade: number;

  @IsEmail()
  @IsNotEmpty()
  @Prop({
    required: true,
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @Prop({
    required: true,
  })
  name: string;

  @Prop({ default: false })
  isAuthenticated: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
