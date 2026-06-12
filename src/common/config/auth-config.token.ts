export interface AuthConfig {
  jwksUrl: string;
  issuer: string;
  clientId: string;
}

export const AUTH_CONFIG = Symbol('AUTH_CONFIG');
