import { Injectable } from '@nestjs/common';
import { BoardsService } from './boards/boards.service';
import { Board } from './boards/models/board.model';
import { Question } from './questions/models/question.model';
import { QuestionsService } from './questions/questions.service';

@Injectable()
export class AppService {
  constructor(
    private readonly boardsService: BoardsService,
    private readonly questionsService: QuestionsService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getBoardsList(): Promise<Board[]> {
    const boards = (await this.boardsService.findAllBoards({ limit: 10 }))
      .boards;
    return boards;
  }

  async getQuestionsList(): Promise<Question[]> {
    const questions = (
      await this.questionsService.getAllQuestions({
        limit: 5,
      })
    ).questions;
    return questions;
  }
}
