import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AnswerQuestionDto } from './dtos/answer-question.dto';
import { CreateQuestionDto } from './dtos/create-question.dto';
import { Question, QuestionDocument } from './models/question.model';

@Injectable()
export class QuestionsRepository {
  constructor(
    @InjectModel(Question.name) private questionModel: Model<QuestionDocument>,
  ) {}

  async getAllQuestions(): Promise<Question[]> {
    const questions = await this.questionModel.find({});
    return questions;
  }

  async create(createQuestionDto: CreateQuestionDto): Promise<Question> {
    const createQuestion = new this.questionModel(createQuestionDto);
    await createQuestion.save();
    return createQuestion;
  }

  async findById(id: string): Promise<Question> {
    const question = await this.questionModel.findById(id);
    return question;
  }

  async update(
    id: string,
    updateQuestionDto: CreateQuestionDto | AnswerQuestionDto,
  ): Promise<Question> {
    const question = await this.questionModel.findByIdAndUpdate(id, {
      $set: updateQuestionDto,
    });
    return question;
  }

  async delete(id: string): Promise<void> {
    await this.questionModel.findByIdAndDelete(id);
  }
}
