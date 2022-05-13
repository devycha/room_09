import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AppService } from './app.service';
import { CurrentFlashes } from './common/decorators/current-flash.decorator';
import { CurrentUser } from './users/decorators/current-user.decorator';
import { User } from './users/models/user.model';
import { UsersService } from './users/users.service';

@ApiTags('앱 페이지 렌더링 루트모듈 API')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async main(
    @CurrentUser() currentUser: User,
    @Res() res: Response,
    @CurrentFlashes() flashMessage: Record<string, string>,
  ) {
    const boardsList = await this.appService.getBoardsList();
    const questionsList = await this.appService.getQuestionsList();
    res.render('room/room', {
      currentUser: currentUser,
      ...flashMessage,
      boardsList,
      questionsList,
    });
  }

  @Get('/signup')
  renderSignUpPage(
    @CurrentUser() currentUser: User,
    @Res() res: Response,
    @CurrentFlashes() flashMessage: Record<string, string>,
  ) {
    if (currentUser) {
      res.redirect('/');
    }
    res.render('room/register', flashMessage);
  }

  @Get('/login')
  renderLogInPage(
    @Res() res: Response,
    @CurrentFlashes() flashMessage: Record<string, string>,
  ) {
    res.render('room/login', flashMessage);
  }

  @Get('/logout')
  logout(@Req() req: Request, @Res() res: Response) {
    req.user = null;
    res.clearCookie('authToken').redirect('/login');
  }

  @Get('/intro')
  renderIntroPage(@CurrentUser() currentUser: string, @Res() res: Response) {
    res.render('serve/intro', { currentUser: currentUser });
  }

  @Get('/request')
  renderRequestPage(@CurrentUser() currentUser: string, @Res() res: Response) {
    res.render('serve/request', { currentUser: currentUser });
  }

  @Get('/map')
  renderMapPage(@CurrentUser() currentUser: string, @Res() res: Response) {
    res.render('serve/map', {
      KAKAO_JS_KEY: process.env.KAKAO_KEY,
      currentUser: currentUser,
    });
  }
}
