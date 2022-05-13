import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AnswerQuestionDto } from './dtos/answer-question.dto';
import { CreateQuestionDto } from './dtos/create-question.dto';
import { Question, QuestionDocument } from './models/question.model';
import { QuestionsRepository } from './question.repository';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel(Question.name) private questionModel: Model<QuestionDocument>,
  ) {}

  async getAllQuestions(
    query?: any,
  ): Promise<{ questions: Question[]; questionPages: number }> {
    const limit = query.limit || 5;
    const questionPages = Math.ceil(
      (await this.questionModel.find().count()) / limit,
    );
    let offset = 0;
    if (1 <= query.offset && query.offset <= questionPages) {
      offset = query.offset - 1;
    }

    const questions = await this.questionModel
      .find()
      .skip(offset * limit || 0)
      .limit(limit || 5)
      .sort({ createdAt: 'DESC' })
      .exec();

    const questionPage = questions.length;
    return { questions, questionPages };
  }

  async createQuestion(
    createQuestionDto: CreateQuestionDto,
  ): Promise<Question> {
    const createQuestion = new this.questionModel(createQuestionDto);
    await createQuestion.save();
    return createQuestion;
  }

  async findQuestionById(id: string): Promise<Question> {
    const question = await this.questionModel.findById(id);
    if (!question) {
      throw new NotFoundException('해당 질문은 존재하지 않습니다.');
    }
    return question;
  }

  async answerQuestion(id: string, body: AnswerQuestionDto) {
    const question = await this.questionModel.findById(id);
    const answers = question.answers;
    const { answer } = body;
    if (answers[0] == '아직 등록된 답변이 없습니다') {
      question.answers = [answer];
    } else {
      question.answers = [...question.answers, answer];
    }
    await question.save();
  }

  async updateQuestionById(
    id: string,
    updateQuestionDto: CreateQuestionDto | AnswerQuestionDto,
  ): Promise<Question> {
    const question = await this.questionModel.findByIdAndUpdate(id, {
      $set: updateQuestionDto,
    });
    return question;
  }

  async deleteQuestion(id: string) {
    await this.questionModel.findByIdAndDelete(id);
  }
}
