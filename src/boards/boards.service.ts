import { ConsoleLogger, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/models/user.model';
import { BoardsRepository } from './boards.repository';
import { CreateBoardDto } from './dtos/CreateBoardDto';
import { Board, BoardDocument } from './models/board.model';

@Injectable()
export class BoardsService {
  constructor(
    @InjectModel(Board.name)
    private readonly boardModel: Model<BoardDocument>,
  ) {}

  async findAllBoards(query?: any) {
    const boardsPages = Math.ceil((await this.boardModel.find().count()) / 15);
    const limit = query.limit || 15;
    let offset = 0;
    if (query.offset) {
      if (1 <= query.offset && query.offset <= boardsPages) {
        offset = query.offset - 1;
      }
    }

    const boardsInfo = await this.boardModel
      .find()
      .skip(offset * limit)
      .limit(limit)
      .sort({ createdAt: 'DESC' })
      .populate('author')
      .exec();

    const boards = this.encryptBoardInfo(boardsInfo);
    return { boards, boardsPages };
  }

  private encryptBoardInfo(boards: Board[]) {
    return boards.map((board) => {
      if (board.title.length > 15) {
        board.title = board.title.substring(0, 15) + '...';
      }
      board.author.code = this.encryptStudentCode(board.author.code);
      board.createdDate = board.createdAt.toLocaleString();
      return board;
    });
  }

  private encryptStudentCode(code: string) {
    if (code.length !== 8) {
      return code;
    } else {
      return code.substring(0, 2) + '****' + code.substring(6, 8);
    }
  }

  public async findBoardById(id: string) {
    const board = await this.boardModel.findById(id);
    if (!board) {
      throw new NotFoundException('일치하는 게시글 정보가 없습니다.');
    }
    return board;
  }

  public async findBoardByIdWithAuthor(id: string) {
    const board = await this.boardModel
      .findOne({ _id: id })
      .populate('author')
      .populate({ path: 'comments', select: 'author' });
    if (!board) {
      throw new NotFoundException('일치하는 게시글 정보가 없습니다.');
    }
    return board;
  }

  public async findBoardByIdAndAddReadCount(id: string) {
    const board = await this.findBoardByIdWithAuthor(id);
    board.readCounts++;
    await board.save();
    return board;
  }

  async postBoard(BoardDto: CreateBoardDto, user: User): Promise<Board> {
    const { title, description } = BoardDto;
    const newBoard = new this.boardModel({
      title,
      description,
      author: user,
    });
    await newBoard.save();
    return newBoard;
  }

  async postComment(user: User, id: string, commentBody: string) {
    const board = await this.findBoardById(id);
    const comment = { author: user, content: commentBody };
    const updateInfo = {
      comments: [...board.comments, comment],
    };
    await this.updateById(id, updateInfo);
  }

  async updateById(id: string, updateInfo: any) {
    await this.boardModel.findByIdAndUpdate(id, { $set: updateInfo });
  }

  async deleteBoardById(user: User | null, id: string) {
    const board = await this.findBoardByIdWithAuthor(id);
    if (user.id !== board.author.id) {
      return {
        success: false,
        message: '삭제 권한이 없습니다.',
      };
    } else {
      await this.boardModel.deleteOne({ _id: id });
      return {
        success: true,
        message: '성공적으로 삭제하였습니다.',
      };
    }
  }
}
