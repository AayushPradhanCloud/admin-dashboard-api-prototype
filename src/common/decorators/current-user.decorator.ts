import { type ExecutionContext, createParamDecorator } from '@nestjs/common';

export interface AuthUser {
  id: string;
  username?: string;
  email?: string;
  roles: string[];
}

export const CurrentUser = createParamDecorator((_, ctx: ExecutionContext): AuthUser => {
  const req = ctx.switchToHttp().getRequest<{ user?: AuthUser }>();
  if (!req.user) throw new Error('CurrentUser decorator used without an authenticated request.');
  return req.user;
});
