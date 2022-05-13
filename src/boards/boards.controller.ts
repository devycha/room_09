import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/models/user.model';
import { UsersService } from '../users/users.service';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dtos/CreateBoardDto';

@ApiTags('자유게시판 모듈 API')
@Controller('boards')
export class BoardsController {
  constructor(private boardsService: BoardsService) {}

  @Get()
  async renderBoardsPage(
    @CurrentUser() currentUser: User,
    @Res() res: Response,
    @Query() query: any,
  ) {
    const { boards, boardsPages } = await this.boardsService.findAllBoards(
      query,
    );
    res.render('boards/boards', {
      boards,
      currentUser,
      boardsPages,
    });
  }

  @Get('/:id')
  async renderSpecificBoardPage(
    @CurrentUser() currentUser: User,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    if (!currentUser) {
      return res.redirect('/login');
    }
    const board = await this.boardsService.findBoardByIdAndAddReadCount(id);
    res.render('boards/board', { board, currentUser });
  }

  @Get('/new/board')
  async renderCreateBoardPage(
    @CurrentUser() currentUser: User,
    @Res() res: Response,
  ) {
    if (!currentUser) {
      return res.redirect('/login');
    }
    return res.render('boards/newBoard', { currentUser });
  }

  @Post()
  async postBoard(
    @CurrentUser() currentUser: User | null,
    @Body() BoardDto: CreateBoardDto,
    @Res() res: Response,
  ) {
    if (!currentUser) {
      res.redirect('/login');
    } else {
      const board = await this.boardsService.postBoard(BoardDto, currentUser);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      res.redirect(`/boards/${board._id}`);
    }
  }

  @Post('/:id/comment')
  async postComment(
    @CurrentUser() currentUser: User,
    @Param('id') id: string,
    @Res() res: Response,
    @Body('comment') comment: string,
  ) {
    if (!currentUser) {
      res.redirect('/login');
    }
    await this.boardsService.postComment(currentUser, id, comment);
    res.redirect(`/boards/${id}`);
  }

  @Delete('/:id')
  async deleteSpecificBoard(
    @CurrentUser() currentUser: User | null,
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (!currentUser) {
      req.flash('fail', '접근 권한이 없습니다.');
      return res.redirect(`/boards/${id}`);
    }

    const result = await this.boardsService.deleteBoardById(currentUser, id);

    if (result.success) {
      res.redirect('/boards');
    } else {
      req.flash('fail', '접근 권한이 없습니다.');
      return res.redirect(`/boards/${id}`);
    }
  }
}
