import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { MailService } from '../mail/mail.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { User } from './models/user.model';
import { UsersRepository } from './users.repository';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async signUp(
    createUserDto: CreateUserDto,
  ): Promise<User | Record<string, unknown>> {
    const { code, password, grade, email, name } = createUserDto;
    const isExist = await this.usersRepository.isExistedUser({ code });
    if (isExist) {
      return {
        success: false,
        message: '이미 가입되어 있는 학번의 계정입니다.',
      };
      // throw new BadRequestException('이미 가입되어 있는 학번의 계정입니다');
    }

    const hash = await bcrypt.hash(password, 10);
    const newUser = await this.usersRepository.create({
      code,
      password: hash,
      grade,
      email,
      name,
    });
    const user = await newUser.save();
    await this.mailService.sendAuthMail(email, user.name, user._id);
    try {
      alert('가입하신 이메일 계정에서 인증을 완료해주세요.');
    } catch (err) {}
    return { success: true, user };
  }

  async signIn(signInDto: SignInDto) {
    const { code, password } = signInDto;
    const user = await this.usersRepository.findOne({ code });

    if (!user) {
      return {
        success: false,
        message: '학번 혹은 비밀번호가 일치하지 않습니다.',
      };
      // throw new NotFoundException('학번 혹은 비밀번호가 일치하지 않습니다.');
    }

    const pwdCorrect = await bcrypt.compare(password, user.password);

    if (!pwdCorrect) {
      return {
        success: false,
        message: '학번 혹은 비밀번호가 일치하지 않습니다.',
      };
      // throw new NotFoundException('학번 혹은 비밀번호가 일치하지 않습니다.');
    }

    const payload = {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      sub: user._id,
      name: user.name,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });

    return { success: true, accessToken, username: user.name };
  }
}
