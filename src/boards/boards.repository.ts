import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/models/user.model';
import { CreateBoardDto } from './dtos/CreateBoardDto';

import { Board, BoardDocument } from './models/board.model';

@Injectable()
export class BoardsRepository {
  constructor(
    @InjectModel(Board.name) private boardModel: Model<BoardDocument>,
  ) {}

  async create(BoardDto: CreateBoardDto, user: User) {
    const { title, description } = BoardDto;
    const newBoard = new this.boardModel({
      title,
      description,
      author: user,
    });
    await newBoard.save();
    return newBoard;
  }

  async findAll(): Promise<Board[]> {
    const boards = await this.boardModel.find().populate('author').exec();
    return boards;
  }

  async findById(id: string): Promise<Board> {
    const board = await this.boardModel.findById(id);
    return board;
  }

  async updateById(id: string, updateInfo: any) {
    await this.boardModel.findByIdAndUpdate(id, { $set: updateInfo });
  }
}
