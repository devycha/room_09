import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/models/user.model';
import { AnswerQuestionDto } from './dtos/answer-question.dto';
import { CreateQuestionDto } from './dtos/create-question.dto';
import { QuestionsService } from './questions.service';

@ApiTags('질문 모듈 API')
@Controller('qna')
export class QuestionsController {
  constructor(private questionsService: QuestionsService) {}

  @ApiOperation({ summary: '질문 페이지 랜더링' })
  @Get('/')
  async renderQuestionPage(
    @Res() res: Response,
    @CurrentUser() currentUser: User,
    @Query() query: any,
  ) {
    const { questions, questionPages } =
      await this.questionsService.getAllQuestions(query);
    res.render('serve/qna', { questions, questionPages, currentUser });
  }

  @ApiOperation({ summary: '질문글 만들기' })
  @Post('/')
  async postQuestion(
    @CurrentUser() currentUser: User,
    @Body() questionDto: CreateQuestionDto,
    @Res() res: Response,
  ) {
    if (!currentUser) {
      return res.redirect('/qna');
    }
    await this.questionsService.createQuestion(questionDto);
    res.redirect('/qna');
  }

  @Post('/:id')
  async answerQuestion(
    @Param('id') id: string,
    @Body() body: AnswerQuestionDto,
    @Res() res: Response,
  ) {
    await this.questionsService.answerQuestion(id, body);
    res.redirect('/qna');
  }

  @ApiOperation({ summary: '질문글 업데이트' })
  @Patch('/:id')
  async updateQuestion(
    @Body() questionDto: CreateQuestionDto,
    @Param('id') id: string,
  ): Promise<void> {
    await this.questionsService.updateQuestionById(id, questionDto);
  }

  @ApiOperation({ summary: '질문글 삭제' })
  async deleteQuestion(@Param('id') id: string) {
    await this.questionsService.deleteQuestion(id);
  }
}
