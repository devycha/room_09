import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type flashType = {
  success?: string[];
  fail?: string[];
};

export const CurrentFlashes = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();

    const success = req.flash('success');
    const fail = req.flash('fail');

    const flashMessage: flashType = fail.length
      ? { fail: fail[0] }
      : success.length
      ? { success: success[0] }
      : null;

    return flashMessage;
  },
);
