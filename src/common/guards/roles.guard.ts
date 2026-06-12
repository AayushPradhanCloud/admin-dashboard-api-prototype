import { type CanActivate, type ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLES_METADATA_KEY } from '~/common/decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[] | undefined>(ROLES_METADATA_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (!required || required.length === 0) return true;
    const req = ctx.switchToHttp().getRequest<{ user?: { roles?: string[] } }>();
    const userRoles = req.user?.roles ?? [];
    const ok = required.some((r) => userRoles.includes(r));
    if (!ok) throw new ForbiddenException(`Missing required role: one of [${required.join(', ')}]`);
    return true;
  }
}
