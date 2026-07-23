export interface RefreshTokenPayload {
  sub: string;
  jti: string;
  email: string;
  refreshToken: string;
}
