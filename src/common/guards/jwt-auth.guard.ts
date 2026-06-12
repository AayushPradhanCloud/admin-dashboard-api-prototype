import { Inject, Injectable, UnauthorizedException, type CanActivate, type ExecutionContext } from '@nestjs/common';

import { createRemoteJWKSet, jwtVerify, type JWTPayload } from 'jose';

import { AUTH_CONFIG, type AuthConfig } from '~/common/config/auth-config.token';

interface KeycloakClaims extends JWTPayload {
  sub: string;
  preferred_username?: string;
  email?: string;
  realm_access?: { roles?: string[] };
  resource_access?: Record<string, { roles?: string[] }>;
}

interface RequestWithUser {
  headers: Record<string, string | string[] | undefined>;
  user?: { id: string; username?: string; email?: string; roles: string[] };
}

/**
 * Validates the incoming Bearer JWT against the Keycloak realm's JWKS.
 *
 *   - Validation is local (no per-request introspection call to Keycloak).
 *   - JWKS is cached by `jose` and rotated automatically.
 *   - On success, attaches { id, username, email, roles } to req.user.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly jwks: ReturnType<typeof createRemoteJWKSet>;

  constructor(@Inject(AUTH_CONFIG) private readonly authConfig: AuthConfig) {
    this.jwks = createRemoteJWKSet(new URL(authConfig.jwksUrl));
  }

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<RequestWithUser>();
    const header = req.headers.authorization;
    const auth = Array.isArray(header) ? header[0] : header;
    if (!auth?.startsWith('Bearer ')) throw new UnauthorizedException('Missing bearer token');
    const token = auth.slice('Bearer '.length);

    try {
      const { payload } = await jwtVerify(token, this.jwks, {
        issuer: this.authConfig.issuer,
      });
      const claims = payload as KeycloakClaims;
      const realmRoles = claims.realm_access?.roles ?? [];
      const clientRoles = claims.resource_access?.[this.authConfig.clientId]?.roles ?? [];
      req.user = {
        id: claims.sub,
        roles: [...realmRoles, ...clientRoles],
        ...(claims.preferred_username !== undefined ? { username: claims.preferred_username } : {}),
        ...(claims.email !== undefined ? { email: claims.email } : {}),
      };
      return true;
    } catch (err) {
      throw new UnauthorizedException(`Invalid token: ${(err as Error).message}`);
    }
  }
}
