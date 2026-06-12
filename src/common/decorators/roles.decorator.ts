import { SetMetadata } from '@nestjs/common';

export const ROLES_METADATA_KEY = 'roles';

/**
 * Mark a route handler as requiring one of the given Keycloak roles.
 *
 *   @Roles('admin', 'resource:write')
 *   @Post()
 *   create(...) { ... }
 */
export const Roles = (...roles: string[]): MethodDecorator & ClassDecorator => SetMetadata(ROLES_METADATA_KEY, roles);
