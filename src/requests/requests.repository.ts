import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request, RequestDocument } from './models/request.model';
import { PostRequestDto } from './dtos/post-request.dto';
import { User } from '../users/models/user.model';

@Injectable()
export class RequestsRepository {
  constructor(
    @InjectModel(Request.name) private requestModel: Model<RequestDocument>,
  ) {}

  async create(requestDto: PostRequestDto, user: User): Promise<Request> {
    const request = await this.requestModel.create({
      ...requestDto,
      writer: user,
    });

    await request.save();
    return request;
  }
}
