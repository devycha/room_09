import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { PostRequestDto } from './dtos/post-request.dto';
import { RequestsService } from './requests.service';
import { User } from '../users/models/user.model';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('요청사항 모듈 API')
@Controller('requests')
export class RequestsController {
  constructor(private requestsService: RequestsService) {}

  @Post()
  async postRequest(
    @CurrentUser() currentUser: User,
    @Body() requestDto: PostRequestDto,
    @Res() res: Response,
  ) {
    if (!currentUser) {
      res.redirect('/login');
    }
    try {
      await this.requestsService.postRequest(requestDto, currentUser);
      res.render('room/room', { currentUser });
    } catch (err) {
      res.redirect('/login');
    }
  }
}
