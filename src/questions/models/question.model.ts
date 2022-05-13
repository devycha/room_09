import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaOptions, Types } from 'mongoose';
import { IsString, IsNotEmpty } from 'class-validator';

export type QuestionDocument = Question & Document;

const options: SchemaOptions = {
  timestamps: true,
};

@Schema(options)
export class Question {
  @IsString()
  @IsNotEmpty()
  @Prop({
    required: true,
  })
  question: string;

  @IsString()
  @Prop({
    default: ['아직 등록된 답변이 없습니다'],
  })
  answers: string[];
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
