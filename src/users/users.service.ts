import { Injectable, NotFoundException } from '@nestjs/common';
import bcrypt from 'bcrypt';

import { ChangePasswordDto } from './dtos/change-password.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './models/user.model';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async findAllUsers(): Promise<User[]> {
    return this.usersRepository.findAll();
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.usersRepository.findUserById(id);
    if (!user) {
      throw new NotFoundException('해당하는 유저 정보가 없습니다.');
    }
    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findUserById(id);
    if (user) {
      return await this.usersRepository.updateUser(id, updateUserDto);
    }
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.findUserById(id);
    if (user) {
      await this.usersRepository.deleteUser(id);
    }
  }

  async changePassword(user: User, changePasswordDto: ChangePasswordDto) {
    const { prevPassword, newPassword, newPasswordRepeat } = changePasswordDto;

    if (newPassword !== newPasswordRepeat) {
      return {
        success: false,
        message: '비밀번호가 옳바르지 않습니다.',
      };
    }

    if (prevPassword === newPassword) {
      return {
        success: false,
        message: '이전과 같은 비밀번호로 변경할 수 없습니다.',
      };
    }
    const isCorrectPrevPassword = await bcrypt.compare(
      prevPassword,
      user.password,
    );

    if (!isCorrectPrevPassword) {
      return {
        success: false,
        message: '비밀번호가 옳바르지 않습니다.',
      };
    }

    user.password = await bcrypt.hash(newPassword, 10);
    const changePasswordUser = await user.save();

    return {
      success: true,
      message: '성공적으로 변경되었습니다. 다시 로그인하여 주시기 바랍니다.',
      user: changePasswordUser,
    };
  }
}
