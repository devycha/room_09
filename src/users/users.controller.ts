import {
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Res,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';

import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './models/user.model';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { SignInDto } from './dtos/sign-in.dto';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

import { ChangePasswordDto } from './dtos/change-password.dto';
import { CurrentFlashes } from '../common/decorators/current-flash.decorator';
@ApiTags('유저 모듈 API')
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @ApiOperation({ summary: '회원가입' })
  @Post('/signup')
  async signUp(
    @Body() createUserDto: CreateUserDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const result = await this.authService.signUp(createUserDto);
    if (result.success) {
      const { code, password } = createUserDto;
      await this.signIn({ code, password }, req, res);
    } else {
      // 회원가입 실패 시
      req.flash('fail', '이미 가입되어있는 학번의 계정입니다.');
      res.redirect('/signup');
      // res.render('/signup', { messages: req.flash('success') });
      // res.send('이미 가입되어 있는 학번의 계정입니다.');
    }
  }

  @ApiOperation({ summary: '이메일 인증 링크 클릭' })
  @Get('/authmail/:id')
  async authMailCheck(@Param('id') id: string, @Res() res: Response) {
    const user = await this.usersService.findUserById(id);
    user.isAuthenticated = true;
    await user.save();
    res.redirect('/');
  }

  @ApiOperation({ summary: '로그인' })
  @Post('/login')
  async signIn(
    @Body() signInDto: SignInDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.signIn(signInDto);
    if (result.success) {
      const { accessToken, username } = result;
      req.flash('success', `${username}님 환영합니다.`);
      res.cookie('authToken', { accessToken }).redirect('/');
    } else {
      const { message } = result;
      req.flash('fail', message);
      res.redirect('/login');
    }
  }

  @ApiOperation({ summary: '모든 유저 검색' })
  @UseGuards(JwtAuthGuard)
  @Get('/')
  async findAllUsers(@Req() req: Request, @Res() res: Response) {
    const users = await this.usersService.findAllUsers();
    res.render('/serve/users', { users });
  }

  @ApiOperation({ summary: 'ID로 유저 검색' })
  @Get()
  async findUserById(@Param('id') id: string) {
    return this.usersService.findUserById(id);
  }

  @ApiOperation({ summary: '유저 정보 업데이트' })
  @Patch('/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
    @CurrentUser() currentUser: User | null,
  ) {
    if (!currentUser) {
      return res.redirect('/');
    }

    if (currentUser.id !== id) {
      return res.redirect('/');
    }

    await this.usersService.updateUser(id, updateUserDto);

    res.redirect('/users/mypage');
  }

  @ApiOperation({ summary: '유저 삭제' })
  @Delete()
  async deleteUser(
    @Param('id') id: string,
    @Res() res: Response,
    @CurrentUser() currentUser: User | null,
  ) {
    if (!currentUser) {
      res.redirect('/');
    }

    if (currentUser.id !== id) {
      res.redirect('/');
    }

    return this.usersService.deleteUser(id);
  }

  @ApiOperation({ summary: '마이페이지 정보변경 링크 클릭' })
  @Get('/mypage')
  async renderMyPage(
    @CurrentUser() currentUser: User | null,
    @Res() res: Response,
  ) {
    if (!currentUser) {
      return res.redirect('/login');
    }
    try {
      res.render('serve/mypage', {
        currentUser,
      });
    } catch (err) {
      res.redirect('/login');
    }
  }

  @ApiOperation({ summary: '마이페이지 비밀번호변경 링크 클릭' })
  @Get('/mypage/password')
  async renderChangePasswordPage(
    @CurrentUser() currentUser: User | null,
    @Res() res: Response,
    @CurrentFlashes() flashMessage: Record<string, string>,
  ) {
    if (!currentUser) {
      return res.redirect('/login');
    }

    res.render('serve/change-password', { currentUser, ...flashMessage });
  }

  @ApiOperation({ summary: '비밀번호 변경하기' })
  @Patch(':id/password')
  async changePassword(
    @CurrentUser() currentUser: User | null,
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    if (!currentUser) {
      return res.redirect('/login');
    }

    const result = await this.usersService.changePassword(
      currentUser,
      changePasswordDto,
    );

    // 변경 실패시
    if (!result.success) {
      req.flash('fail', result.message);
      res.redirect('/users/mypage/password');
    } else {
      req.flash('success', result.message);
      res.redirect('/logout');
    }
  }
}
