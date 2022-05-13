import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { UsersRepository } from '../users.repository';

@Injectable()
export class TokenAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private usersRepository: UsersRepository,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    if (request.cookies?.token?.accessToken) {
      const { accessToken } = request.cookies.token;
      const payload = this.jwtService.verify(accessToken);
      if (payload.sub) {
        return true;
      }
      return false;
    }
    return false;
  }
}
