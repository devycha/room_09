import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../users/users.service';

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (!req.cookies['authToken']) {
      req.user = null;
      next();
    } else {
      try {
        const { accessToken } = req.cookies['authToken'];
        const payload = this.jwtService.verify(accessToken);
        const userId = payload.sub;
        const user = await this.usersService.findUserById(userId);
        req.user = user;
        next();
      } catch (err) {
        req.user = null;
        next();
      }
    }
  }
}
